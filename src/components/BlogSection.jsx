import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData';

/* ════════════════════════════════════════════════════════════════════════════
   BlogSection.jsx – Reusable "Related Articles" blog section.
   
   Drop this into ANY page to show relevant blog articles.
   It auto-filters by category, or shows all if no category is given.
   
   Props:
     category  – 'Image Tools' | 'PDF Tools' | 'Document Tools' (optional)
     count     – Number of articles to show (default: 3)
     title     – Section title override (optional)
     subtitle  – Section subtitle override (optional)
   
   Usage:
     <BlogSection />                              // shows 3 latest articles
     <BlogSection category="Image Tools" />       // shows image-related first
     <BlogSection category="PDF Tools" count={6}/> // shows all 6
   ════════════════════════════════════════════════════════════════════════════ */

// ── Category badge colours (shared) ──────────────────────────────────────
const badgeStyles = {
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  green:  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  teal:   'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export default function BlogSection({
  category = null,
  count = 3,
  title = '📝 Learn More from Our Blog',
  subtitle = 'Expert guides and tips to help you get the most out of your files.',
}) {
  // Sort: matching category first, then others
  const sorted = category
    ? [
        ...blogPosts.filter(p => p.category === category),
        ...blogPosts.filter(p => p.category !== category),
      ]
    : blogPosts;

  const articles = sorted.slice(0, count);

  if (articles.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base transition-colors duration-500">
            {subtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Illustration */}
              <div className={`${post.illustrationBg} p-7 sm:p-9 flex items-center justify-center`}>
                <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {post.illustrationIcon}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Meta badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[post.categoryColor]}`}>
                    {post.categoryIcon} {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱ {post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2 leading-snug">
                  {post.shortTitle}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow line-clamp-2 mb-3">
                  {post.description}
                </p>

                {/* Read link */}
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg text-sm sm:text-base"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
