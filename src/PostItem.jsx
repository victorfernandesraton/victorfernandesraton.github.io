import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer'
import TagItem from './TagItem'

function PostItem({ name, title, published_at, cover, tags = [] }) {
  const coverLink = cover?.replace?.('/public', '')
  const href = name === 'me' ? name : `/blog/${name}`
  return (
    <a href={href}>
      <div
        class={[
          'mb-2 p-6 flex flex-col gap-y-4',
          'border border-rosePine-highlightMed border-b-4 border-r-4',
          cover && 'bg-cover bg-center bg-no-repeat',
          !cover && 'bg-rosePine-surface',
        ]}
        style={
          cover && [`background-image: linear-gradient(rgba(7, 2, 18, 0), rgba(7, 2, 18, 0.75)), url(${coverLink});`]
        }
      >
        <div class="brightness-100">
          <h3 class="text-4xl font-bold text-rosePine-gold">{title}</h3>
          <p class="text-xl font-semibold text-rosePine-foam">
            Published at {DateTimeNormalizer.dateToTimeAgo(published_at)}
          </p>
        </div>
        {tags?.length && (
          <ul class="flex gap-2 my-4 flex-wrap content-between">
            {tags.map((tag) => (
              <li>
                <TagItem tag={tag} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </a>
  )
}

export default PostItem
