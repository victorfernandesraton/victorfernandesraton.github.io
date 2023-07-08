import Post from './Post'
import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer'
import Nullstack from 'nullstack'
class PostList extends Nullstack {

  postList = []

  async initiate({ limit }) {
    this.postList = await Post.getAllPost()
    if (limit) {
      this.postList = this.postList.slice(0, limit)
    }
  }

  renderPostLink({ name, title, published_at, cover }) {
    const coverLink = cover?.replace?.('/public', '');
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
              <p class="text-xl font-semibold text-rosePine-foam">Published at {DateTimeNormalizer.dateToTimeAgo(published_at)}</p>
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
      <ul>
        {this.postList.slice(0).sort((a, b) => b.published_at >= a.published_at).map((i) => (
          <PostLink {...{ ...i }} />
        ))}
      </ul>
    )
  }

}

export default PostList
