import { Link } from 'react-router-dom';
import { Briefcase, Globe, Mail, MessageSquare } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 dark:bg-black text-slate-300 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">CareerConnect <span className="text-secondary-500">AI</span></span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The modern job board connecting talented professionals with world-class employers.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-primary-600 text-slate-400 hover:text-white transition-colors"><MessageSquare size={16} /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-primary-600 text-slate-400 hover:text-white transition-colors"><Globe size={16} /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-primary-600 text-slate-400 hover:text-white transition-colors"><Mail size={16} /></a>
          </div>
        </div>

        {/* For Job Seekers */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            {[['Find Jobs', '/jobs'], ['Saved Jobs', '/saved-jobs'], ['Applied Jobs', '/applications'], ['Build Profile', '/profile']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* For Employers */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Employers</h4>
          <ul className="space-y-2 text-sm">
            {[['Post a Job', '/employer/create-job'], ['Manage Jobs', '/employer/jobs'], ['View Applicants', '/employer/applicants'], ['Company Profile', '/employer/profile']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            {[['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '#'], ['Terms of Service', '#']].map(([label, to]) => (
              <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
        © 2026 CareerConnect AI. All rights reserved. Built with ❤️ by developers, for developers.
      </div>
    </div>
  </footer>
);

export default Footer;
