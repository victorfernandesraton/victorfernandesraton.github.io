function Tag({ tag, active }) {
  return (
    <a
      href={`/tag/${tag}`}
      class={['rounded-full px-4 text-lg text-rosePine-highlightLow', active ? 'bg-rosePine-rose' : 'bg-rosePine-iris']}
    >
      {tag}
    </a>
  )
}

export default Tag
