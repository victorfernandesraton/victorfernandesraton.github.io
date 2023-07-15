import Nullstack from 'nullstack'

import hljs from 'highlight.js'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
export class MarkedAdapter extends Nullstack {

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
    const className = 'list-disc py-4 pl-4 marker:text-rosePine-iris'

    return `<ul class="${className}">${body}</ul>`
  }

  static _link(href, title, text) {
    const className = 'text-rosePine-rose underline underline-offset-2'

    return `<a title="${title}" href="${href}" class="${className}">${text}</a>`
  }

  static _paragraph(text) {
    const className = 'my-8 text'
    return `<p class="${className}">${text}</p>`
  }

  static _highlight(code, lang) {
    if (code.includes('class="hljs')) return
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }

  static _start() {
    const renderer = {
      paragraph: MarkedAdapter._paragraph,
      heading: MarkedAdapter._heading,
      list: MarkedAdapter._list,
      listitem: MarkedAdapter._listitem,
      link: MarkedAdapter._link,
    }
    marked.use(
      {
        renderer,
        mangle: false,
        headerIds: false,
      },
      markedHighlight({
        async: false,
        langPrefix: 'hljs language-',
        highlight: MarkedAdapter._highlight,
      }),
    )

    return marked
  }

}
