import { writeFileSync } from 'node:fs'
import RSS from 'rss'
export class Feed {

  constructor(feed, domain) {
    this.feed = feed
    this.domain = domain
  }

  parseContent(data = []) {
    this.data = data
  }

  toXML() {
    for (const post of this.data) {
      this.feed.item({ ...post, date: post.published_at, enclosure: { url: `${this.domain}${post.cover}` } })
    }
    return this.feed.xml()
  }

  writeInFile(filename) {
    writeFileSync(filename, this.toXML())
  }

  static _start(params) {
    const rss = new RSS(params)
    return new Feed(rss, params.site_url)
  }

}
