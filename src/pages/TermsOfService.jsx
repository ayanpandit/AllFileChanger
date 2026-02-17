import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <SEO
        title="Terms of Service"
        description="AllFileChanger Terms of Service. Read the terms and conditions for using our free online file conversion tools."
        keywords="terms of service, terms and conditions, allfilechanger terms, usage policy"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: February 17, 2026</p>

        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AllFileChanger (www.allfilechanger.shop), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p>
              AllFileChanger provides free online file conversion, compression, and editing tools. Our services
              include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Image format conversion (JPG, PNG, WebP, etc.)</li>
              <li>Image compression and resizing</li>
              <li>PDF creation, merging, splitting, and conversion</li>
              <li>Document format conversion (Word, Excel, PowerPoint)</li>
              <li>OCR text extraction</li>
              <li>Image editing tools (crop, rotate, watermark, background removal)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
            <p>When using our services, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Only upload files that you have the legal right to convert or modify.</li>
              <li>Not use our services for any illegal or unauthorized purpose.</li>
              <li>Not attempt to overload, disrupt, or interfere with our servers or services.</li>
              <li>Not upload files containing malware, viruses, or malicious code.</li>
              <li>Not use automated tools to scrape or bulk-download from our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
            <p>
              You retain all ownership rights to the files you upload. AllFileChanger does not claim any
              ownership over your content. We do not view, share, or sell your files.
            </p>
            <p className="mt-4">
              The AllFileChanger website, logo, design, and code are the intellectual property of AllFileChanger
              and may not be copied or reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. File Handling & Privacy</h2>
            <p>
              Uploaded files are processed in memory and automatically deleted within 1 hour. We do not
              store, analyze, or share your files. For more details, see our{' '}
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" without warranties of any kind, express or implied. We do not
              guarantee that conversions will be error-free or that the service will be uninterrupted. While we
              strive for accuracy, complex documents may not convert with 100% formatting preservation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p>
              AllFileChanger shall not be liable for any indirect, incidental, or consequential damages arising
              from your use of the service, including but not limited to data loss, business interruption, or
              conversion errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Service Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our services at any time
              without prior notice. We may also update these terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes
              shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact</h2>
            <p>
              For questions about these Terms, please visit our{' '}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
