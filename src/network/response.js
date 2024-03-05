const success = (res, message, data, status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
    status
  })
}

const error = (res, message, status = 400) => {
  res.status(status).json({
    success: false,
    message,
    status
  })
}

export const response = {
  success,
  error
}
