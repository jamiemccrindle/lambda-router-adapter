const binaryMediaTypePrefixes = [
  'image/',
  'video/',
  'audio/',
  'application/octetstream'
]

export function isBinary(mediaType) {
  for(let binaryMediaTypePrefix of binaryMediaTypePrefixes) {
    if(mediaType.startsWith(binaryMediaTypePrefix)) {
      return true;
    }
  }
  return false;
}