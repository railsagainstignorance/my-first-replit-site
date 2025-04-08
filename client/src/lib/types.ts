export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  html: string;
  collection: string;
  date: string;
  updatedAt?: string;
  sequence?: number | null;
  tags: string[];
  frontmatter: Record<string, any>;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Chapter {
  title: string;
  description: string;
  articles: ChapterArticle[];
}

export interface ChapterArticle {
  slug: string;
  collection: string;
}

export interface Group {
  id: number;
  name: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}
