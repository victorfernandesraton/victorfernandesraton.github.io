import Nullstack from 'nullstack'

import { readdir } from 'node:fs/promises'

import Post from './Post'
class PostList extends Nullstack {

  postList = []

  static async getPostTree() {
    const files = await readdir(`posts`, { withFileTypes: true })
    const filesList = files.filter((file) => file.isDirectory()).map((file) => file.name)

    const contentData = filesList.map((i) => Post.getPost({ key: i }))

    const posts = await Promise.all(contentData)
    return posts.sort((a, b) => new Date(a.created_at) > new Date(b.created_at)).slice(1)

  }

  async initiate({limit}) {
    this.postList = await this.getPostTree()
    if (limit) {
      this.postList = this.postList.slice(0, limit)
    }
  }

  renderPostLink({ name, title, published_at }) {
    return (
      <li>
        <a href={`/blog/${name}`}>
          <p>{}</p>
          <div class='bg-rosePine-surface mb-2 p-6 flex flex-col gap-y-4'>
            <h3 class='text-4xl font-bold text-rosePine-love'>{title}</h3>
            <p class='text-xl font-semibold text-rosePine-foam'>Published at {Post.timeAgo(published_at)}</p>
          </div>
        </a>
      </li>
    )
  }

  render() {
    if (!this.initiated) {
      return <h1>Loading</h1>
    }

    return (
      <ul>
        {this.postList.slice(0).map((i) => (
          <PostLink {...{ ...i }} />
        ))}
      </ul>
    )
  }

}

export default PostList
