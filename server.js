import {readdirSync} from 'node:fs'
import path from 'node:path'

import Nullstack from 'nullstack'

import Application from './src/Application'

const context = Nullstack.start(Application)

const { worker } = context;

const articles = readdirSync(path.join(__dirname, '../posts',));

worker.preload = [
  "/",
  "/me",
  "/blog",
  ...articles.map((article) => '/blog/' + article.replace('.md', '')),
]
context.start = async function start() {
  // https://nullstack.app/application-startup
}

export default context
