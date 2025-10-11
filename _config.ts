import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import nav from "lume/plugins/nav.ts";
import favicon from "lume/plugins/favicon.ts";
import mila from "npm:markdown-it-link-attributes";
import inline from "lume/plugins/inline.ts";
import markdownItMedia from "npm:@gotfeedback/markdown-it-media";
import multilanguage from "lume/plugins/multilanguage.ts";

const site = lume({}, {
  markdown: {
    plugins: [mila, [markdownItMedia, { controls: true }]],
  },
});


site.ignore("README.md", "github/");


site.use(multilanguage({
  languages: ["en", "pt"],
  defaultLanguage: "pt",
}));
site.use(nav());
site.use(inline());

site.data("sitename", "vraton.dev");
site.use(jsx());
site.use(favicon());
site.add([".png", ".webp", ".jpeg", ".jpg", ".mp4", ".csv"]);

export default site;
