import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { type Group } from "@/lib/types";

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  // Calculate the number of chapters
  const chapterCount = group.chapters.length;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
        <p className="text-gray-700 mt-2 mb-4">{group.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
          </span>
          <Link href={`/groups/${group.slug}`}>
            <a className="text-primary hover:text-primary-700 text-sm font-medium inline-flex items-center">
              View details <ChevronRight className="inline-block h-3 w-3 ml-1" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;