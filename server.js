import Nullstack from 'nullstack'

import { MarkedAdapter } from './lib/marked/MarkedAdapter'
import { Feed } from './lib/rss'
import Post from './src//Post'
import Application from './src/Application'
const context = Nullstack.start(Application)

const { worker } = context

context.start = async function start() {
  const posts = await Post.getAllPost(context)
  // TODO: Fix this later with .env config or something like
  const domain = 'https://vraton.dev'
  const feed = Feed._start({
    title: context.project.shortName,
    description: context.project.name,
    feed_url: `${domain}/assets/feed.xml`,
    site_url: domain,
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
  context.posts = Array.from(posts)
  console.log(posts)
  worker.preload = [...worker.preload, '/', '/me', '/assets/feed.xml', ...posts.map((p) => `/blog/${p.name}`)]
}

export default context
