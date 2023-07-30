---
title: Creating this blog
description: Nullstack - A journey of Simplicity and Flexibility
published_at: 2023-06-21
cover: /public/assets/img/nulla-tools.webp
---

# A big dsclaimer first

!i[image](/public/assets/img/nulla-tools.webp)

Exploring the vast array of JavaScript frameworks such as React, Vue, Angular, and Svelte, I encountered limitations, vendor lock-in issues, and the overwhelming chaos of the JavaScript ecosystem, with its countless dependencies and conflicting solutions. However, amidst this tumult, my discovery of Nullstack brought a ray of hope. Initially seen as unconventional due to its use of ES6 classes and named methods for component cycles, I soon recognized the brilliance and potential of this framework.

Nullstack stands out for its refreshing simplicity, offering streamlined data management through class props rather than convoluted states. One remarkable feature is its superior application context, which eliminates the need for a Redux store. Notably, Nullstack goes beyond the capabilities of Next.js by providing built-in support for progressive web app (PWA) capabilities without the need for additional dependencies, resulting in improved SEO capabilities.

But the greatness of Nullstack extends further. It offers the flexibility to adapt to various application architectures, be it single-page applications (SPAs), static HTML, or Node servers with Express. What truly sets it apart is its lack of vendor lock-in, allowing projects to run seamlessly across diverse infrastructures, from on-premises to cloud-based environments. In a world rife with complexity and uncertainty, Nullstack emerges as a great solution, offering clarity and stability for web developers seeking an alternative path.

# Getting start

Nullstack is very consistent, because of this structure, everything in nullstack is based on things is were worked well along side the internet, isntead of create something like css module, for default nullstack support css and sass style.

For create and manager your aplication, you don´t need handle with complex stuff like vite , webpack or babel, Nullstack have a npx tool to create application , with is have some things on a opitional support like tailwind, typescript and sass support, is a convension over configuration like 


# First of all: Folder design

The first thing i start love in nullstack is about freedom, unlike next.js or angular you don´t have a definitive folder structure. According the documentation, the only thing you need is:

- A client.js file witch is used for loading global client stuff, like added a global event or consume an browser api like Localstorage
- A server.js file witch is used for loading server side things like enviroment virables, connect an api or even write an http endpoint (because the second great thing about nullstack, in terms of runtime is a simple express server running in Node.js with is have all libs you are loved)
- A Application.js/jsx/njs file because is like React, a App.js file for initialize your application

this structure is result of building project using the only nad recomended way, nullstack-create-app cli, you can lean more about this [in nullstack documentation](https://nullstack.app/getting-started)

for this project i use the command above

```bash
npx create-nullstack-app@latest project-name -tw
```

Yep, i don´t use typescript in this project because seens like overrated for this....

Now in project-name i can see a similar structure like this this structure

```txt
- src
-- Application.jsx
-- Application.css
-- Counter.jsx
-- Home.jsx
- server.js
- client.js
- tailwind.config.js
- tailwind.css
- package.json
```

next them i added some changes in my tailwind config file for support rose-pine thene and my fonts 

for this project the first thing i do is added support or rose-pine colors (you can see my [tailwind.config.js](https://github.com/victorfernandesraton/victorfernandesraton.github.io/blob/e8da50419b66dd70bca2b838186df9ca03b4e4ea/tailwind.config.js))


the second one is create the post structure, it's a simple and very stupid idea, i create a folder called posts, and added some markdowns file wittch i use the filename as a subpath in my blog section, so for create a simple post i added a post here


the idea is using a node.js file systens functions to read this markdown and apply some styles using marked library (and some things is not work as well as you can see)

the first implementation is your post component, because there we create to functions, one for get post and metadata for file and another to walk thorought the directory post and create a list of post, i mean content and metadata

For access blog content you use /blog/some-post path, and they verify and get in /posts/some-post.md for contenrt

# Almost perfect

I know this is not performatic way to do this because of two things
- The function for walking in directory is not optimized at all, also witch means we need iterate to every post and dcopllect every metadata and content like we do for show them, it's means , the scaklability of build time is incresead every time when i creating posts
- I need call all posts at once if i make this avaliable in SSG, because when i build one page, i need to call in prepare or initialize all posts and they not is performatic to show this list in to or many places

For you know about this , you need read Nullstack documentation about static and server side function, for now, you should know we create two server side GET functions, it's cool because since we move to SSR mode, nullstack generate a GET endpoint api for make requests, of course the path is a dibrish string , but if you need it's a very welll endpoint you should read more about server initialization in doc

for now i wrote a simple post component, like this

```js
import Nullstack from 'nullstack'

import fm from 'front-matter'
import { existsSync, readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

class Post extends Nullstack {

  // itś a server side function witch will avaliable as endpoint later
  static async getPost({ key }) {
    const path = `posts/${key}.md`
    if (!existsSync(path)) {
      return null
    }
    const data = readFileSync(path, 'utf-8')

    const { attributes, body } = fm(data)

    return {
      html: body,
      name: key,
      ...attributes,
    }
  }

  // also another server side tunction, but in this case we need pass context paramas for using proxy
  static async getAllPost(context) {
    const directoryPath = 'posts'
    const files = await fs.readdir(directoryPath)
    const filteredFiles = []
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile() && path.extname(file) === '.md') {
        const data = await Post.getPost({ ...context, key: file.replace('.md', '') })
        filteredFiles.push(data)
      }
    }
    return filteredFiles
  }

  // initiate in some times run in server side like when you access link directly, or loading in client side if you access link navigating in site, See more in https://developer.chrome.com/docs/web-platform/declarative-link-capturing/

  async initiate({ page, params, router }) {
    const article = await Post.getPost({
      key: params.slug !== '' ? params.slug : router.path.slice(1),
    })

    page.title = article.title
    if (article?.description) {
      page.description = article.description
    }
    if (article?.cover) {
      page.image = article.cover.replace('/public', '')
    }
    Object.assign(this, article)
  }

  render({ router }) {
    if (!this.html && this.initiated) {
      router.path = '/404'
    }

    return (
      <>
        <header class="mx-auto mb-16 mt-8 max-w-[900px] flex flex-col gap-y-4 content-between break-words">
          <h1 class="text-4xl font-bold text-rosePine-love">{this?.title}</h1>
          {this.description && <h2 class="text-2xl font-bold text-rosePine-gold mb-4">{this?.description}</h2>}
        </header>
        <article html={this.html} class="mx-auto max-w-[900px]" />
      </>
    )
  }

}

export default Post
```

as you can se, we wrote less tham 100 lines and this is almost everything we need for blog

the function `getPost` is a server side function witch receiver key arg, this ar is a name for file , also is a path for this post in page blog , it's like a node.js function witch go to specific path and find if this file exists 

if were is we use a library called [front-matter](https://github.com/jxson/front-matter) for extract some markdown meatda

the function `getAllPost` is for search all posts and putting in a list, but is not called here, i mantaining here because is more simple to move them to another component, since this component is everythong about post

in initiate method is were magic is work, they called getPost using a router slug to get path fot this post, 
for now in this way, we not allowed to have subpath in posts directory.

the method `Object.assign` is useful here, since everything in nullstack is proxable , using this way we sure wen the function initiate is ending, they had article object  assign with post content and meatada

and the last lines is like a react jsx, we know there, get some props and render them

now, we need to setup a blog router and home page

In render method is were the main component is render and you see a litle condition , if dont have any content, go to 404 page, as you can see, in nullstack router object is avaliable in every client side cycle injectable by framework, just change the path to redirect interal path, if you need a external redirect , you can use router.url instead


# Router is never be eazy

Now, we need make some changes in  `src/Application.jsx` file, because this is entry point for front end


for now we just add a /blog path and some navbar element

```js
import Nullstack from 'nullstack'

import '../tailwind.css'
import Home from './Home'
import Post from './Post.jsx'

class Application extends Nullstack {

  postList = []
  async initiate({ limit }) {
    this.postList = await Post.getAllPost()
    if (limit) {
      this.postList = this.postList.slice(0, limit)
    }
  }

  renderHead() {
    return (
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
    )
  }

  renderFooter() {
    return (
      <footer class="pt-6 flex flex-col max-w-[900px] mx-auto my-8 inset-x-0 bottom-0 lg:items-start items-center gap-4 text-center lg:text-start border-t-rosePine-surface border-t-[1px]">
        <p>Developed with &#128156; by victorfernandesraton</p>
      </footer>
    )
  }

  renderBody({ children }) {
    return (
      <>
        <Head />
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {this.postList
            .slice(0)
            .sort((a, b) => b.published_at >= a.published_at)
            .map((i) => (
              <li>
                <a href={`/blog/${i.name}`}>{i.title}</a>
              </li>
            ))}
        </ul>
        <body class="bg-rosePine-base text-rosePine-text lg:px-0 px-4 h-fulli">{children}</body>
        <Footer />
      </>
    )
  }

  render({ router }) {
    return (
      <Body>
        <Home route="/" />
        <Post route="/blog/:slug" key={router.path} />
      </Body>
    )
  }

}

export default Application
```

As you can see i also adding footer , body and navbar component, most for organization

And i using initiate method again for get a list of existing posts, and render in List component, it's very simple

As you can see in render of application, whe using route params, is very eazy to create routers and subrouters in nullstack, you see more [here](https://nullstack.app/routes-and-params)
Now just need create some post, a markdown file with headers information like this

```markdown
---
title: About me
description: console.log('hello world')
published_at: 2023-05-15
cover: /public/assets/img/profile.webp
---


# Hey guys!

My name is Victor Raton (some call me Baião), and I'm a Brazilian full-stack developer. When I'm not procrastinating or coming up with some side project that will be forgotten, I like to share my ideas here, covering topics such as web development, Linux, productivity, and even my hobbies, like playing metroidvanias or researching and customizing keyboards

I started studying software development in 2018, the same year I entered my first Computer Science degree. The following year, I began working as a full-stack developer, mostly with JavaScript.

I've decided to write more about technology in order to improve my skills.


```

For least and less important, we need adding some markdowen support, fr this i suing [marked](https://github.com/markedjs/marked), a markdown parser solution with works in server side.

For separation concerm, i create this adapter in `/lib/markdown/MarkedAdapter.js`, in this case i use class but you also can build using functions too 
Maybe you can see my entire solution using highlight.js for adding code highlight support here

but for now we kept simple:

```js
import { marked } from 'marked'
export class MarkedAdapter {

  static replaceImageUrl({ md }) {
    const regex = /(!\[[^\]]*]\([^)]*)\/public(\/[^)]+\))/g

    return md.replace(regex, '$1$2')
  }

  static _heading(text, level) {
    const className = `text-${5 - level}xl font-bold text-rosePine-iris`

    return `<h${level} class="${className}">${text}</h${level}>`
  }

  static _listitem(body) {
    const className = 'my-2'

    return `<li class="${className}">${body}</li>`
  }

  static _list(body) {
    const className = 'list-disc py-4 pl-4 marker:blue'

    return `<ul class="${className}">${body}</ul>`
  }

  static _link(href, title, text) {
    const className = 'text-blue-400 underline underline-offset-2'

    return `<a ${title ? `title="${title}"` : ''} href="${href}" class="${className}">${text}</a>`
  }

  static _paragraph(text) {
    const className = 'my-8 text'
    return `<p class="${className}">${text}</p>`
  }

  static _start() {
    const renderer = {
      paragraph: MarkedAdapter._paragraph,
      heading: MarkedAdapter._heading,
      list: MarkedAdapter._list,
      listitem: MarkedAdapter._listitem,
      link: MarkedAdapter._link,
    }
    marked.use({
      renderer,
      mangle: false,
      headerIds: false,
    })

    return marked
  }

}
```

Now using a server.js we added a singleton shared by context for server side funcions.

```js
import Nullstack from 'nullstack'

import { readdirSync } from 'node:fs'
import path from 'node:path'

import { MarkedAdapter } from './lib/marked/MarkedAdapter'
import Application from './src/Application'

const context = Nullstack.start(Application)

const { worker } = context

const articles = readdirSync(path.join(__dirname, '../posts'))

// this is a little workarround to creating prelaod paths for serviceWorker support
worker.preload = [
  '/',
  ...articles.map((article) => `/blog/${article.replace('.md', '')}`).filter((article) => !article.includes('.draft')),
]
context.start = async function start() {
  context.marked = MarkedAdapter._start()
}

export default context
```

next, we change some lines in post component for adding marked MarkedAdapter

and we have something like this

```js
import Nullstack from 'nullstack'

import fm from 'front-matter'
import { existsSync, readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

class Post extends Nullstack {

  // itś a server side function witch will avaliable as endpoint later
  static async getPost({ key, marked }) {
    const path = `posts/${key}.md`
    if (!existsSync(path)) {
      return null
    }
    const data = readFileSync(path, 'utf-8')

    const { attributes, body } = fm(data)
    // here parse uising to generate new html
    const html = marked.parse(body)

    return {
      html,
      name: key,
      ...attributes,
    }
  }

  // also another server side tunction, but in this case we need pass context paramas for using proxy
  static async getAllPost(context) {
    const directoryPath = 'posts'
    const files = await fs.readdir(directoryPath)
    const filteredFiles = []
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile() && path.extname(file) === '.md') {
        const data = await Post.getPost({ ...context, key: file.replace('.md', '') })
        filteredFiles.push(data)
      }
    }
    return filteredFiles
  }

  // initiate in some times run in server side like when you access link directly, or loading in client side if you access link navigating in site, See more in https://developer.chrome.com/docs/web-platform/declarative-link-capturing/

  async initiate({ page, params, router }) {
    const article = await Post.getPost({
      key: params.slug !== '' ? params.slug : router.path.slice(1),
    })

    page.title = article.title
    if (article?.description) {
      page.description = article.description
    }
    if (article?.cover) {
      page.image = article.cover.replace('/public', '')
    }
    Object.assign(this, article)
  }

  render({ router }) {
    if (!this.html && this.initiated) {
      router.path = '/404'
    }

    return (
      <>
        <header class="mx-auto mb-16 mt-8 max-w-[900px] flex flex-col gap-y-4 content-between break-words">
          <h1 class="text-4xl font-bold text-rosePine-love">{this?.title}</h1>
          {this.description && <h2 class="text-2xl font-bold text-rosePine-gold mb-4">{this?.description}</h2>}
        </header>
        <article html={this.html} class="mx-auto max-w-[900px]" />
      </>
    )
  }

}

export default Post

```
# TAH-DA

And where is 
a list and post render as a markdown 

![image](/public/assets/img/blog-works.gif)

Its a simple blog implementation using for initial modeling for this blog, of course, along side of time , i added some styles and features, you can follow this repo and look some changes a made here.

![image](/public/assets/img/thats-all.jpg)

