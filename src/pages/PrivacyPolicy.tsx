import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4 md:px-8">
      <img src="/logomark.png" alt="AListo Logo" className="w-28 h-auto" />
        <div className="hidden md:flex space-x-6 text-gray-600">
          <a href="home" className="hover:text-blue-600">Home</a>
          <a href="Terms" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="text-blue-600 font-semibold">Privacy Policy</a>
        </div>
        <button className="px-4 py-2 text-sm bg-white border rounded-full shadow-md">
          Sign up
        </button>
      </nav>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row px-6 py-12 space-y-8 md:space-y-0">
        
        {/* Table of Contents */}
        <aside className="md:w-1/4 border-none p-4 bg-transparent rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Table of Contents</h2>
          <ul className="space-y-2 text-sm text-gray-500">
          <p>Introduction</p>
            <li><a href="#acceptance">1. Information We Collect</a></li>
            <li><a href="#account">2. How We Use Your Information</a></li>
            <li><a href="#use">3. Data Storage & Security</a></li>
            <li><a href="#privacy">4. Third-Party Services</a></li>
            <li><a href="#ownership">5. Your Rights & Control Over Your Data</a></li>
            <li><a href="#termination">6. Data Retention</a></li>
            <li><a href="#availability">7. Changes to This Privacy Policy</a></li>
          </ul>
        </aside>

        {/* Terms Content */}
        <main className="md:w-3/4 space-y-6">
          <p>
          Effective Date: March 8, 2025            
          </p>
          <p>  
          Welcome to AListō! Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our app.
          </p>
          <p>
          By accessing or using AListō, you agree to the terms outlined in this policy.
          </p>
          <section id="acceptance">
            <h3 className="text-xl font-semibold">1. Information We Collect</h3>
            <p>By creating an account, accessing, or using AListō, you agree to be bound by these Terms. If you do not agree, please do not use the app.</p>
          </section>

          <section id="account">
            <h3 className="text-xl font-semibold">2. How We Use Your Information</h3>
            <ul className="list-disc pl-5">
              <li>You must be at least 13 years old to use AListö.</li>
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
              <li>You agree not to share your login credentials or allow others to access your account.</li>
            </ul>
          </section>

          <section id="use">
            <h3 className="text-xl font-semibold">3. Data Storage & Security</h3>
            <p>AListö is designed for personal task management. You agree to:</p>
            <ul className="list-disc pl-5">
              <li>Use the app lawfully and ethically.</li>
              <li>Provide accurate and up-to-date information.</li>
              <li>Respect other users and avoid abusive, spammy, or harmful behavior.</li>
            </ul>
            <br />
            <p>You must not:</p>
            <ul className="list-disc pl-5">
                <li>Use AListō for illegal or unauthorized purposes.</li>
                <li>Attempt to hack, reverse-engineer, or disrupt the platform.</li>
                <li>Upload or share harmful, offensive, or misleading content.</li>
            </ul>
          </section>

          <section id="privacy">
            <h3 className="text-xl font-semibold">4. Third-Party Services</h3>
            <p>We value your privacy. Your use of AListö is governed by our Privacy Policy, which explains how we collect, use, and protect your data.</p>
          </section>

          <section id="ownership">
            <h3 className="text-xl font-semibold">5. Your Rights & Control Over Your Data</h3>
            <ul className="list-disc pl-5">
                <li>You retain ownership of any tasks or notes you create within AListö.</li>
                <li>By using AListō, you grant us permission to store and process your content to improve app functionality.</li>
                <li>We do not sell or share your personal data with third parties.</li>
            </ul>
          </section>

          <section id="termination">
            <h3 className="text-xl font-semibold">6. Data Retention</h3>
            <p>We reserve the right to suspend or terminate your account if you:</p>
            <ul className="list-disc pl-5">
              <li>Violate these Terms.</li>
              <li>Engage in fraudulent or harmful activity.</li>
              <li>Attempt to disrupt or misuse the app.</li>
            </ul>
            <p>You may also delete your account at any time. Keep in mind that this action is permanent and cannot be undone.</p>
          </section>

          <section id="availability">
            <h3 className="text-xl font-semibold">7. Changes to This Privacy Policy</h3>
            <ul className="list-disc pl-5">
              <li>AListō strives for maximum uptime, but we do not guarantee that the app will always be available.</li>
              <li>We may update, modify, or discontinue features without prior notice.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Privacy;
