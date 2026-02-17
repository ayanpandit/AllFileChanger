import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SEO from '../components/SEO';
import { getBlogBySlug, getRelatedBlogs, blogPosts } from '../data/blogData';

/* ════════════════════════════════════════════════════════════════════════════
   BlogPost.jsx — Individual blog article page.
   Rich SEO with Article schema, FAQ schema, breadcrumbs, table of contents,
   responsive design, dark mode, and related content.
   ════════════════════════════════════════════════════════════════════════════ */

const DOMAIN = 'https://www.allfilechanger.shop';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // 404 — article not found
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedBlogs = getRelatedBlogs(slug, 3);

  // ── Structured Data ────────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${DOMAIN}/og-image.jpg`,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: { '@type': 'Organization', name: 'AllFileChanger', url: DOMAIN },
    publisher: {
      '@type': 'Organization',
      name: 'AllFileChanger',
      url: DOMAIN,
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${DOMAIN}/blog/${post.slug}` },
    wordCount: post.sections.reduce((sum, s) => sum + (s.content ? s.content.split(' ').length : 0), 0),
    articleSection: post.category,
  };

  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.shortTitle },
  ];

  const combinedSchema = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  // ── Category badge colors ──────────────────────────────────────────
  const categoryStyles = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title={`${post.title} | AllFileChanger Blog`}
        description={post.description}
        keywords={post.keywords}
        type="article"
        schema={combinedSchema}
        breadcrumbs={breadcrumbs}
        publishedTime={post.publishedDate}
        modifiedTime={post.modifiedDate}
        author={post.author}
      />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${post.illustrationGradient} opacity-5 dark:opacity-10`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300 truncate">{post.shortTitle}</span>
          </nav>

          {/* Category + Read time */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[post.categoryColor]}`}>
              {post.categoryIcon} {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">⏱ {post.readTime}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              📅 {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
            {post.description}
          </p>

          {/* CTA to related tool */}
          <div className="mt-6">
            <Link
              to={post.relatedTool.path}
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${post.illustrationGradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg`}
            >
              Try {post.relatedTool.name} Free →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Illustration Banner ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-10">
        <div className={`${post.illustrationBg} rounded-2xl p-8 sm:p-12 flex items-center justify-center border border-gray-200 dark:border-gray-700`}>
          <div className="text-center">
            <span className="text-6xl sm:text-8xl block mb-3">{post.illustrationIcon}</span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {post.category} — {post.shortTitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Article Body ──────────────────────────────────────────────── */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Table of Contents (mobile — collapsible) */}
            <details className="lg:hidden mb-8 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                📋 Table of Contents
              </summary>
              <nav className="mt-3 space-y-2">
                {post.tableOfContents.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline pl-3 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </details>

            {/* Content Sections */}
            {post.sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {section.heading}
                </h2>

                {/* Table */}
                {section.isTable && section.tableHeaders && (
                  <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          {section.tableHeaders.map((h, i) => (
                            <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.tableRows.map((row, ri) => (
                          <tr key={ri} className="border-t border-gray-100 dark:border-gray-800 even:bg-gray-50 dark:even:bg-gray-800/50">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Checklist / List */}
                {section.isList && section.listItems && (
                  <ul className="space-y-3 mb-6">
                    {section.listItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Prose Content */}
                {section.content && (
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {section.content.split('\n\n').map((para, pi) => {
                      // Render bold text with ** markers
                      const renderText = (text) => {
                        const parts = text.split(/(\*\*[^*]+\*\*)/g);
                        return parts.map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
                          }
                          // Handle inline code with backticks
                          const codeParts = part.split(/(`[^`]+`)/g);
                          return codeParts.map((cp, ci) => {
                            if (cp.startsWith('`') && cp.endsWith('`')) {
                              return (
                                <code key={`${i}-${ci}`} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
                                  {cp.slice(1, -1)}
                                </code>
                              );
                            }
                            return <span key={`${i}-${ci}`}>{cp}</span>;
                          });
                        });
                      };

                      // List items starting with -
                      if (para.trim().startsWith('- ')) {
                        const items = para.trim().split('\n').filter(l => l.trim().startsWith('- '));
                        return (
                          <ul key={pi} className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                            {items.map((item, ii) => (
                              <li key={ii} className="leading-relaxed">{renderText(item.replace(/^- /, ''))}</li>
                            ))}
                          </ul>
                        );
                      }

                      return (
                        <p key={pi} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {renderText(para)}
                        </p>
                      );
                    })}
                  </div>
                )}
              </section>
            ))}

            {/* ── FAQ Section ──────────────────────────────────────────── */}
            {post.faqs?.length > 0 && (
              <section id="faq" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <span className="pr-4">{faq.q}</span>
                        <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* ── CTA Banner ──────────────────────────────────────────── */}
            <div className={`bg-gradient-to-r ${post.illustrationGradient} rounded-2xl p-6 sm:p-8 text-white mb-12`}>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to try it yourself?</h3>
              <p className="opacity-90 mb-4">
                Use AllFileChanger's {post.relatedTool.name} — free, fast, and no registration required.
              </p>
              <Link
                to={post.relatedTool.path}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                {post.relatedTool.name} →
              </Link>
            </div>

            {/* ── Related Tools ────────────────────────────────────────── */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {post.relatedTools.map(tool => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition group"
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {tool.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Related Articles ─────────────────────────────────────── */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedBlogs.map(blog => (
                  <Link
                    key={blog.slug}
                    to={`/blog/${blog.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <div className={`${blog.illustrationBg} p-6 flex items-center justify-center`}>
                      <span className="text-4xl">{blog.illustrationIcon}</span>
                    </div>
                    <div className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${categoryStyles[blog.categoryColor]}`}>
                        {blog.category}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-sm leading-snug">
                        {blog.shortTitle}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{blog.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar: TOC (desktop) ────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <nav className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-3">
                  📋 Contents
                </h3>
                <div className="space-y-2">
                  {post.tableOfContents.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition pl-3 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-500"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>

              {/* Tool CTA in sidebar */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">🛠 Try the Tool</p>
                <Link
                  to={post.relatedTool.path}
                  className={`block text-center bg-gradient-to-r ${post.illustrationGradient} text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition`}
                >
                  {post.relatedTool.name}
                </Link>
              </div>

              {/* Other articles */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📰 More Articles</p>
                <div className="space-y-2">
                  {blogPosts
                    .filter(p => p.slug !== slug)
                    .slice(0, 4)
                    .map(p => (
                      <Link
                        key={p.slug}
                        to={`/blog/${p.slug}`}
                        className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition truncate"
                      >
                        → {p.shortTitle}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
