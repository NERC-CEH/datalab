# Geographic Information Systems Data

Geographic informations systems (GIS) data are anticipated feature heavily in the
analyses run with the data labs project. This is stored either raster or vector data in a
variety of file types. We have found the tools below very helpful to when using GIS data.

## Converting vector data to SQLite database or GeoJSON

The `gdal`  command line tools can be used to convert between GIS vector file
types. The examples below show conversion to SQLite and GeoJSON file types. Further
information can be found at the gdal site ([link](http://www.gdal.org/ogr2ogr.html)).

```sh
# Note, argument order is output file then source file!
# Using the "-gt 655536" argument increases the number of row to enter at a time this
# significantly speeds up conversion.
ogr2ogr -f "SQLite" -gt 655536 DISTINATION-FILE SOURCE-FILE-OR-DIRECTORY
```

```sh
ogr2ogr -f "GeoJSON" DISTINATION-FILE SOURCE-FILE-OR-DIRECTORY
```

## Further processing of GeoJSON files

Converting large maps can generated very large GeoJSON file, this can prohibit them from
being processed using standard tools in memory. Streaming the json file with `jq` can
overcome this limitation. The following command will stream the source GeoJSON containing
a FeatureCollection as a collapsed array of Features. These files can them be stored, for
example, in a MongoDB for processing with spark etc.

```sh
cat SOURCE.json | jq -nc --stream 'fromstream(1|truncate_stream(inputs))' > OUTPUT.json

```
