module.exports.encode = (token) => {
  const info = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
  )
  return info
}
