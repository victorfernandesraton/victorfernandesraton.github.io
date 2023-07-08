import Nullstack from 'nullstack';
import './Post.scss';
import { DateTimeNormalizer } from '../lib/normalizer/DateTimeNormalizer';
import { existsSync, readFileSync } from 'node:fs';
import fm from 'front-matter'
import fs from 'node:fs/promises'
import path from 'node:path'
import { MarkedAdapter } from '../lib/marked/MarkedAdapter';

class Post extends Nullstack {
  static async getPost({ key, marked }) {
    const path = `posts/${key}.md`;
    if (!existsSync(path)) {
      return null;
    }
    let data = readFileSync(path, 'utf-8');
    data = MarkedAdapter.replaceImageUrl({ md: data });

    const { attributes, body } = fm(data)
    const html = marked.parse(body)
    return {
      html,
      name: key,
      ...attributes
    };
  }

  static async getAllPost(context) {
    const directoryPath = 'posts'
    const files = await fs.readdir(directoryPath)
    const filteredFiles = []
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile() && path.extname(file) === '.md') {
        const data = await Post.getPost({ ...context, key: file.replace('.md', ''), })
        filteredFiles.push(data)
      }
    }
    return filteredFiles
  }
  async initiate({ page, params, router }) {
    const article = await Post.getPost({
      key: params.slug !== '' ? params.slug : router.path.slice(1),
    });


    page.title = article.title;
    if (article?.description) {
      page.description = article.description;
    }
    if (article?.cover) {
      page.image = article.cover.replace('/public', '');
    }
    Object.assign(this, article);
  }

  render({ router }) {
    if (!this.html && this.initiated) {
      router.path = '/404'
    }

    return (
      <>
        <header class="mx-auto mb-16 mt-8 max-w-[900px] flex flex-col gap-y-4 content-between break-words">
          <h1 class="text-4xl font-bold text-rosePine-love">{this?.title}</h1>
          {this.description && (
            <h2 class="text-2xl font-bold text-rosePine-gold mb-4">{this?.description}</h2>
          )}
          <p class="text-sm font-semibold text-rosePine-foam">Published at {DateTimeNormalizer.dateToTimeAgo(this.published_at)}</p>
        </header>
        <article html={this.html} class="mx-auto max-w-[900px] article-custon-style" />
      </>
    )
  }

}

export default Post
