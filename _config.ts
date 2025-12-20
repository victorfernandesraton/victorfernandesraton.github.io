import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import nav from "lume/plugins/nav.ts";
import favicon from "lume/plugins/favicon.ts";
import mila from "markdown-it-link-attributes";
import inline from "lume/plugins/inline.ts";
import markdownItMedia from "@gotfeedback/markdown-it-media";
import transformImages from "lume/plugins/transform_images.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import highlight from "lume/plugins/code_highlight.ts";
import gzip from "lume/plugins/gzip.ts";
import feed from "lume/plugins/feed.ts";

const site = lume({ server: { debugBar: false } }, {
  markdown: {
    plugins: [mila, [markdownItMedia, { controls: true }]],
  },
});
site.use(highlight({
  theme: {
    name: "agate", // The theme name to download
    cssFile: "/theme.css", // The destination filename
    placeholder: "/* code-hightlight */", // Optional placeholder to replace with the theme code
  },
}));

site.ignore("README.md", "github/");

site.use(nav());
site.data("fullDate", function(date: Date, location: string = "pt-BR", timeZone = 'America/Bahia'): string {
    const formatter = new Intl.DateTimeFormat(location,{
        dateStyle: 'full',
        timeStyle: 'short',
        hour12: false,
        timeZone
    })
    return formatter.format(date)
})

site.use(googleFonts({
  fonts: {
    title:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap",
    display:
      "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@300&display=swap",
  },
  cssFile: "theme.css",
  placeholder: "/* google-fonts */",
}));

site.data("sitename", "vraton.dev");
site.data("theme", "everforest-dark");
site.use(jsx());
site.use(favicon());
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv", ".svg"]);
site.add("./theme.css");

site.use(transformImages(/* Options */));

site.use(inline());
site.use(gzip());
site.use(feed({
  output: ["/posts.rss", "/posts.json"],
  query: "type=post",
  info: {
    title: "=site.title",
    description: "=site.description",
  },
  items: {
    title: "=title",
    description: "=description",
    published: "=date",
    image:"$ img.high attr(src)"
  },
}));

site.use(feed({
  output: ["/experiences.rss", "/experiences.json"],
  query: "type=xp",
  info: {
    title: "=site.title",
    description: "=site.description",
  },
  items: {
    title: "=title",
    description: "=posittion",
    published: "=end_date",
  },
}));
// font logo  - Universe 75 Black
// font title - Univers LT 49 Light Ultra Condensed
// font links and extra -  Roadgeek 2005 Series F or D
//
export default site;
