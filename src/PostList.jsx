import Nullstack from 'nullstack'

import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer'
import Post from './Post'
class PostList extends Nullstack {

  postList = []
  async initiate({ limit }) {
    const data = await Post.getAllPost()
    this.postList = data.sort((a, b) => b.published_at >= a.published_at)
    if (limit) {
      this.postList = this.postList.slice(0, limit)
    }
  }

  renderPostTag({ tag, active }) {
    return (
      <a
        href={active ? `?` : `?tag=${tag}`}
        class={[
          'rounded-full px-4 text-lg text-rosePine-highlightLow',
          active ? 'bg-rosePine-rose' : 'bg-rosePine-iris',
        ]}
      >
        {tag}
      </a>
    )
  }

  renderPostLink({ name, title, published_at, cover, tags = [] }) {
    const coverLink = cover?.replace?.('/public', '')
    const href = name === 'me' ? name : `/blog/${name}`
    return (
      <li>
        <a href={href}>
          <div
            class={[
              'mb-2 p-6 flex flex-col gap-y-4',
              'border border-rosePine-highlightMed border-b-4 border-r-4',
              cover && 'bg-cover bg-center bg-no-repeat',
              !cover && 'bg-rosePine-surface',
            ]}
            style={
              cover && [
                `background-image: linear-gradient(to right, rgba(7, 2, 18, 0.50), rgba(7, 2, 18, .0)), url(${coverLink});`,
              ]
            }
          >
            <div class="brightness-100">
              <h3 class="text-4xl font-bold text-rosePine-love">{title}</h3>
              <p class="text-xl font-semibold text-rosePine-foam">
                Published at {DateTimeNormalizer.dateToTimeAgo(published_at)}
              </p>
              <div class="flex gap-x-2">
                {tags.map((tag) => (
                  <PostTag tag={tag} />
                ))}
              </div>
            </div>
          </div>
        </a>
      </li>
    )
  }

  render() {
    if (!this.initiated) {
      return <></>
    }

    return (
      <div>
        <ul>
          {this.postList.map((i) => (
            <PostLink {...{ ...i }} />
          ))}
        </ul>
      </div>
    )
  }

}

export default PostList
