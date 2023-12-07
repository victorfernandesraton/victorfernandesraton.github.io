import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer'
import TagItem from './TagItem'

function PostItem({ name, title, published_at, cover, tags = [] }) {
  const coverLink = cover?.replace?.('/public', '')
  const href = name === 'me' ? name : `blog/${name}`
  return (
    <a href={`/${href}`}>
      <div
        class={['mb-2 gap-x-4 flex flex-col md:flex-row', 'border border-rosePine-highlightMed border-b-4 border-r-4']}
      >
        <div
          class={cover ? 'w-100 h-40 lg:h-100 md:w-60 bg-cover bg-center bg-no-repeat' : 'bg-rosePine-surface'}
          style={
            cover && [`background-image: linear-gradient(rgba(7, 2, 18, 0), rgba(7, 2, 18, 0.75)), url(${coverLink});`]
          }
        />
        <div class="py-4 px-2">
          <div class="brightness-100">
            <h3 class="text-2xl font-bold text-rosePine-gold">{title}</h3>
            <p class="text-xl font-semibold text-rosePine-foam">
              Published at {DateTimeNormalizer.dateToTimeAgo(published_at)}
            </p>
          </div>
          {tags?.length && (
            <ul class="flex gap-4 my-4 flex-wrap content-between">
              {tags.map((tag) => (
                <li>
                  <TagItem tag={tag} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </a>
  )
}

export default PostItem
