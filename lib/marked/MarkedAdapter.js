
import hljs from 'highlight.js'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import Nullstack from 'nullstack';
export class MarkedAdapter extends Nullstack {
  static replaceImageUrl({ md }) {
    const regex = /(!\[[^\]]*]\([^)]*)\/public(\/[^)]+\))/g;

    return md.replace(regex, '$1$2');
  }

  static _heading(text, level) {
    const className = `text-${5 - level}xl text-pink-500 font-bold`;

    return `<h${level} class="${className}">${text}</h${level}>`;
  }

  static _list(body) {
    const className = "list-disc list-inside my-2 marker:text-rosePine-love"

    return `<ul class="${className}">${body}</ul>`
  }

  static _paragraph(text) {
    const className = 'my-8 text';
    return `<p class="${className}">${text}</p>`;
  }
  static _highlight(code, lang) {
    if (code.includes('class="hljs')) return
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }

  static _start() {
    const renderer = {
      paragraph: MarkedAdapter._paragraph,
      heading: MarkedAdapter._heading,
      list: MarkedAdapter._list,
    }
    marked.use({
      renderer, mangle: false, headerIds: false
    }, markedHighlight({

      async: false,
      langPrefix: 'hljs language-',
      highlight: MarkedAdapter._highlight
    }))

    return marked
  }
}


