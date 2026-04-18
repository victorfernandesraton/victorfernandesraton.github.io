import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import nav from "lume/plugins/nav.ts";
import favicon from "lume/plugins/favicon.ts";
import mila from "markdown-it-link-attributes";
import inline from "lume/plugins/inline.ts";
import cacheBusting from "lume/middlewares/cache_busting.ts";
import markdownItMedia from "@gotfeedback/markdown-it-media";
import transformImages from "lume/plugins/transform_images.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import highlight from "lume/plugins/code_highlight.ts";
import gzip from "lume/plugins/gzip.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import seo from "lume/plugins/seo.ts";
import imageSize from "lume/plugins/image_size.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
import { version } from "lume/core/utils/browsers.ts";
import type MarkdownIt from "markdown-it";

const addImageSizeAttribute = () => (md: typeof MarkdownIt) => {
  const defaultImageRender = md.renderer.rules.image ||
    function (tokens: any, idx: number, options: any, env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (
    tokens: any,
    idx: number,
    options: any,
    env: any,
    self: any,
  ) {
    const token = tokens[idx];
    if (!token.attrGet("image-size")) {
      token.attrPush(["image-size", ""]);
    }
    return defaultImageRender(tokens, idx, options, env, self);
  };
};

const site = lume({
  location: new URL("https://vraton.dev"),
  server: {
    debugBar: true,
    middlewares: [cacheBusting()],
  },
}, {
  markdown: {
    plugins: [
      mila,
      [markdownItMedia, { controls: true }],
      addImageSizeAttribute(),
    ],
  },
});
site.use(highlight({
  theme: {
    name: "base16/gruvbox-dark-pale", // The theme name to download
    cssFile: "/theme.css", // The destination filename
    placeholder: "/* code-hightlight */", // Optional placeholder to replace with the theme code
  },
}));

site.ignore("README.md", "github/", "./presentation/");
site.use(nav());
site.data(
  "fullDate",
  function (
    date: Date,
    location: string = "pt-BR",
    timeZone = "America/Bahia",
  ): string {
    const formatter = new Intl.DateTimeFormat(location, {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone,
    });
    return formatter.format(date);
  },
);

site.data(
  "monthYear",
  function (
    date: Date,
    location: string = "pt-BR",
    timeZone = "America/Bahia",
  ): string {
    const formatter = new Intl.DateTimeFormat(location, {
      year: "numeric",
      month: "short",
      timeZone,
    });
    return formatter.format(date);
  },
);

site.use(googleFonts({
  fonts: {
    title:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk&display=optional",
    display:
      "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@300&display=optional",
  },
  cssFile: "theme.css",
  placeholder: "/* google-fonts */",
}));

site.use(lightningCss({
  includes: "_includes",
  options: {
    minify: true,
    drafts: {
      customMedia: true,
    },
    targets: {
      android: version([100, 0]),
      chrome: version([100, 0]),
      edge: version([100, 0]),
      firefox: version([100, 0]),
      ios_saf: version([18, 4]),
      safari: version([16, 0]),
    },
  },
}));
site.data("sitename", "vraton.dev");
site.data("theme", "everforest-dark");
site.use(jsx());
site.use(favicon());
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv", ".svg"]);
site.add("./theme.css");
site.add("./lume.svg");

site.use(transformImages(/* Options */));

site.use(metas());
site.use(inline());
site.use(gzip());

site.use(feed({
  output: ["/posts.rss", "/posts.json"],
  query: "type=post",
  info: {
    title: "=site.title",
    description: "=site.description",
    generator: true
  },
  items: {
    title: "=title",
    description: "=description",
    published: "=date",
    image: "$ img.high attr(src)",
    authorName: "v_raton",
  },
}));

site.use(feed({
  output: ["/experiences.rss", "/experiences.json"],
  query: "type=xp",
  info: {
    title: "=site.title",
    description: "=site.description",
    generator: true,
  },
  items: {
    title: "=title",
    description: "=children",
    published: "=end_date",
    authorName: "v_raton",
  },
}));
site.use(imageSize());

site.use(seo(/* Options */));
// font logo  - Universe 75 Black
// font title - Univers LT 49 Light Ultra Condensed
// font links and extra -  Roadgeek 2005 Series F or D
//
export default site;
