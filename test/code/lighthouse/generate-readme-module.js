const fs = require('fs');
const prettier = require('prettier');

const REPORTS_DIR = 'reports';

function generateReadme(baseUrl) {
  const readmeTemplate = fs.readFileSync('resources/readme-template.md').toString();
  const rawOutput = readmeTemplate.replace('{{ summary of results }}', generateResultsSection(baseUrl));
  const prettifiedOutput = prettier.format(rawOutput, { parser: 'markdown' });
  fs.writeFileSync('README.md', prettifiedOutput);
}

function generateResultsSection(baseUrl) {
  const resultsIntro = generateResultsSectionIntro(baseUrl);
  const resultsTable = generateResultsTable(baseUrl);

  return [
    resultsIntro,
    resultsTable,
  ].join('\n');
}

function generateResultsSectionIntro(baseUrl) {
  let resultsIntro = 'The following table shows Lighthouse results obtained for each of the pages currently available in the web-app.\n';
  if (baseUrl) resultsIntro = resultsIntro.concat(`All endpoints were tested against ${baseUrl} unless given otherwise.\n`);
  return resultsIntro;
}

function generateResultsTable(baseUrl) {
  const baseUrlNoTrailingSlash = noTrailingSlashUrl(baseUrl);
  const columnOrder = ['accessibility', 'performance', 'best-practices', 'seo'];
  const resultTableRows = [];
  let resultsTableHeader = '';

  const reportFiles = fs.readdirSync(REPORTS_DIR);
  reportFiles.forEach((file) => {
    let report;
    const filePath = `${REPORTS_DIR}/${file}`;
    try {
      report = JSON.parse(fs.readFileSync(`${REPORTS_DIR}/${file}`).toString());
    } catch (error) {
      console.error(`Error reading report from ${filePath}:\n`, error);
      return;
    }

    if (!resultsTableHeader) resultsTableHeader = generateResultsHeaderRow(columnOrder, report);

    const rowParts = [
      report.finalUrl.replace(baseUrlNoTrailingSlash, ''),
      file,
    ];
    columnOrder.forEach(
      columnName => rowParts.push(
        (report.categories[columnName].score * 100).toFixed(0),
      ),
    );

    resultTableRows.push(generateMarkdownTableRow(rowParts));
  });

  return [
    resultsTableHeader,
    ...resultTableRows.sort(), // sorts rows alphabetically (results in alphabetical URL sorting as it is the first column).
  ].join('\n');
}

function generateResultsHeaderRow(columnOrder, report) {
  const columnHeadings = ['Endpoint', 'Report File'];
  const hyphenRow = ['---', '---']; // used to build the hyphen row necessary as the second row in a markdown table

  columnOrder.forEach((value) => {
    columnHeadings.push(`${report.categories[value].title} (%)`);
    hyphenRow.push(':---:'); // center align columns
  });

  return [
    generateMarkdownTableRow(columnHeadings),
    generateMarkdownTableRow(hyphenRow),
  ].join('\n');
}

function generateMarkdownTableRow(columnData) {
  return `| ${columnData.join(' | ')} |`;
}

function noTrailingSlashUrl(url) {
  // find and replace any forward slash that is the last character in the url
  return url.replace(/\/$/, '');
}

module.exports = generateReadme;
