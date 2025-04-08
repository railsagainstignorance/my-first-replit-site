import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loadContent, createSampleContent } from "./utils/content";
import { initImageOptimizer, createImageOptimizationMiddleware } from "./utils/images/optimizer";
import fs from "fs-extra";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), 'client', 'public', 'content');

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize image optimizer
  await initImageOptimizer();
  
  // Add image optimization middleware
  app.use(createImageOptimizationMiddleware());
  
  // Initialize content
  try {
    // Create content directory if it doesn't exist
    await fs.ensureDir(CONTENT_DIR);
    
    // If no content exists, create sample content
    const directories = await fs.readdir(CONTENT_DIR);
    if (directories.length === 0) {
      await createSampleContent();
    }
    
    // Load content from filesystem
    await loadContent();
  } catch (error) {
    console.error("Error initializing content:", error);
  }

  // Articles routes
  app.get("/api/articles", async (_req: Request, res: Response) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticle(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (_req: Request, res: Response) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collections" });
    }
  });

  app.get("/api/collections/:slug", async (req: Request, res: Response) => {
    try {
      const collection = await storage.getCollection(req.params.slug);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collection" });
    }
  });

  app.get("/api/collections/:slug/articles", async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticlesByCollection(req.params.slug);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  // Tags routes
  app.get("/api/tags", async (_req: Request, res: Response) => {
    try {
      const articles = await storage.getArticles();
      
      // Extract and count tags
      const tagCounts: Record<string, number> = {};
      articles.forEach(article => {
        article.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      // Convert to array of tag objects with counts
      const tags = Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count,
        slug: name
      }));
      
      // Sort by count (descending)
      tags.sort((a, b) => b.count - a.count);
      
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tags" });
    }
  });

  app.get("/api/tags/:tag/articles", async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticlesByTag(req.params.tag);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tagged articles" });
    }
  });

  // Groups routes
  app.get("/api/groups", async (_req: Request, res: Response) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Error fetching groups" });
    }
  });

  app.get("/api/groups/:slug", async (req: Request, res: Response) => {
    try {
      const group = await storage.getGroup(req.params.slug);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Error fetching group" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
