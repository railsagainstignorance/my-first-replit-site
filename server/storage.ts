import { 
  articles, collections, groups,
  type Article, type InsertArticle,
  type Collection, type InsertCollection,
  type Group, type InsertGroup
} from "@shared/schema";

export interface IStorage {
  // Articles
  getArticles(): Promise<Article[]>;
  getArticlesByCollection(collection: string): Promise<Article[]>;
  getArticlesByTag(tag: string): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(slug: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(slug: string): Promise<boolean>;

  // Collections
  getCollections(): Promise<Collection[]>;
  getCollection(slug: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // Groups
  getGroups(): Promise<Group[]>;
  getGroup(slug: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article>;
  private collections: Map<string, Collection>;
  private groups: Map<string, Group>;
  private articleId: number;
  private collectionId: number;
  private groupId: number;

  constructor() {
    this.articles = new Map();
    this.collections = new Map();
    this.groups = new Map();
    this.articleId = 1;
    this.collectionId = 1;
    this.groupId = 1;
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getArticlesByCollection(collection: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.collection === collection)
      .sort((a, b) => {
        // If both have sequence numbers, use those
        if (a.sequence !== null && b.sequence !== null) {
          return a.sequence - b.sequence;
        }
        // Fall back to date sorting, most recent first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.tags.includes(tag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    return this.articles.get(slug);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const newArticle: Article = { 
      ...article, 
      id: this.articleId++
    };
    this.articles.set(article.slug, newArticle);
    return newArticle;
  }

  async updateArticle(slug: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(slug);
    if (!existingArticle) return undefined;

    const updatedArticle: Article = { 
      ...existingArticle, 
      ...article,
      updatedAt: new Date()
    };
    
    this.articles.set(slug, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(slug: string): Promise<boolean> {
    return this.articles.delete(slug);
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(slug: string): Promise<Collection | undefined> {
    return this.collections.get(slug);
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const newCollection: Collection = { 
      ...collection, 
      id: this.collectionId++
    };
    this.collections.set(collection.slug, newCollection);
    return newCollection;
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async getGroup(slug: string): Promise<Group | undefined> {
    return this.groups.get(slug);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const newGroup: Group = { 
      ...group, 
      id: this.groupId++
    };
    this.groups.set(group.slug, newGroup);
    return newGroup;
  }
}

export const storage = new MemStorage();
