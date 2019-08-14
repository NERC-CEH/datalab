const returnValue = {};
let storedLastQuery = '';
let storedLastOptions = {};

function clearResult() {
  Object.keys(returnValue).forEach((key) => { delete returnValue[key]; });
  Object.keys(storedLastOptions).forEach((key) => { delete storedLastOptions[key]; });
}

function prepareSuccess(data) {
  returnValue.data = data;
}

function prepareFailure(error) {
  returnValue.reject = true;
  returnValue.error = error;
}

function lastQuery() {
  return storedLastQuery;
}

function lastOptions() {
  return storedLastOptions;
}

function process(query, options) {
  storedLastQuery = query;
  if (options) {
    storedLastOptions = options;
  }

  if (!returnValue.reject) {
    return Promise.resolve({ data: returnValue.data });
  }

  return Promise.reject({ error: returnValue.error });
}

export const gqlQuery = (query, options) => process(query, options);

export const gqlMutation = (mutation, options) => process(mutation, options);

export default { clearResult, lastQuery, lastOptions, prepareSuccess, prepareFailure };
