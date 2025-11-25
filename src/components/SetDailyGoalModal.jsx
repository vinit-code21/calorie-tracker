import React, { useState } from "react";
import useCalorieStore from "../store/calorieStore";

const SetDailyGoalModal = ({ isOpen, onClose }) => {
  const { setDailyGoal } = useCalorieStore();
  const [goalInput, setGoalInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const goal = parseInt(goalInput);

    if (isNaN(goal) || goal <= 0) {
      setError("Please enter a valid number greater than 0");
      return;
    }

    setDailyGoal(goal);
    setGoalInput("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-[#0d1117]/90 backdrop-blur-xl p-8 max-w-md w-full mx-4 rounded-2xl shadow-[0_0_60px_rgba(0,195,255,0.15)] border border-white/10 animate-fadeIn">

        {/* Floating Badge */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_25px_rgba(0,195,255,0.8)] flex items-center justify-center border border-white/20">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m4-4a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-center mt-10 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Set Daily Calorie Goal
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your target calorie intake for today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Daily Calories
            </label>

            <input
              type="number"
              id="calories"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g., 2200"
              className="w-full p-3 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              min="1"
            />

            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(0,195,255,0.35)] transition"
          >
            Set Goal
          </button>
        </form>

        {/* Bottom Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            You can change this anytime from your dashboard settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetDailyGoalModal;
