let Errors = {
  unknown: ["Something went wrong.", 500],
  unauthorized: ["You don't have permission to do that.", 401],
  notAuthenticated: ["You have to login to do that", 401],
  userNotOptedIn: ["You have to opt in to BetterCompass Accounts to do that.", 401]
}

function processErrors(errorName) {
  let arr = Errors[errorName]

  temp = {}
  temp.name = errorName
  temp.message = arr[0]
  temp.status = arr[1]

  return {
    name: errorName,
    message: arr[0],
    status: arr[1]
  }
}

let ProcessedErrors = {}

for (let errorName in Errors) {
  ProcessedErrors[errorName] = processErrors(errorName)
}

ProcessedErrors.VALIDATION_ERROR = "VALIDATION_ERROR"

ProcessedErrors.invalidParameter = function (param, message) {
  let punctuatedMessage = ""
  if (message) {
    punctuatedMessage = ": " + message
  }

  return {
    name: "invalidParameter",
    message: `${param} is invalid${punctuatedMessage}`,
    status: 400,
    parameter: param
  }
}

ProcessedErrors.sequelizeValidation = (sequelize, obj) => {
  return new sequelize.ValidationError(obj.error, [
    new sequelize.ValidationErrorItem(
      obj.error,
      "Validation error",
      obj.path,
      obj.value
    )
  ])
}

module.exports = ProcessedErrors
