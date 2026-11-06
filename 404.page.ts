// Custom 404 page.
// GitHub Pages serves /404.html (root of the published site) automatically
// for any request that doesn't match a file — no workflow change is needed.
export default {
  url: "/404.html",
  layout: "404.tsx",
  title: "404 — página não encontrada",
  description:
    "A página que você tentou acessar não existe. Volte para a página inicial do blog.",
  // `lang` inherits the global value ("pt" from _data.yaml); the navbar menu
  // filters pages by this exact lang, so overriding it here would empty it.
};
