import React from "react";
import { Link } from "react-router-dom";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4 md:px-8 animate-fade-in">
      <img src="/logomark.png" alt="AListo Logo" className="w-28 h-auto" />
        <div className="hidden md:flex space-x-10 text-gray-600">
          <Link to= "/Home">
          <button className="text-blue-600 font-semibold">
            Home
          </button>
          </Link>
          <Link to= "/Terms">
          <button className="hover:text-blue-600"> 
            Terms of Service
          </button>
          </Link>
          <Link to= "/#">
          <button className="hover:text-blue-600">
            Privacy Policy
          </button>
          </Link>
        </div>
        <Link to="/register">
        <button className="px-4 py-2 text-sm bg-white border rounded-lg shadow-md">
          Sign up
        </button>
        </Link>
      </nav>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row px-6 py-12 space-y-8 md:space-y-0 animate-fade-in">
        
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
            <h4 className="font-semibold">1.1 Personal Information</h4>
            <p>Account Details: Name, email address, and username (required for registration).</p>
            <p>Profile Information: Profile picture (if uploaded).</p>
            <p>Authentication Data: If you sign in using third-party services (e.g., Google), we collect only the necessary authentication data.</p><br></br>
            <h4 className="font-semibold">1.2 Usage & Task Data</h4>
            <p>Tasks & Notes: Your to-do lists, completed tasks, and scheduled reminders.</p>
          </section>

          <section id="account">
            <h3 className="text-xl font-semibold">2. How We Use Your Information</h3>
            <p>AListō is designed for personal task management. You agree to:</p>
            <ul className="list-disc pl-5">
              <li>Provide and improve AListō’s features.</li>
              <li>Sync tasks across devices.</li>
              <li>Customize your user experience.</li>
              <li>Enhance security and prevent unauthorized access.</li><br></br>
            </ul>
            <p>We do not sell or share your personal data with third parties for advertising purposes.</p>
          </section>

          <section id="use">
            <h3 className="text-xl font-semibold">3. Data Storage & Security</h3>
            <p>We take reasonable measures to protect your data, including:</p>
            <ul className="list-disc pl-5">
              <li>Encryption for sensitive data storage.</li>
              <li>Secure Authentication methods.</li><br></br>
            </ul>
            <p>However, no online service is completely secure. We recommend using a strong password and keeping your account credentials confidential.</p>
          </section>

          <section id="privacy">
            <h3 className="text-xl font-semibold">4. Third-Party Services</h3>
            <p>AListō may integrate with third-party services such as:</p>
            <ul className="list-disc pl-5">
              <li>Google Authentication (for login).</li>
              <li>Cloud Storage Providers (for data backups).</li>
              <li>Analytics Tools (to improve app performance)</li><br />
            </ul>
            <p>These services have their own privacy policies, and we encourage you to review them.</p>
          </section>

          <section id="ownership">
            <h3 className="text-xl font-semibold">5. Your Rights & Control Over Your Data</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5">
                <li>Access & Update your personal information.</li>
                <li>Delete Your Account & Data (this action is permanent and cannot be undone).</li><br />
            </ul>
            <p>If you wish to exercise any of these rights, you can do so in the Settings section of the app.</p>
          </section>

          <section id="termination">
            <h3 className="text-xl font-semibold">6. Data Retention</h3>
            <p>We retain your data only as long as necessary to provide AListō’s services. If you delete your account, your data will be permanently removed from our servers.</p>
          </section>

          <section id="availability">
            <h3 className="text-xl font-semibold">7. Changes to This Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. If significant changes are made, we will notify users through the app. Please review this policy periodically to stay informed.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Privacy;
