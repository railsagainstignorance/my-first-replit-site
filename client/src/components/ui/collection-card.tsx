import { Link } from "wouter";
import { type Article, type Collection } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionCardProps {
  collection: Collection;
  articles?: Article[]; // Make articles optional
}

const CollectionCard = ({ collection, articles: initialArticles }: CollectionCardProps) => {
  // Fetch articles for this collection if not provided
  const { data: fetchedArticles, isLoading } = useQuery<Article[]>({
    queryKey: [`/api/collections/${collection.slug}/articles`],
    // Skip the fetch if we already have initial articles
    enabled: !initialArticles || initialArticles.length === 0,
  });
  
  // Use provided articles or fetched ones
  const articles = initialArticles?.length ? initialArticles : fetchedArticles || [];
  
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="py-3">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <div className="flex items-center">
            <Skeleton className="h-4 w-24" />
            <div className="mx-2">•</div>
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
  
  // Empty state component
  const EmptyState = () => (
    <div className="py-3 text-center text-gray-500">
      No articles found in this collection.
    </div>
  );
  
  // Articles list component
  const ArticlesList = () => (
    <>
      {articles.slice(0, 3).map((article) => (
        <Link key={article.slug} href={`/articles/${article.slug}`}>
          <a className="block py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-medium text-gray-900">{article.title}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </a>
        </Link>
      ))}
    </>
  );
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{collection.name}</h3>
        <p className="text-gray-700 mb-4">{collection.description}</p>
        
        <div className="divide-y divide-neutral-200">
          {isLoading ? (
            <LoadingSkeleton />
          ) : articles.length === 0 ? (
            <EmptyState />
          ) : (
            <ArticlesList />
          )}
        </div>
        
        {articles.length > 3 && (
          <div className="mt-4 text-right">
            <Link href={`/collections/${collection.slug}`}>
              <a className="text-primary hover:text-primary-700 text-sm font-medium">
                View all {collection.name.toLowerCase()} <ChevronRight className="inline-block h-3 w-3 ml-1" />
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
