import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogData';

/* ════════════════════════════════════════════════════════════════════════════
   Blog.jsx — Blog listing / index page.
   Shows all articles in a responsive grid with featured article highlight,
   category filters, and full SEO markup.
   ════════════════════════════════════════════════════════════════════════════ */

const DOMAIN = 'https://www.allfilechanger.shop';

// ── Category badge styles ────────────────────────────────────────────────
const categoryStyles = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featured = blogPosts[0]; // latest = featured
  const rest = blogPosts.slice(1);

  // ── Schema ─────────────────────────────────────────────────────────
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AllFileChanger Blog — File Conversion Guides & Tips',
    description: 'Expert guides on image compression, PDF conversion, OCR, and file optimization. Learn how to work with images, PDFs, and documents more efficiently.',
    url: `${DOMAIN}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'AllFileChanger',
      url: DOMAIN,
    },
    blogPost: blogPosts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.publishedDate,
      dateModified: p.modifiedDate,
      url: `${DOMAIN}/blog/${p.slug}`,
      author: { '@type': 'Organization', name: 'AllFileChanger' },
    })),
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Blog — File Conversion Guides, Tips & Tutorials | AllFileChanger"
        description="Expert guides on image compression, PDF conversion, OCR technology, and file optimization. Learn best practices for working with images, PDFs, and documents."
        keywords="file conversion guide, image compression tips, pdf tutorial, ocr guide, image optimization, pdf to word guide, webp vs jpeg"
        type="website"
        schema={blogSchema}
        breadcrumbs={breadcrumbs}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-5 dark:opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-10 sm:pb-14">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">Blog</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            📝 AllFileChanger Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Expert guides, tutorials, and tips on image compression, PDF conversion, OCR, and file optimization.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* ── Featured Article ────────────────────────────────────────── */}
        <Link
          to={`/blog/${featured.slug}`}
          className="group block mb-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`${featured.illustrationBg} p-10 sm:p-16 flex items-center justify-center min-h-[200px]`}>
              <div className="text-center">
                <span className="text-7xl sm:text-8xl block mb-2">{featured.illustrationIcon}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured Article
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[featured.categoryColor]}`}>
                  {featured.categoryIcon} {featured.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">⏱ {featured.readTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-3 leading-tight">
                {featured.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                {featured.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>📅 {new Date(featured.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">Read More →</span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Article Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              {/* Card Illustration */}
              <div className={`${post.illustrationBg} p-8 sm:p-10 flex items-center justify-center`}>
                <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform">
                  {post.illustrationIcon}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryStyles[post.categoryColor]}`}>
                    {post.categoryIcon} {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱ {post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2 leading-snug">
                  {post.shortTitle}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow line-clamp-3">
                  {post.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to convert your files?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
            AllFileChanger offers 25+ free tools for images, PDFs, and documents. No registration required.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Explore All Tools →
          </Link>
        </div>
      </main>
    </div>
  );
}
