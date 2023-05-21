import { readFileSync, existsSync } from "node:fs"
import Nullstack from "nullstack";
import { Remarkable } from 'remarkable'
import meta from "remarkable-meta";
class Post extends Nullstack {
  static replaceImageUrl({md}) {
    const regex = /(!\[[^\]]*]\([^)]*)\/public(\/[^)]+\))/g;

    return md.replace(regex, '$1$2');
  }
  static async getPost({ locale, key }) {
    const path = `public/posts/${locale}/${key}/index.md`
    if (!existsSync(path)) {
      return {found: false}
    }
    let data = readFileSync(path, 'utf-8')
    const md = new Remarkable()
    md.use(meta)

    data = this.replaceImageUrl({md: data})

    const html= md.render(data)

    return {
      found: true,
      html,
      name: key,
      ...md.meta
    }
  }

  async initiate({ page, params , router}) {

    const article = await Post.getPost({ locale: page.locale, key: params.slug })

    if(!article.found) {
      router.path = "/404"
    }
    page.title = article.title
    Object.assign(this, article)
  }

  render() {
    if (!this.initiated) {
      return <h1>Loading .....</h1>
    }
    if (!this.html) {
      return <h1>Not found</h1>
    }

    return (
      <article class='max-w-[900px] mx-auto' html={this.html} />
    )
  }

}

export default Post
