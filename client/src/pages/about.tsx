import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">About StaticPress</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">A Modern Static Content Publishing System</h2>
            <div className="prose max-w-none">
              <p>
                StaticPress is a simple, robust, static content publishing site designed for developers, writers, and content creators who want a straightforward way to publish content with powerful organization tools.
              </p>

              <h3>Features</h3>
              <ul>
                <li><strong>Markdown Support</strong> - Write your content in Markdown with YAML frontmatter</li>
                <li><strong>Collections</strong> - Organize your content into different collections</li>
                <li><strong>Custom Ordering</strong> - Order articles by date or with custom sequence values</li>
                <li><strong>Tagging System</strong> - Categorize articles with tags for better discoverability</li>
                <li><strong>Curated Groups</strong> - Create "book-like" chapters from articles across collections</li>
                <li><strong>HTML Embedding</strong> - Include custom HTML within your markdown content</li>
                <li><strong>Responsive Design</strong> - Looks great on all devices</li>
              </ul>

              <h3>How It Works</h3>
              <p>
                StaticPress works by parsing markdown files with YAML frontmatter and organizing them based on your configuration. You can create multiple collections, curate content into groups, and easily navigate between related articles.
              </p>

              <h3>Getting Started</h3>
              <p>
                To get started with StaticPress, check out our <a href="/groups/getting-started-guide" className="text-primary hover:text-primary-700">Getting Started Guide</a>, which walks you through setting up your first site and creating content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              For questions, feature requests, or bug reports, please reach out to us via email at <a href="mailto:info@staticpress.example" className="text-primary hover:text-primary-700">info@staticpress.example</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
