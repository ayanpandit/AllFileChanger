import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, open mailto link as a fallback
    const mailtoLink = `mailto:support@allfilechanger.shop?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.open(mailtoLink, '_blank');
    setSubmitted(true);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact AllFileChanger",
    "url": "https://www.allfilechanger.shop/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "AllFileChanger",
      "url": "https://www.allfilechanger.shop",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "availableLanguage": "English"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <SEO
        title="Contact Us"
        description="Get in touch with AllFileChanger. Have questions, feedback, or need support with our free online file conversion tools? We're here to help."
        keywords="contact allfilechanger, support, feedback, file converter help"
        schema={contactSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question, feedback, or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Other Ways to Reach Us</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@allfilechanger.shop</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Response Time</h3>
                    <p className="text-gray-600 dark:text-gray-400">We typically respond within 24-48 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked</h2>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Is AllFileChanger really free?</strong><br />
                  Yes! All our tools are 100% free with no hidden costs or subscriptions.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Are my files secure?</strong><br />
                  Absolutely. Files are processed in memory and auto-deleted within 1 hour.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Do I need to create an account?</strong><br />
                  No registration required. Just upload and convert.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-900 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔗 Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                <Link to="/terms" className="block text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                <Link to="/about" className="block text-blue-600 dark:text-blue-400 hover:underline">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
