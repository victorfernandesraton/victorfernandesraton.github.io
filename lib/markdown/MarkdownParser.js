import fm from "front-matter";

export class MarkdownParser {
  constructor(adapter, source) {
    this.adapter = adapter
    this.source = source
  }
  static replaceImageUrl(source) {

    const regex = /(!\[[^\]]*]\([^)]*)\/public(\/[^)]+\))/g;

    return source.replace(regex, '$1$2');
  }

  build() {
    const { body, attributes } = fm(this.source)
    this.body = body
    this.attributes = attributes
  }

  parse() {
    return this.source.toHtml(this.body)
  }
}


