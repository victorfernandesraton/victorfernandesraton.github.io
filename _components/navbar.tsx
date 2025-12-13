export default function (
  { nav, lang }: Lume.Data,
  {}: Lume.Helpers,
) {
  const index = nav.menu("/");
  return (
    <nav>
      <ul>
        <li>
          <a href={index.data.url}>{index.data.title}</a>
        </li>
        {nav?.menu("/", `lang=${lang}`)?.children?.filter((item) =>
          item.data.url
        ).map((item) => (
          <li>
            <a href={item.data.url}>
              {item.data.title ?? item.slug ?? item.data.alternates}
            </a>
          </li>
        ))}
      </ul>
      <ul>
      </ul>
    </nav>
  );
}
