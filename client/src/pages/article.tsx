import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Article as ArticleType } from "@/lib/types";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Article = () => {
  const [match, params] = useRoute("/articles/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, isError } = useQuery<ArticleType>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  if (!match) return null;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
            <p className="mt-2 text-gray-700">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link href="/">
                <a className="text-primary hover:text-primary-700">Return to home</a>
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article?.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${tag}`}>
                      <span className="tag-pill inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 transition-transform cursor-pointer">
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{article?.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>Published: {article && format(new Date(article.date), 'MMMM d, yyyy')}</span>
                  {article?.updatedAt && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Last updated: {format(new Date(article.updatedAt), 'MMMM d, yyyy')}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2 mt-8" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: article?.html || '' }}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href={`/collections/${article?.collection}`}>
            <a className="text-primary hover:text-primary-700">
              Back to {article?.collection}
            </a>
          </Link>
          {article?.tags.length > 0 && (
            <Link href={`/tags/${article?.tags[0]}`}>
              <a className="text-primary hover:text-primary-700">
                More on {article?.tags[0]}
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
