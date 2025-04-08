import { useQuery } from "@tanstack/react-query";
import { type Article } from "@/lib/types";
import ArticleCard from "@/components/ui/article-card";
import { Skeleton } from "@/components/ui/skeleton";

const Articles = () => {
  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Articles</h1>
          <p className="mt-2 text-gray-700">
            Browse all articles across all collections.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Error loading articles.</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} featured />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;