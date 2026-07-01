import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from '../components/Toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been sent! We will get back to you shortly.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-sans text-slate-900 dark:text-white mb-4">
            Contact <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Have questions or feedback? Fill out the form or reach out to our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info panel */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Email Us</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">support@careerconnect.ai</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Call Us</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">+1 (555) 019-2834</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Our HQ</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Silicon Valley, CA, USA</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
