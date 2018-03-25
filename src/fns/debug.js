exports.handler = function(event, context, callback) {
  const { identity, user } = context.clientContext

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identity, user }),
  })
}
