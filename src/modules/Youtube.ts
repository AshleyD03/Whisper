export function youtubeURLgetId(url: string): string | false {
  const read = url.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)
  if (!read || !read[1]) return false
  return read[1]
}

export function viewsToString(views: number) {
  const str = views.toString()

  const type = ['', 'K', 'M', 'B'][Math.floor((str.length - 1) / 3)]
  const round = parseFloat((views > 999) ? `${str[0]}.${str[1]}` : str)

  return `${round}${type} views`
}