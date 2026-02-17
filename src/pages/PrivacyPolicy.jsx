import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <SEO
        title="Privacy Policy"
        description="AllFileChanger Privacy Policy. Learn how we handle your data, files, and personal information. Your privacy and file security are our top priority."
        keywords="privacy policy, data protection, file security, allfilechanger privacy"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: February 17, 2026</p>

        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p>
              AllFileChanger ("we," "our," or "us") operates the website <strong>www.allfilechanger.shop</strong>.
              This Privacy Policy explains how we collect, use, and protect information when you use our free
              online file conversion tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Files You Upload</h3>
            <p>
              When you use our conversion tools, you upload files to our servers for processing. These files are:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Processed in memory</strong> — files are not permanently stored on our servers.</li>
              <li><strong>Automatically deleted</strong> — all uploaded and converted files are permanently deleted within 1 hour of processing.</li>
              <li><strong>Never shared</strong> — we never access, view, sell, or share the content of your files with any third party.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 mt-6">Automatically Collected Data</h3>
            <p>We may automatically collect limited technical information including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website URL</li>
              <li>Anonymous usage statistics</li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> collect personal information such as names, email addresses, or
              payment details, as no registration or payment is required to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. How We Use Information</h2>
            <p>The limited information we collect is used to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process your file conversions</li>
              <li>Improve our tools and user experience</li>
              <li>Monitor service performance and uptime</li>
              <li>Detect and prevent abuse of our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google AdSense</strong> — for displaying advertisements. Google may use cookies to serve ads based on your browsing history. You can opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Ad Settings</a>.</li>
              <li><strong>Vercel</strong> — our hosting provider. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Vercel's Privacy Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
            <p>
              We use minimal cookies for essential functionality (such as theme preference). Third-party
              advertising partners may also set cookies. You can control cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Security</h2>
            <p>
              We implement industry-standard security measures including SSL/TLS encryption for all data
              transfers, automatic file deletion, and secure server infrastructure. However, no method of
              electronic transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please visit our{' '}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
