import { useQuery } from "@tanstack/react-query";
import { type Article, type Collection, type Group, type Tag } from "@/lib/types";
import ArticleCard from "@/components/ui/article-card";
import CollectionCard from "@/components/ui/collection-card";
import ChaptersList from "@/components/ui/chapters-list";
import TagCloud from "@/components/ui/tag-cloud";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  // Fetch all articles
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Fetch all collections
  const { data: collections, isLoading: collectionsLoading } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  // Fetch all groups
  const { data: groups, isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  // Fetch all tags
  const { data: tags, isLoading: tagsLoading } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  // Filter out the "groups" collection as it's just for organization, not content
  const filteredCollections = collections?.filter(c => c.slug !== "groups") || [];
  
  // Fetch articles by collection for the first two collections (for homepage display)
  const firstTwoCollections = filteredCollections.slice(0, 2) || [];
  
  // Use a predictable and fixed number of hooks
  const firstCollectionArticles = useQuery<Article[]>({
    queryKey: firstTwoCollections[0] ? [`/api/collections/${firstTwoCollections[0].slug}/articles`] : ['no-collection-1'],
    enabled: !!firstTwoCollections[0],
  });
  
  const secondCollectionArticles = useQuery<Article[]>({
    queryKey: firstTwoCollections[1] ? [`/api/collections/${firstTwoCollections[1].slug}/articles`] : ['no-collection-2'],
    enabled: !!firstTwoCollections[1],
  });

  const featuredArticles = articles?.slice(0, 3) || [];
  const featuredGroup = groups?.[0];

  // Build collection articles map for the first two collections
  const collectionArticles: Record<string, Article[]> = {};
  
  if (firstTwoCollections[0] && firstCollectionArticles.data) {
    collectionArticles[firstTwoCollections[0].slug] = firstCollectionArticles.data;
  }
  
  if (firstTwoCollections[1] && secondCollectionArticles.data) {
    collectionArticles[firstTwoCollections[1].slug] = secondCollectionArticles.data;
  }

  return (
    <main className="flex-1">
      {/* Hero/Featured Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Publishing Made Simple</h1>
          <p className="mt-2 text-lg text-gray-700">
            A static site generator with markdown support, collections, and powerful curation tools.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Featured Articles */}
        <div className="px-4 sm:px-0 mb-10">
          <div className="border-b border-neutral-200 pb-2 mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Articles</h2>
            <Link href="/articles">
              <a className="text-primary hover:text-primary-700 text-sm font-medium">
                View all <ChevronRight className="inline-block h-3 w-3 ml-1" />
              </a>
            </Link>
          </div>

          {articlesLoading ? (
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          )}
        </div>

        {/* Article Collections */}
        <div className="px-4 sm:px-0 mb-10">
          <div className="border-b border-neutral-200 pb-2 mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Collections</h2>
            <Link href="/collections">
              <a className="text-primary hover:text-primary-700 text-sm font-medium">
                View all collections <ChevronRight className="inline-block h-3 w-3 ml-1" />
              </a>
            </Link>
          </div>

          {collectionsLoading ? (
            <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1">
              {[1, 2].map((i) => (
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
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1">
              {firstTwoCollections.map((collection) => (
                <CollectionCard
                  key={collection.slug}
                  collection={collection}
                  articles={collectionArticles[collection.slug] || []}
                />
              ))}
            </div>
          )}
        </div>

        {/* Example Curated Group */}
        {groupsLoading || !featuredGroup ? (
          <div className="px-4 sm:px-0 mb-10">
            <div className="border-b border-neutral-200 pb-2 mb-6">
              <Skeleton className="h-7 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-neutral-200">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="mt-4 pl-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="mb-4">
                          <Skeleton className="h-5 w-1/2 mb-1" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-0 mb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">Groups</h2>
              <Link href="/groups">
                <a className="text-primary hover:text-primary-700 text-sm font-medium">
                  View all groups <ChevronRight className="inline-block h-3 w-3 ml-1" />
                </a>
              </Link>
            </div>
            <div className="border-b border-neutral-200 pb-2 mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{featuredGroup.name}</h3>
              <p className="text-gray-700 mt-2">{featuredGroup.description}</p>
            </div>
            <ChaptersList group={featuredGroup} />
          </div>
        )}

        {/* Popular Tags */}
        <div className="px-4 sm:px-0 mb-10">
          <div className="border-b border-neutral-200 pb-2 mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Popular Tags</h2>
            <Link href="/tags">
              <a className="text-primary hover:text-primary-700 text-sm font-medium">
                View all tags <ChevronRight className="inline-block h-3 w-3 ml-1" />
              </a>
            </Link>
          </div>

          {tagsLoading ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>
          ) : (
            <TagCloud tags={tags || []} limit={10} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
