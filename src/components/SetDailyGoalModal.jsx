import React, { useState } from 'react';
import useCalorieStore from '../store/calorieStore';

const SetDailyGoalModal = ({ isOpen, onClose }) => {
  const { setDailyGoal } = useCalorieStore();
  const [goalInput, setGoalInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const goal = parseInt(goalInput);
    
    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }

    setDailyGoal(goal);
    setGoalInput('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Daily Calorie Goal</h2>
          <p className="text-gray-600">Enter your target daily calorie intake</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Calories
            </label>
            <input
              type="number"
              id="calories"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Enter your daily calorie goal"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="1"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetDailyGoalModal; 