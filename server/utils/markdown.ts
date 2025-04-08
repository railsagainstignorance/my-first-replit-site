import { marked } from 'marked';
import matter from 'gray-matter';

interface ParsedContent {
  content: string;
  html: string;
  frontmatter: Record<string, any>;
  excerpt?: string;
}

/**
 * Parses markdown content with frontmatter
 */
export function parseMarkdown(markdown: string): ParsedContent {
  // Parse the frontmatter
  const { content, data: frontmatter } = matter(markdown);
  
  // Create an excerpt from the first paragraph
  const excerpt = content.split('\n\n')[0].replace(/[#*`]/g, '');
  
  // Convert markdown to HTML
  const html = marked.parse(content, { headerIds: true, mangle: false });
  
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
