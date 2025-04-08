import { useQuery } from "@tanstack/react-query";
import { type Collection, type Article } from "@/lib/types";
import CollectionCard from "@/components/ui/collection-card";
import { Skeleton } from "@/components/ui/skeleton";

const Collections = () => {
  const { data: collections, isLoading: collectionsLoading, isError: collectionsError } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  // We can't use dynamic hooks, so we'll implement a more sophisticated solution
  // that doesn't violate React's Rules of Hooks
  
  // Instead of fetching every collection's articles upfront,
  // we'll fetch them when a collection card is rendered (in the component)
  // This way we avoid hooks in loops issue
  
  const isLoading = collectionsLoading;
  const isError = collectionsError;
  
  // Empty map - articles will be fetched in the CollectionCard component
  const collectionArticles: Record<string, Article[]> = {};

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="mt-2 text-gray-700">
            Browse all content collections available on the site.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-7 w-1/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="divide-y divide-neutral-200">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="py-3">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-24" />
                          <div className="mx-2">•</div>
                          <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError || !collections ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Error loading collections.</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">No collections found.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                articles={collectionArticles[collection.slug] || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
