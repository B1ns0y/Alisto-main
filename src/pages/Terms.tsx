import React from "react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4 md:px-8">
      <img src="/logomark.png" alt="AListo Logo" className="w-28 h-auto" />
        <div className="hidden md:flex space-x-6 text-gray-500">
          <a href="home" className="hover:text-blue-600">Home</a>
          <a href="#" className="text-blue-600 font-semibold">Terms of Service</a>
          <a href="Privacy" className="hover:text-blue-600">Privacy Policy</a>
        </div>
        <Link to="/register">
        <button className="px-4 py-2 text-sm bg-white border rounded-full shadow-md">
          Sign up
        </button>
        </Link>
      </nav>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row px-6 py-12 space-y-8 md:space-y-0">
        
        {/* Table of Contents */}
        <aside className="md:w-1/4 border-none p-4 bg-transparent rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Table of Contents</h2>
          <ul className="space-y-2 text-sm text-gray-600">
          <p>Introduction</p>
            <li><a href="#acceptance">1. Acceptance of Terms</a></li>
            <li><a href="#account">2. Account Registration & Security</a></li>
            <li><a href="#use">3. Use of AListö</a></li>
            <li><a href="#privacy">4. Privacy & Data Protection</a></li>
            <li><a href="#ownership">5. Task & Content Ownership</a></li>
            <li><a href="#termination">6. Account Termination</a></li>
            <li><a href="#availability">7. Service Availability & Updates</a></li>
            <li><a href="#liability">8. Limitation of Liability</a></li>
            <li><a href="#changes">9. Changes to These Terms</a></li>
            <li><a href="#changes">10. Account Termination</a></li>
            <li><a href="#changes">11. Service Availability & Updates</a></li>
          </ul>
        </aside>

        {/* Terms Content */}
        <main className="md:w-3/4 space-y-6">
          <p>
          Welcome to AListō! We're excited to have you on board. These Terms of Service ("Terms") outline the rules and guidelines for using AListō, our productivity and task management app. By accessing or using AListō, you agree to follow these Terms.
            </p>
          <p>  
            We aim to provide a seamless and efficient way to organize your tasks, but to ensure a smooth experience for everyone, we ask that you use the app responsibly. If you do not agree with these Terms, please refrain from using AListō.
          </p>

          <section id="acceptance">
            <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
            <p>By creating an account, accessing, or using AListō, you agree to be bound by these Terms. If you do not agree, please do not use the app.</p>
          </section>

          <section id="account">
            <h3 className="text-xl font-semibold">2. Account Registration & Security</h3>
            <ul className="list-disc pl-5">
              <li>You must be at least 13 years old to use AListö.</li>
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
              <li>You agree not to share your login credentials or allow others to access your account.</li>
            </ul>
          </section>

          <section id="use">
            <h3 className="text-xl font-semibold">3. Use of AListö</h3>
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
            <h3 className="text-xl font-semibold">4. Privacy & Data Protection</h3>
            <p>We value your privacy. Your use of AListö is governed by our Privacy Policy, which explains how we collect, use, and protect your data.</p>
          </section>

          <section id="ownership">
            <h3 className="text-xl font-semibold">5. Task & Content Ownership</h3>
            <ul className="list-disc pl-5">
                <li>You retain ownership of any tasks or notes you create within AListö.</li>
                <li>By using AListō, you grant us permission to store and process your content to improve app functionality.</li>
                <li>We do not sell or share your personal data with third parties.</li>
            </ul>
          </section>

          <section id="termination">
            <h3 className="text-xl font-semibold">6. Account Termination</h3>
            <p>We reserve the right to suspend or terminate your account if you:</p>
            <ul className="list-disc pl-5">
              <li>Violate these Terms.</li>
              <li>Engage in fraudulent or harmful activity.</li>
              <li>Attempt to disrupt or misuse the app.</li>
            </ul>
            <p>You may also delete your account at any time. Keep in mind that this action is permanent and cannot be undone.</p>
          </section>

          <section id="availability">
            <h3 className="text-xl font-semibold">7. Service Availability & Updates</h3>
            <ul className="list-disc pl-5">
              <li>AListō strives for maximum uptime, but we do not guarantee that the app will always be available.</li>
              <li>We may update, modify, or discontinue features without prior notice.</li>
            </ul>
          </section>

          <section id="liability">
            <h3 className="text-xl font-semibold">8. Limitation of Liability</h3>
            <p>AListō is provided "as is" without warranties of any kind. We are not responsible for:</p>
            <ul className="list-disc pl-5">
              <li>Any loss of tasks or data due to technical issues.</li>
              <li>Any damages or losses resulting from the use of AListō.</li>
            </ul>
          </section>

          <section id="changes">
            <h3 className="text-xl font-semibold">9. Changes to These Terms</h3>
            <p>We may update these Terms from time to time. We will notify users of major changes, but it is your responsibility to review them periodically.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Terms;
