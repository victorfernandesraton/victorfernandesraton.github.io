const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export default function* ({ search, lang }: Lume.Data) {
  const tags = search.values<string>(`tags`, `lang=${lang}`);
  for (const tag of tags) {
    const tagValue = tag.toLowerCase();
    const data = {
      url: `/tag/${tagValue}/`,
      layout: "tag.tsx",
      title: capitalized(tagValue),
      result: tag,
      lang,
    };
    yield data;
  }
}
