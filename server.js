import Nullstack from 'nullstack'

import { MarkedAdapter } from './lib/marked/MarkedAdapter'
import { Feed } from './lib/rss'
import Post from './src//Post'
import Application from './src/Application'
const context = Nullstack.start(Application)

const { worker } = context

context.start = async function start() {
  const posts = await Post.getAllPost(context)
  const feed = Feed._start({
    title: context.project.shortName,
    description: context.project.name,
    feed_url: `${context.project.domain}/assets/feed.xml`,
    site_url: context.project.domain,
    managingEditor: 'Victor Raton',
    webMaster: 'Victor Raton',
    copyright: '2023 Victor Raton',
    language: 'en',
    categories: ['tech', 'sofware development'],
    pubDate: 'May 20, 2013 04:00:00 GMT',
    ttl: '60',
  })

  feed.parseContent(posts)
  feed.writeInFile('public/assets/feed.xml')
  context.marked = MarkedAdapter._start()

  worker.preload = [...worker.preload, '/', '/me', ...posts.map((p) => `/blog/${p.name}`)]
}

export default context
