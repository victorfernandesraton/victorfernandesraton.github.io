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
    return filteredFiles
  }

  async initiate({ limit }) {
    this.postList = await this.getPostTree()
    if (limit) {
      this.postList = this.postList.slice(0, limit)
    }
  }

  renderPostLink({ name, title, published_at, cover }) {
    const coverLink = cover?.replace?.('/public','' );
    const href = name == "me" ? name : `/blog/${name}`
    return (
      <li>
        <a href={href}>
          <div class={[
            "mb-2 p-6 flex flex-col gap-y-4",
            "border border-rosePine-highlightMed border-b-4 border-r-4",
            cover && 'bg-cover bg-center bg-no-repeat',
            !cover && 'bg-rosePine-surface' 
          ]}
            style={cover && [
              `background-image: linear-gradient(to right, rgba(7, 2, 18, 0.50), rgba(7, 2, 18, .0)), url(${coverLink});`,
            ]}
          >
            <div class='brightness-100'>
              <h3 class="text-4xl font-bold text-rosePine-love">{title}</h3>
              <p class="text-xl font-semibold text-rosePine-foam">Published at {Post._timeAgo(published_at)}</p>
            </div>
          </div>
        </a>
      </li>
    )
  }

  render() {

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
