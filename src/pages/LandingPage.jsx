"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="relative bg-neutral-900/80 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full shadow-[0_0_25px_rgba(0,0,0,0.6)] mx-4">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          ✕
        </button>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">
            Sign in to continue tracking your calories
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-lg hover:bg-white/20 transition-all duration-300"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="g-logo"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="relative bg-neutral-900/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_25px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition text-2xl"
        >
          ✕
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text mb-3">
              Track Your Fitness Journey
            </h2>
            <p className="text-gray-400 text-lg">
              Your personal companion for a healthier lifestyle
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <p className="text-base leading-relaxed">
              <span className="text-teal-400 font-semibold">CalorieTrack</span> is more than just a calorie counter — it's your complete fitness companion designed to help you achieve your health goals with ease and precision.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">🎯 What We Offer</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span><strong>Smart Food Tracking:</strong> Log meals instantly with our AI-powered search and suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span><strong>Personalized Goals:</strong> Set custom daily calorie targets based on your fitness objectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span><strong>AI Assistant:</strong> Get instant nutrition advice and meal suggestions from our Gemini-powered chatbot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span><strong>Progress Tracking:</strong> Visualize your daily intake with beautiful charts and progress bars</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">•</span>
                  <span><strong>Detailed Nutrition:</strong> Track calories, protein, carbs, and more for every meal</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-teal-900/30 to-blue-900/30 border border-teal-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">💪 Your Journey Starts Here</h3>
              <p className="text-sm leading-relaxed">
                Whether you're looking to lose weight, gain muscle, or simply maintain a balanced diet, CalorieTrack provides the tools and insights you need to stay consistent and motivated. Track your progress day by day, celebrate your wins, and transform your relationship with food.
              </p>
            </div>

            <p className="text-center text-sm text-gray-400 italic">
              Join thousands of users who are already transforming their lives, one meal at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-neutral-950 text-white">

      {/* Navigation */}
      <nav className="backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            CalorieTrack
          </h1>

          <div className="flex space-x-6">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="text-gray-300 hover:text-white transition"
            >
              About
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:opacity-90 transition"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Track Your Calories,
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            Achieve Your Goals
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          A modern, AI-powered calorie tracker to help you stay consistent
          and achieve your fitness journey effortlessly.
        </p>

        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-10 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        >
          Start Tracking Free
        </button>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/30 backdrop-blur-xl border-t border-white/10">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Feature Card */}
          {[
            {
              title: "Easy Tracking",
              desc: "Log your meals instantly with smart AI suggestions."
            },
            {
              title: "Advanced Analytics",
              desc: "See detailed calorie breakdowns and weekly insights."
            },
            {
              title: "Goal Focused",
              desc: "Personalized plans and reminders to keep you on track."
            }
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition"
            >
              <h3 className="text-2xl font-semibold mb-3 text-teal-400">
                {f.title}
              </h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center bg-gradient-to-r from-teal-600 to-blue-700">
        <h2 className="text-4xl font-bold mb-2">Ready to Transform?</h2>
        <p className="text-gray-100 text-lg mb-6">
          Join thousands achieving their goals.
        </p>

        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-10 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition shadow-lg"
        >
          Get Started Now
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 CalorieTrack — All Rights Reserved
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
