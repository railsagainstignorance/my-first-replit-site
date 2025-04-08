import { Link } from "wouter";
import { type Group } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface ChaptersListProps {
  group: Group;
}

const ChaptersList = ({ group }: ChaptersListProps) => {
  // For each article in each chapter, fetch the article details
  const articleQueries = group.chapters.flatMap(chapter => 
    chapter.articles.map(article => {
      const queryKey = `/api/articles/${article.slug}`;
      return useQuery({
        queryKey: [queryKey],
        enabled: true, // Enable the query to automatically fetch
      });
    })
  );

  // Check if all article queries are loaded
  const isLoading = articleQueries.some(query => query.isLoading);

  // Create a lookup map for article data
  const articleData = Object.fromEntries(
    articleQueries
      .filter(query => query.data)
      .map(query => [query.data.slug, query.data])
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-neutral-200">
        {group.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{chapter.title}</h3>
              <p className="text-gray-700 mb-4">{chapter.description}</p>
              
              <div className="mt-4 pl-4 border-l-2 border-primary-100">
                {isLoading ? (
                  <p className="text-gray-500 text-sm">Loading chapter articles...</p>
                ) : (
                  chapter.articles.map((articleRef, articleIndex) => {
                    const article = articleData[articleRef.slug];
                    if (!article) return null;
                    
                    return (
                      <Link key={articleIndex} href={`/articles/${article.slug}`}>
                        <a className="block py-2 hover:bg-gray-50 -ml-4 pl-4 transition-colors">
                          <h4 className="text-base font-medium text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">
                            {article.frontmatter.excerpt || article.content.substring(0, 100).replace(/#/g, '').trim() + '...'}
                          </p>
                        </a>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChaptersList;
