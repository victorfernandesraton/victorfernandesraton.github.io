function Tag({ tag, active, anchor }) {
  return (
    <element
      tag={anchor ? 'a' : 'div'}
      href={anchor ? `/tag/${tag}` : undefined}
      class={[
        'rounded-full px-4 py-1.5 text-lg text-rosePine-highlightLow',
        active ? 'bg-rosePine-iris' : 'bg-rosePine-rose',
      ]}
    >
      {tag}
    </element>
  )
}

export default Tag
