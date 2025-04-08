import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Group as GroupType } from "@/lib/types";
import ChaptersList from "@/components/ui/chapters-list";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const Group = () => {
  const [match, params] = useRoute("/groups/:slug");
  const slug = params?.slug;

  const { data: group, isLoading, isError } = useQuery<GroupType>({
    queryKey: [`/api/groups/${slug}`],
    enabled: !!slug,
  });

  if (!match) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        {isLoading ? (
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">Group not found</h1>
            <p className="mt-2 text-gray-700">
              The group you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link href="/">
                <a className="text-primary hover:text-primary-700">Return to home</a>
              </Link>
            </div>
          </div>
        ) : group ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="mt-2 text-gray-700">{group.description}</p>
            </div>
            <ChaptersList group={group} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Group;
