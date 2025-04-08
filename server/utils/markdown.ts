import { marked } from 'marked';
import matter from 'gray-matter';
import { processMarkdownImages } from './images/optimizer';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
  async: false, // Ensure synchronous operation
});

interface ParsedContent {
  content: string;
  html: string;
  frontmatter: Record<string, any>;
  excerpt?: string;
}

/**
 * Parses markdown content with frontmatter
 */
export async function parseMarkdown(markdown: string, processImages = true): Promise<ParsedContent> {
  // Parse the frontmatter
  const { content: originalContent, data: frontmatter } = matter(markdown);
  
  // Create an excerpt from the first paragraph
  const excerpt = originalContent.split('\n\n')[0].replace(/[#*`]/g, '');
  
  // Process images if enabled
  let content: string = originalContent;
  if (processImages) {
    try {
      content = await processMarkdownImages(originalContent);
    } catch (error) {
      console.error('Error processing images in markdown:', error);
      // Fallback to original content if image processing fails
    }
  }
  
  // Convert markdown to HTML with type narrowing
  let html: string;
  const result = marked(content);
  if (typeof result === 'string') {
    html = result;
  } else {
    html = await result;
  }
  
  return {
    content,
    html,
    frontmatter,
    excerpt
  };
}

/**
 * Synchronous version of parseMarkdown (does not process images)
 */
export function parseMarkdownSync(markdown: string): ParsedContent {
  // Parse the frontmatter
  const { content, data: frontmatter } = matter(markdown);
  
  // Create an excerpt from the first paragraph
  const excerpt = content.split('\n\n')[0].replace(/[#*`]/g, '');
  
  // Convert markdown to HTML with type narrowing
  const result = marked(content);
  // This should always be a string since we've set async: false
  const html = typeof result === 'string' ? result : ''; 
  
  return {
    content,
    html,
    frontmatter,
    excerpt
  };
}

/**
 * Sanitizes a string to create a URL slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}