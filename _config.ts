import lume from "@lumeland/lume";
import jsx from "@lumeland/plugin-jsx";
import nav from "@lumeland/plugin-nav";
import favicon from "@lumeland/plugin-favicon";
import mila from "markdown-it-link-attributes";
import inline from "@lumeland/plugin-inline";
import markdownItMedia from "@gotfeedback/markdown-it-media";
import transformImages from "@lumeland/plugin-transform-images";
import googleFonts from "@lumeland/plugin-google-fonts";
import highlight from "@lumeland/plugin-code-highlight";
import feed from "@lumeland/plugin-feed";
import metas from "@lumeland/plugin-metas";
import imageSize from "@lumeland/plugin-image-size";
import lightningCss from "@lumeland/plugin-lightningcss";
import { version } from "@lumeland/core/utils/browsers.ts";
import type { Options as MarkdownOptions } from "@lumeland/plugin-markdown";
import { execFileSync } from "node:child_process";
import svgo from "@lumeland/plugin-svgo";
import picture from "@lumeland/plugin-picture";

/**
 * Short SHA of the commit that produced the build.
 * In CI this comes from GITHUB_SHA, locally from `git rev-parse`.
 */
const getCommitSha = (): string => {
  const envSha = process.env.GITHUB_SHA ?? process.env.COMMIT_SHA;
  if (envSha) return envSha;
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
  } catch {
    return "";
  }
};

/** Owner/repo slug of the git origin (falls back to this repository). */
const getRepoSlug = (): string => {
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) return repo;
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf-8",
      timeout: 5000,
    }).trim()
      .replace(/^(git@github\.com:|https?:\/\/github\.com\/)/, "")
      .replace(/\.git$/, "");
  } catch {
    return "victorfernandesraton/victorfernandesraton.github.io";
  }
};

const commitSha = getCommitSha();
const commitUrl = commitSha
  ? `https://github.com/${getRepoSlug()}/commit/${commitSha}`
  : "";

/**
 * Types of the markdown-it plugins accepted by Lume. They come from the copy of
 * markdown-it bundled with @lumeland/plugin-markdown (v15), whose types are
 * incompatible with the @types/markdown-it (v14) used by markdown-it-* plugins,
 * hence the casts applied on the plugin list below.
 */
type MarkdownPluginEntry = NonNullable<MarkdownOptions["plugins"]>[number];
type MarkdownItPlugin = Extract<
  MarkdownPluginEntry,
  (...args: never[]) => unknown
>;

const addImageAttrs = (): MarkdownItPlugin => (md) => {
  const originalRender = md.renderer.rules.image;
  if (!originalRender) return;
  md.renderer.rules.image = function (
    tokens,
    idx,
    options,
    env,
    self,
  ): string {
    const token = tokens[idx];
    if (typeof token.attrGet !== "function") {
      return originalRender(tokens, idx, options, env, self);
    }

    if (!token.attrGet("image-size")) token.attrPush(["image-size", ""]);
    if (!token.attrGet("sizes")) {
      token.attrPush(["sizes", "(min-width: 900px) 900px, calc(100vw - 2rem)"]);
    }
    if (!token.attrGet("loading")) token.attrPush(["loading", "lazy"]);
    if (!token.attrGet("decoding")) token.attrPush(["decoding", "async"]);

    return originalRender(tokens, idx, options, env, self);
  };
};

// The markdown-it-* plugins are typed against @types/markdown-it (v14) while
// Lume's plugin loader uses its own bundled markdown-it (v15). The shapes match
// at runtime, so the entries are cast to Lume's types.
const markdownPlugins = [
  mila,
  [markdownItMedia, { controls: true }],
  addImageAttrs(),
] as unknown as NonNullable<MarkdownOptions["plugins"]>;

const site = lume({
  location: new URL("https://vraton.dev"),
  server: {
    debugBar: true,
  },
}, {
  markdown: {
    plugins: markdownPlugins,
  },
});

// Ignore files that should not be processed
site.ignore("README.md", "AGENTS.md", "github/", "presentations/", "types.d.ts");

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
  // In Lume 4 the plugin resolves `_includes` automatically, so the old
  // `includes` option no longer exists.
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
site.data("commitSha", commitSha);
site.data("commitUrl", commitUrl);
site.data("theme", "everforest-dark");
site.use(jsx());
site.use(svgo(/* Options */));
site.use(favicon({ input: "./favicon.svg" }));
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv"]);
site.copy("downloads");
site.add("./theme.css");
site.add("./lume.svg");

site.use(picture());
site.use(transformImages(/* Options */));

site.use(metas());
site.use(inline());

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

// font logo  - Universe 75 Black
// font title - Univers LT 49 Light Ultra Condensed
// font links and extra -  Roadgeek 2005 Series F or D
//
export default site;
