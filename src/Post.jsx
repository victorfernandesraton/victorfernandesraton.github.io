import Nullstack from 'nullstack'
import './Post.scss'
import { existsSync, readFileSync } from 'node:fs'
import { Remarkable } from 'remarkable'
import meta from 'remarkable-meta'

class Post extends Nullstack {

  static replaceImageUrl({ md }) {
    const regex = /(!\[[^\]]*]\([^)]*)\/public(\/[^)]+\))/g

    return md.replace(regex, '$1$2')
  }

  static _changeHStyle(tokens, idx) {
    const level = tokens[idx].hLevel

    const className = `text-${5 -level}xl text-rosePine-iris font-bold`

    return `<h${level} class="${className}">`
  }

  static _changePStyle() {
    return '<p class="my-8 text">'
  }

  static _changeListStyle() {
    return '<ul class="list-disc my-0"'
  }

  static _changeListItemStyle() {
    return '<li class="my-0">'
  }

  static async getPost({ key }) {
    const path = `posts/${key}.md`
    if (!existsSync(path)) {
      return null
    }
    let data = readFileSync(path, 'utf-8')
    const md = new Remarkable()
    md.use(meta)

    data = this.replaceImageUrl({ md: data })
    md.renderer.rules.heading_open = this._changeHStyle
    md.renderer.rules.paragraph_open = this._changePStyle
    md.renderer.rules.bullet_list_open = this._changeListStyle
    md.renderer.rules.list_item_open = this._changeListItemStyle
    const html = md.render(data)

    return {
      html,
      name: key,
      ...md.meta,
    }
  }

  async initiate({ page, params, router }) {
    const article = await Post.getPost({
      key: params.slug !== '' ? params.slug : router.path.slice(1),
    })

    if (!article) {
      router.path = '/404'
      return
    }

    page.title = article.title
    if (article?.description) {
      page.description = article.description
    }
    if (article?.cover) {
      page.image = article.cover.replace("/public","" );
    }
    Object.assign(this, article)
  }

  static _timeAgo(date) {
    const currentDate = new Date()
    const previousDate = new Date(date)

    const timeDifference = currentDate.getTime() - previousDate.getTime()
    const secondsDifference = Math.floor(timeDifference / 1000)
    const minutesDifference = Math.floor(secondsDifference / 60)
    const hoursDifference = Math.floor(minutesDifference / 60)
    const daysDifference = Math.floor(hoursDifference / 24)
    const monthsDifference = Math.floor(daysDifference / 30)
    const yearsDifference = Math.floor(daysDifference / 365)

    if (secondsDifference < 60) {
      return 'Just now'
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minutes ago`
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hours ago`
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`
    } else if (monthsDifference < 12) {
      return `${monthsDifference} months ago`
    }
    return `${yearsDifference} years ago`
  }

  render({router}) {
    if (!this.html && this.initiated) {
      router.path = '/404'
    }

    return (
      <>
        <header class="mx-auto mb-16 mt-8 max-w-[900px] flex flex-col gap-y-4 content-between break-words">
          <h1 class="text-4xl font-bold text-rosePine-love">{this?.title}</h1>
          {this.description && (
            <h2 class="text-2xl font-bold text-rosePine-gold mb-4">{this?.description}</h2>
          )}
          <p class="text-sm font-semibold text-rosePine-foam">Published at {Post._timeAgo(this.published_at)}</p>
        </header>
        <article html={this.html} class="mx-auto max-w-[900px] article-custon-style" />
      </>
    )
  }

}

export default Post
