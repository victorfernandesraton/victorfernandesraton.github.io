const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export default function* ({ search, lang }: Lume.Data) {
  const tags = search.values<string>(`tags`, `lang=${lang}`);
  for (const tag of tags) {
    const data = {
      url: "/tag/" + tag,
      layout: "tag.tsx",
      title: capitalized(tag),
      result: tag,
    };
    yield data;
  }
}
