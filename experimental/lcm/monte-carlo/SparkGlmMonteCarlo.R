library(SparkR) 
sparkR.session(appName = "SparkR-GLM-Monte-Carlo", spark.executor.memory = "16g") 
 
runCount = 1000 
inputPath = "/data/LandCoverModel/spark_io/LCM_25m_combined/part*" 
outputPath = "/data/LandCoverModel/spark_io/sparkGlmResult" 
tmpPath = "/data/LandCoverModel/spark_io/tmp_sparkGlmRunData" 
 
# Expected processed Land Cover Map data schema 
totrich.wide.schema <- structType(structField("TOTRICH78", "integer"), structField("TOTRICH90", "integer"), structField("TOTRICH98", "integer"), structField("TOTRICH07", "integer"),  
  structField("PIX_DIST", "string"), structField("MODAL_CLASS", "integer"), structField("REPEAT_PLO", "string")) 
 
# Read Land Cover Map data to Spark Data Frame - wide table 
totrich.wide <- read.df(path = inputPath, source = "csv", schema = totrich.wide.schema) 
 
# Drop "REPEAT_PLO" duplicates 
totrich.wide.trim <- dropDuplicates(totrich.wide, "REPEAT_PLO") 
 
# Function to restucture to long table 
reshapeTR <- function(columnYear) { 
  colnName <- columnYear[1] 
  yrValue <- columnYear[2] 
    longTable <- select(totrich.wide.trim, colnName, "PIX_DIST", "MODAL_CLASS", "REPEAT_PLO") 
    longTable$YR <- lit(yrValue) 
    withColumnRenamed(longTable, colnName, "TOTRICH") 
} 
 
# Restucture Land Cover Map data to long table 
columnYearLabels <- list(c("TOTRICH78", "1978"), c("TOTRICH90", "1990"), c("TOTRICH98", "1998"), c("TOTRICH07", "2007")) 
totrich <- do.call(rbind, lapply(columnYearLabels, reshapeTR)) 
 
# Function to resample pixel distributions using SparkR tools 
pixDistSampler <- function(longTable) { 
    # Input is a fragment of a Spark Data Frame 
    nrows <- nrow(longTable) 
    for(i in 1:nrows){ 
        row <- longTable[i,] 
        pixDist.counts <- as.double(unlist(strsplit(row$PIX_DIST, ","))) 
        pixDist.randCount <- sum(pixDist.counts) * row$RAND 
        pixDist.csum <- cumsum(pixDist.counts) 
        pixDist.idx <- which(pixDist.csum >= pixDist.randCount) 
        longTable[i,6] <-  as.integer(pixDist.idx[1]) 
    } 
    longTable 
} 
 
# Schema for the output from the resampler 
pixDistSampler.schema <- structType(structField("TOTRICH", "integer"), structField("PIX_DIST", "string"),  structField("YR", "string"), structField("REPEAT_PLO", "string"), 
  structField("RAND", "double"), structField("MODAL_CLASS", "integer")) 
 
# Monte Carlo Simulation using PQL 
sparkGlmMC <- function(runIdx) { 
    runSelect <- select(totrich, "TOTRICH", "PIX_DIST", "YR", "REPEAT_PLO")  
    runData <- dapply(withColumn(runSelect, "RAND", rand()), pixDistSampler, pixDistSampler.schema) 
    runDataMut <- mutate(runData, TOTRICH = (runData$TOTRICH + 1L), MODAL_CLASS = cast(runData$MODAL_CLASS, "string"), YEAR = cast(runData$YR, "integer"))
    runPredData <- distinct(select(runDataMut, "MODAL_CLASS", "YR")) 
    # Spark GLM issue causes Spark Context to intermittently crash, write and reload data from disk 
    write.df(runDataMut, path = tmpPath, source = "csv", mode = "overwrite") 
    # Reload data from disk 
    runDataCollected <- read.df(path = tmpPath, source = "csv", schema = schema(runDataMut)) 
    # Use collected data for the model fitting 
    runFit <- glm(TOTRICH~MODAL_CLASS+YR+MODAL_CLASS:YR, family = poisson, data = runDataCollected) 
    runOutput <- predict(runFit, newData = runPredData) 
    repart <- repartition(runOutput, 1) 
    write.df(repart, path=outputPath, source="csv", mode="append") 
} 
 
# Run MC stimulation 
pqlMCOutput <- lapply(seq(runCount), sparkGlmMC)
