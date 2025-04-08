import { useQuery } from "@tanstack/react-query";
import { type Tag } from "@/lib/types";
import TagCloud from "@/components/ui/tag-cloud";
import { Skeleton } from "@/components/ui/skeleton";

const Tags = () => {
  const { data: tags, isLoading, isError } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="mt-2 text-gray-700">
            Browse content by tags to find related articles across collections.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        ) : isError || !tags ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Error loading tags.</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-700">No tags found.</p>
          </div>
        ) : (
          <TagCloud tags={tags} />
        )}
      </div>
    </div>
  );
};

export default Tags;
