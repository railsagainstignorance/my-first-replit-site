import { Link } from "wouter";
import { type Tag } from "@/lib/types";

interface TagCloudProps {
  tags: Tag[];
  limit?: number;
}

const TagCloud = ({ tags, limit }: TagCloudProps) => {
  const displayTags = limit ? tags.slice(0, limit) : tags;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap gap-3">
        {displayTags.map((tag) => (
          <Link key={tag.name} href={`/tags/${tag.name}`}>
            <a className="tag-pill px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-primary-100 hover:text-primary-800 transition-all">
              {tag.name} <span className="text-gray-500 ml-1">({tag.count})</span>
            </a>
          </Link>
        ))}
      </div>
      
      {limit && tags.length > limit && (
        <div className="mt-4 text-right">
          <Link href="/tags">
            <a className="text-primary hover:text-primary-700 text-sm font-medium">
              View all tags
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TagCloud;
