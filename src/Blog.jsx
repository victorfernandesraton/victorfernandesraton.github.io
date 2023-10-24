import Nullstack from 'nullstack'

import Post from './Post'
import PostItem from './PostItem'
import TagItem from './TagItem'
class Blog extends Nullstack {

  postList = []
  tags = new Map()
  prepare({ page, project }) {
    page.title = `${project.name} - Blog`
    page.description = 'Some posts write by me'
  }

  async initiate({ params }) {
    const data = await Post.getAllPost()
    this.postList = data.sort((a, b) => b.published_at >= a.published_at)
    for (const post of this.postList) {
      const tags = post?.tags ?? []
      for (const tag of tags) {
        if (!this.tags.has(tag)) {
          this.tags.set(tag, tag)
        }
      }
    }
    this.tag = params?.tag
    if (this.tag) {
      this.postList = this.postList.filter((post) => post.tags.includes(this.tag))
    }
  }

  render() {
    return (
      <section class="flex-col max-w-[900px] mx-auto">
        <h1 class="text-5xl font-bold mt-8 mb-16">Posts</h1>
        <p class="text-xl mt-2 mb-8">This is a bunch of content with i produce, someones is a full messy, so... </p>
        {this.tags.size && (
          <ul class="flex gap-x-2 my-4">
            {Array.from(this.tags.keys()).map((tag) => (
              <TagItem tag={tag} active={this.tag === tag} />
            ))}
          </ul>
        )}
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
