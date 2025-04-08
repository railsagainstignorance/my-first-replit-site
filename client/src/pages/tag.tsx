import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Article } from "@/lib/types";
import ArticleCard from "@/components/ui/article-card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const Tag = () => {
  const [match, params] = useRoute("/tags/:tag");
  const tag = params?.tag;

  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: [`/api/tags/${tag}/articles`],
    enabled: !!tag,
  });

  if (!match) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLoading ? <Skeleton className="h-9 w-1/3" /> : `Tag: ${tag}`}
          </h1>
          <p className="mt-2 text-gray-700">
            {isLoading ? (
              <Skeleton className="h-5 w-2/3" />
            ) : (
              `Articles tagged with "${tag}"`
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
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
            <div className="mt-4">
              <Link href="/tags">
                <a className="text-primary hover:text-primary-700">Back to all tags</a>
              </Link>
            </div>
          </div>
        ) : articles?.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">No articles found with this tag.</p>
            <div className="mt-4">
              <Link href="/tags">
                <a className="text-primary hover:text-primary-700">Back to all tags</a>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {articles?.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tag;
