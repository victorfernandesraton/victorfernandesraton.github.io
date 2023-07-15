import Nullstack from 'nullstack'

import { readdirSync } from 'node:fs'
import path from 'node:path'

import { MarkedAdapter } from './lib/marked/MarkedAdapter'
import Application from './src/Application'

const context = Nullstack.start(Application)

const { worker } = context

const articles = readdirSync(path.join(__dirname, '../posts'))

worker.preload = ['/', '/me', '/blog', ...articles.map((article) => `/blog/${article.replace('.md', '')}`)]
context.start = async function start() {
  context.marked = MarkedAdapter._start()
}

export default context
