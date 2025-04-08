import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Article, type Collection as CollectionType } from "@/lib/types";
import ArticleCard from "@/components/ui/article-card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const Collection = () => {
  const [match, params] = useRoute("/collections/:slug");
  const slug = params?.slug;

  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useQuery<CollectionType>({
    queryKey: [`/api/collections/${slug}`],
    enabled: !!slug,
  });

  const { data: articles, isLoading: articlesLoading, isError: articlesError } = useQuery<Article[]>({
    queryKey: [`/api/collections/${slug}/articles`],
    enabled: !!slug,
  });

  const isLoading = collectionLoading || articlesLoading;
  const isError = collectionError || articlesError;

  if (!match) return null;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">Collection not found</h1>
            <p className="mt-2 text-gray-700">
              The collection you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link href="/collections">
                <a className="text-primary hover:text-primary-700">View all collections</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        {isLoading ? (
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{collection?.name}</h1>
            <p className="mt-2 text-gray-700">{collection?.description}</p>
          </div>
        )}

        <div className="border-b border-neutral-200 pb-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Articles</h2>
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
        ) : articles && articles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">No articles found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
