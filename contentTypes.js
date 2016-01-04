var textContentTypePrefixes = [
  'application/json',
  'application/xml',
  'application/javascript',
  'text/'
]

module.exports.isText = function(contentType) {
  return textContentTypePrefixes.some(function(textContentTypePrefix) {
    return contentType.indexOf(textContentTypePrefix) === 0;
  })
}