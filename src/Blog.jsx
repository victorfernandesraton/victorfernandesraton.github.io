import Nullstack from 'nullstack'

import Post from './Post'
import PostItem from './PostItem'
import TagItem from './TagItem'
class Blog extends Nullstack {

  postList = []
  tags = []
  prepare({ page, project }) {
    page.title = `${project.name} - Blog`
    page.description = 'Some posts write by me'
  }

  async initiate({ params }) {
    const data = await Post.getAllPost()
    const tags = new Map()
    this.postList = data.sort((a, b) => b.published_at >= a.published_at)
    for (const post of this.postList) {
      const innerTags = post?.tags ?? []
      for (const tag of innerTags) {
        if (!tags.has(tag)) {
          tags.set(tag, tag)
        }
      }
    }
    this.tag = params?.tag
    if (this.tag) {
      this.postList = this.postList.filter((post) => post.tags.includes(this.tag))
    }
    this.tags = Array.from(tags.keys())
  }

  renderTitleTag({ tag }) {
    return (
      <div class="flex flex-col my-8 gap-y-4">
        <h1 class="text-5xl font-bold">Posts {tag && <span class="text-rosePine-foam">{`#${tag}`}</span>}</h1>
        {tag && (
          <a class="text-xl font-bold text-rosePine-rose underline" href="/blog">
            {' '}
            Back to all
          </a>
        )}
      </div>
    )
  }

  render() {
    return (
      <section class="flex flex-col max-w-[900px] mx-auto">
        <TitleTag tag={this.tag} />
        <h2 class="text-xl mb-4">This is a bunch of content with i produce, someones is a full messy, so... </h2>

        <ul class="flex gap-2 my-8 flex-wrap content-between">
          {this.tags.map((tag) => (
            <li>
              <TagItem tag={tag} active={this.tag === tag} anchor />
            </li>
          ))}
        </ul>

        <ul>
          {this.postList.map((item) => (
            <li>
              <PostItem {...{ ...item }} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

}

export default Blog
