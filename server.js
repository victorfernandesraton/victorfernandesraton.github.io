import Nullstack from 'nullstack'

import Application from './src/Application'

const context = Nullstack.start(Application)

context.start = async function start() {
  // https://nullstack.app/application-startup
}

context.server.get("/article/:locale/:id", (request, response) => {
  const {id, locale} = request.params
  console.log(id, locale)
  const path = `public/posts/${locale}/${id}/index.md`
  if (!existsSync(path)) {
      response.statusCode(400).json({found: false})
  }
  let data = readFileSync(path, 'utf-8')
  const md = new Remarkable()
  md.use(meta)

  data = this.replaceImageUrl({md: data})
  
  const html= md.render(data)


  response.json({
      found: true,
      html,
      ...md.meta
  })
})

export default context
