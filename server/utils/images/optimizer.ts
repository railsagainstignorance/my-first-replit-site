import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promises as fsPromises } from 'fs';

// Define output directory for optimized images
const OPTIMIZED_IMAGES_DIR = path.join(process.cwd(), 'client', 'public', 'optimized-images');

// Create the optimized images directory if it doesn't exist
async function ensureOptimizedDirExists() {
  try {
    await fsPromises.mkdir(OPTIMIZED_IMAGES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating optimized images directory:', error);
  }
}

// Initialize the optimizer
export async function initImageOptimizer() {
  await ensureOptimizedDirExists();
  console.log('Image optimizer initialized');
}

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// Interface for optimization options
export interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// Default optimization options
const DEFAULT_OPTIONS: OptimizeOptions = {
  width: 1200,
  quality: 80,
  format: 'webp',
  fit: 'cover'
};

/**
 * Generate a hash for the image path and options to use as cache key
 */
function generateImageCacheKey(imagePath: string, options: OptimizeOptions): string {
  const hash = crypto.createHash('md5');
  hash.update(imagePath + JSON.stringify(options));
  return hash.digest('hex');
}

/**
 * Get the cached image path if it exists
 */
function getCachedImagePath(imagePath: string, options: OptimizeOptions): string | null {
  const hash = generateImageCacheKey(imagePath, options);
  const format = options.format || path.extname(imagePath).slice(1) || 'webp';
  const cachedPath = path.join(OPTIMIZED_IMAGES_DIR, `${hash}.${format}`);
  
  return fs.existsSync(cachedPath) ? cachedPath : null;
}

/**
 * Optimize an image and return the path to the optimized version
 */
export async function optimizeImage(
  imagePath: string,
  customOptions: Partial<OptimizeOptions> = {}
): Promise<string | null> {
  try {
    // Check if the image exists and has a supported format
    if (!fs.existsSync(imagePath)) {
      console.error(`Image not found: ${imagePath}`);
      return null;
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      console.error(`Unsupported image format: ${ext}`);
      return null;
    }

    // Merge default options with custom options
    const options = { ...DEFAULT_OPTIONS, ...customOptions };
    
    // Check if we already have a cached version
    const cachedPath = getCachedImagePath(imagePath, options);
    if (cachedPath) {
      return cachedPath.replace(path.join(process.cwd(), 'client', 'public'), '');
    }

    // Ensure the optimized directory exists
    await ensureOptimizedDirExists();

    // Generate a unique filename based on the source path and options
    const hash = generateImageCacheKey(imagePath, options);
    const format = options.format || ext.slice(1) || 'webp';
    const outputPath = path.join(OPTIMIZED_IMAGES_DIR, `${hash}.${format}`);
    
    // Process the image with sharp
    let pipeline = sharp(imagePath);

    // Resize if width or height is specified
    if (options.width || options.height) {
      pipeline = pipeline.resize({
        width: options.width,
        height: options.height,
        fit: options.fit,
        withoutEnlargement: true
      });
    }

    // Convert to the specified format with quality options
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality: options.quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality: options.quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality: options.quality });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality: options.quality });
    }

    // Save the optimized image
    await pipeline.toFile(outputPath);
    
    // Return the public URL path
    return outputPath.replace(path.join(process.cwd(), 'client', 'public'), '');
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
}

/**
 * Extract image paths from markdown content
 */
export function extractImagesFromMarkdown(content: string): string[] {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const htmlImageRegex = /<img.*?src=["'](.*?)["']/g;
  
  const images: string[] = [];
  let match;
  
  // Extract markdown image syntax ![alt](path)
  while ((match = imageRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('http')) {
      images.push(match[1]);
    }
  }
  
  // Extract HTML image tags <img src="path">
  while ((match = htmlImageRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('http')) {
      images.push(match[1]);
    }
  }
  
  return images;
}

/**
 * Process all images in markdown content
 */
export async function processMarkdownImages(
  content: string,
  basePath: string = 'client/public'
): Promise<string> {
  const images = extractImagesFromMarkdown(content);
  
  // Process each image and replace with optimized version
  for (const imagePath of images) {
    // Handle relative paths
    const fullPath = path.join(process.cwd(), basePath, imagePath);
    
    if (fs.existsSync(fullPath)) {
      const optimizedPath = await optimizeImage(fullPath);
      
      if (optimizedPath) {
        // Replace the image path in the content
        content = content.replace(
          new RegExp(`!\\[.*?\\]\\(${imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'),
          (match) => match.replace(imagePath, optimizedPath)
        );
        
        // Also replace in HTML img tags
        content = content.replace(
          new RegExp(`<img.*?src=["']${imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
          (match) => match.replace(imagePath, optimizedPath)
        );
      }
    }
  }
  
  return content;
}

// Export a function that can be used as Express middleware
export function createImageOptimizationMiddleware() {
  ensureOptimizedDirExists();
  
  return async (req: any, res: any, next: any) => {
    const imageRegex = /\.(jpe?g|png|gif|webp|avif)$/i;
    
    if (imageRegex.test(req.path) && !req.path.includes('/optimized-images/')) {
      const imagePath = path.join(process.cwd(), 'client', 'public', req.path);
      
      if (fs.existsSync(imagePath)) {
        try {
          // Parse optimization options from query string
          const options: OptimizeOptions = {};
          
          if (req.query.width) options.width = parseInt(req.query.width);
          if (req.query.height) options.height = parseInt(req.query.height);
          if (req.query.quality) options.quality = parseInt(req.query.quality);
          if (req.query.format) options.format = req.query.format as any;
          if (req.query.fit) options.fit = req.query.fit as any;
          
          const optimizedPath = await optimizeImage(imagePath, options);
          
          if (optimizedPath) {
            // Redirect to the optimized version
            return res.redirect(optimizedPath);
          }
        } catch (error) {
          console.error('Error in image optimization middleware:', error);
        }
      }
    }
    
    next();
  };
}