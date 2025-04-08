import { Link } from "wouter";
import { type Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(article.date), { addSuffix: true });
  
  // Generate a predictable placeholder image based on article title
  const imageId = article.title.length % 10 + 1;
  // Using placeholders from picsum.photos for reliable image generation
  const imageUrl = `https://picsum.photos/seed/${article.slug}/800/400`;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md">
      {featured && (
        <div className="h-48 w-full bg-gray-100 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={imageUrl}
            alt={article.title}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 3).map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <span className="tag-pill inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 transition-transform cursor-pointer">
                {tag}
              </span>
            </Link>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-700 text-sm mb-4">
          {article.frontmatter.excerpt || article.content.substring(0, 120).replace(/#/g, '').trim() + '...'}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <Link href={`/articles/${article.slug}`}>
            <a className="text-primary hover:text-primary-700 text-sm font-medium">Read more</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
