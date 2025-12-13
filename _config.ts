import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import nav from "lume/plugins/nav.ts";
import favicon from "lume/plugins/favicon.ts";
import mila from "npm:markdown-it-link-attributes";
import inline from "lume/plugins/inline.ts";
import markdownItMedia from "npm:@gotfeedback/markdown-it-media";
import transformImages from "lume/plugins/transform_images.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import highlight from "lume/plugins/code_highlight.ts";

const site = lume({}, {
  markdown: {
    plugins: [mila, [markdownItMedia, { controls: true }]],
  },
});
site.use(highlight({
  theme: {
    name: "atom-one-dark", // The theme name to download
    cssFile: "/theme.css", // The destination filename
    placeholder: "/* code-hightlight */", // Optional placeholder to replace with the theme code
  },
}));

site.ignore("README.md", "github/");

site.use(nav());

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
site.use(jsx());
site.use(favicon());
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv", ".svg"]);
site.use(tailwindcss(/* Options */));
site.add("./theme.css");

site.use(transformImages(/* Options */));

site.use(inline());
// font logo  - Universe 75 Black
// font title - Univers LT 49 Light Ultra Condensed
// font links and extra -  Roadgeek 2005 Series F or D
//
export default site;
