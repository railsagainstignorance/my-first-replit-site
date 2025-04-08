import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  html: text("html").notNull(),
  collection: text("collection").notNull(),
  date: timestamp("date").notNull(),
  updatedAt: timestamp("updated_at"),
  sequence: integer("sequence"),
  tags: text("tags").array().notNull(),
  frontmatter: jsonb("frontmatter").notNull()
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  chapters: jsonb("chapters").notNull()
});

export const insertArticleSchema = createInsertSchema(articles).omit({ 
  id: true
});

export const insertCollectionSchema = createInsertSchema(collections).omit({ 
  id: true
});

export const insertGroupSchema = createInsertSchema(groups).omit({ 
  id: true
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

export const ChapterSchema = z.object({
  title: z.string(),
  description: z.string(),
  articles: z.array(z.object({
    slug: z.string(),
    collection: z.string()
  }))
});

export type Chapter = z.infer<typeof ChapterSchema>;
