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
import svgo from "lume/plugins/svgo.ts";
import picture from "lume/plugins/picture.ts";

const addImageAttrs = () => (md: MarkdownIt) => {
  const originalRender = md.renderer.rules.image;
  md.renderer.rules.image = function (
    tokens: unknown[],
    idx: number,
    options: Record<string, unknown>,
    env: Record<string, unknown>,
    self: Record<string, unknown>,
  ): string {
    const token = tokens[idx] as Record<string, unknown>;
    if (typeof token.attrGet !== "function") {
      return originalRender(tokens, idx, options, env, self);
    }

    const attrGet = (name: string): string | undefined =>
      (token.attrGet as (name: string) => string | undefined).call(
        token,
        name,
      );
    const attrPush = (attr: [string, string]) =>
      (token.attrPush as (attr: [string, string]) => void).call(
        token,
        attr,
      );

    if (!attrGet("image-size")) attrPush(["image-size", ""]);
    if (!attrGet("sizes")) {
      attrPush(["sizes", "(min-width: 900px) 900px, calc(100vw - 2rem)"]);
    }
    if (!attrGet("loading")) attrPush(["loading", "lazy"]);
    if (!attrGet("decoding")) attrPush(["decoding", "async"]);

    return originalRender(tokens, idx, options, env, self);
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
      addImageAttrs(),
    ],
  },
});

// Ignore files that should not be processed
site.ignore("README.md", "AGENTS.md", "github/", "presentations/");

site.use(highlight({
  theme: {
    name: "github-dark", // High contrast theme for accessibility (WCAG compliant)
    cssFile: "/theme.css", // The destination filename
    placeholder: "/* code-hightlight */", // Optional placeholder to replace with the theme code
  },
}));

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
site.use(svgo(/* Options */));
site.use(favicon({ input: "./favicon.svg" }));
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv"]);
site.add("./theme.css");
site.add("./lume.svg");

site.use(picture());
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
    generator: true,
  },
  items: {
    title: "=title",
    description: "=description",
    published: "=date",
    image: "$ .blurred-img.cover picture img attr(src)",
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
