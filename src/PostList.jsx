import Nullstack from 'nullstack'

import fs from 'node:fs/promises'
import path from 'node:path'

import Post from './Post'
class PostList extends Nullstack {

  postList = []

  static async getPostTree() {
    const directoryPath = 'posts'
    const files = await fs.readdir(directoryPath)
    const filteredFiles = []

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile() && path.extname(file) === '.md') {
        const data = await Post.getPost({ key: file.replace('.md', '') })
        filteredFiles.push(data)
      }
    }

    return filteredFiles.slice(1)
  }

  async initiate({ limit }) {
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
          <div class="bg-rosePine-surface mb-2 p-6 flex flex-col gap-y-4">
            <h3 class="text-4xl font-bold text-rosePine-love">{title}</h3>
            <p class="text-xl font-semibold text-rosePine-foam">Published at {Post.timeAgo(published_at)}</p>
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
