const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("inside middleware error")
    let customError = {
      statusCode: err.statusCode || 500,
      msg: err.message || 'Something went wrong try again later',
    }
    if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(',')
      customError.statusCode = 400
    }
    if (err.code && err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please choose another value`
      customError.statusCode = 400
    }
    if (err.name === 'CastError') {
      customError.msg = `No item found with id : ${JSON.stringify(err.value)}`
      customError.statusCode = 404
    }
    console.log("customerError",customError.statusCode)
    return res.status(customError.statusCode).json({ message: customError.msg })
  }
module.exports=errorHandlerMiddleware
