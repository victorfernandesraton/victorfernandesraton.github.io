import Nullstack from 'nullstack'

import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer'
import Post from './Post'
import TagItem from './TagItem'


function PostItem({ name, title, published_at, cover, tags = [] }) {
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
                  <TagItem tag={tag} />
                ))}
              </div>
            </div>
          </div>
        </a>
      </li>
    )
  }


export default PostItem
