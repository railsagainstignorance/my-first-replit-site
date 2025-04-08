import { useQuery } from "@tanstack/react-query";
import { type Group } from "@/lib/types";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, ChevronRight } from "lucide-react";

const Groups = () => {
  const { data: groups, isLoading, isError } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Groups</h1>
          <p className="mt-2 text-gray-700">
            Browse curated collections of articles organized into meaningful groups.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-7 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5 mb-4" />
                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <Skeleton className="h-5 w-1/2" />
                    <div className="mt-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="py-2">
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Error loading groups.</p>
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
            {groups.map((group) => (
              <div key={group.slug} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                    <Book className="h-5 w-5 mr-2 text-primary" />
                    {group.name}
                  </h2>
                  <p className="text-gray-700 mb-4">{group.description}</p>
                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Chapters</h3>
                    <div className="pl-4 border-l-2 border-primary-100">
                      {group.chapters.slice(0, 3).map((chapter, index) => (
                        <div key={index} className="py-2">
                          <h4 className="text-base font-medium text-gray-900">{chapter.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">
                            {chapter.description.substring(0, 80)}
                            {chapter.description.length > 80 ? '...' : ''}
                          </p>
                        </div>
                      ))}
                      {group.chapters.length > 3 && (
                        <div className="text-sm text-gray-500 mt-1">
                          +{group.chapters.length - 3} more chapters
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-right">
                      <Link href={`/groups/${group.slug}`}>
                        <a className="text-primary hover:text-primary-700 text-sm font-medium">
                          View group <ChevronRight className="inline-block h-3 w-3 ml-1" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-700">
              There are currently no content groups available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;