import React from 'react';
import { ShieldCheck, Compass, Users, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-sans text-slate-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">CareerConnect AI</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are redefining the job matching experience by introducing AI-driven efficiency to bridge the gap between world-class companies and exceptional professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
              <Compass size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              To empower job seekers with instant matching opportunities and provide employers with the ultimate workspace to post jobs, manage applications, and discover candidate profiles with maximum transparency.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Transparency & Security</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              We leverage secure JWT credentials, clean role-based dashboards, and protected routes to ensure all application data and company information remain highly secure.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50/50 dark:from-slate-800/40 dark:to-slate-900/40 border border-primary-100 dark:border-slate-800">
          <Sparkles className="mx-auto mb-4 text-primary-500" size={32} />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Join a Global Talent Network</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Whether you are looking to hire a senior software architect, or take the next step in your developer career, CareerConnect AI offers a seamless workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
