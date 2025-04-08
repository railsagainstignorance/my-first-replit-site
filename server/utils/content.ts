import fs from 'fs-extra';
import path from 'path';
import { parseMarkdown, slugify } from './markdown';
import { Article, InsertArticle, Collection, InsertCollection, Group, InsertGroup } from '@shared/schema';
import { storage } from '../storage';

const CONTENT_DIR = path.join(process.cwd(), 'client', 'public', 'content');

/**
 * Loads all markdown content from the filesystem
 */
export async function loadContent() {
  await ensureCollections();
  await loadArticles();
  await loadGroups();
}

/**
 * Ensures all collection directories are registered
 */
async function ensureCollections() {
  try {
    // Get collection directories
    const collections = await fs.readdir(CONTENT_DIR);

    // Process each collection
    for (const collectionName of collections) {
      const collectionPath = path.join(CONTENT_DIR, collectionName);
      const stats = await fs.stat(collectionPath);
      
      // Skip if not a directory
      if (!stats.isDirectory()) continue;
      
      // Create collection
      const collection: InsertCollection = {
        name: collectionName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        slug: collectionName,
        description: `${collectionName} collection`
      };
      
      try {
        await storage.createCollection(collection);
      } catch (error) {
        console.log(`Collection ${collectionName} already exists`);
      }
    }
  } catch (error) {
    console.error('Error ensuring collections:', error);
  }
}

/**
 * Loads all articles from the filesystem
 */
async function loadArticles() {
  try {
    // Get collection directories
    const collections = await fs.readdir(CONTENT_DIR);

    // Process each collection
    for (const collectionName of collections) {
      const collectionPath = path.join(CONTENT_DIR, collectionName);
      const stats = await fs.stat(collectionPath);
      
      // Skip if not a directory
      if (!stats.isDirectory()) continue;
      
      // Process each markdown file
      const files = await fs.readdir(collectionPath);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(collectionPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Parse the markdown
        const { frontmatter, content, html } = parseMarkdown(fileContent);
        
        // Create the slug from filename or frontmatter
        const slug = frontmatter.slug || slugify(file.replace('.md', ''));
        
        // Process tags
        const tags = frontmatter.tags || [];
        
        // Create article
        const article: InsertArticle = {
          slug,
          title: frontmatter.title || slug,
          content,
          html,
          collection: collectionName,
          date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
          updatedAt: frontmatter.updated ? new Date(frontmatter.updated) : undefined,
          sequence: frontmatter.sequence || null,
          tags,
          frontmatter
        };
        
        try {
          await storage.createArticle(article);
        } catch (error) {
          console.log(`Article ${slug} already exists`);
        }
      }
    }
  } catch (error) {
    console.error('Error loading articles:', error);
  }
}

/**
 * Loads groups from the filesystem
 */
async function loadGroups() {
  try {
    const groupsPath = path.join(CONTENT_DIR, 'groups');
    
    // Skip if groups directory doesn't exist
    if (!await fs.pathExists(groupsPath)) return;
    
    // Process each group file
    const files = await fs.readdir(groupsPath);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(groupsPath, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse the group JSON
      const groupData = JSON.parse(fileContent);
      
      // Create group
      const group: InsertGroup = {
        name: groupData.name,
        slug: groupData.slug || slugify(groupData.name),
        description: groupData.description || '',
        chapters: groupData.chapters || []
      };
      
      try {
        await storage.createGroup(group);
      } catch (error) {
        console.log(`Group ${group.slug} already exists`);
      }
    }
  } catch (error) {
    console.error('Error loading groups:', error);
  }
}

/**
 * Loads sample content if no content exists
 */
export async function createSampleContent() {
  // Create tutorials collection directory
  const tutorialsPath = path.join(CONTENT_DIR, 'tutorials');
  await fs.ensureDir(tutorialsPath);
  
  // Create docs collection directory
  const docsPath = path.join(CONTENT_DIR, 'docs');
  await fs.ensureDir(docsPath);
  
  // Create groups directory
  const groupsPath = path.join(CONTENT_DIR, 'groups');
  await fs.ensureDir(groupsPath);
  
  // Create sample group
  const gettingStartedGroup = {
    name: "Getting Started Guide",
    slug: "getting-started-guide",
    description: "A curated collection of articles to help you get started with StaticPress. Follow these guides in sequence for the best learning experience.",
    chapters: [
      {
        title: "Chapter 1: Installation and Setup",
        description: "Learn how to install StaticPress and configure your first site.",
        articles: [
          { slug: "getting-started", collection: "tutorials" },
          { slug: "yaml-frontmatter", collection: "tutorials" },
          { slug: "collections", collection: "docs" }
        ]
      },
      {
        title: "Chapter 2: Content Organization",
        description: "Explore different ways to organize your content with collections and tags.",
        articles: [
          { slug: "collections", collection: "docs" },
          { slug: "yaml-frontmatter", collection: "tutorials" }
        ]
      },
      {
        title: "Chapter 3: Advanced Features",
        description: "Discover more powerful features to enhance your static site.",
        articles: [
          { slug: "getting-started", collection: "tutorials" }
        ]
      }
    ]
  };
  
  // Write the sample group file
  await fs.writeFile(
    path.join(groupsPath, 'getting-started.json'),
    JSON.stringify(gettingStartedGroup, null, 2)
  );
}
