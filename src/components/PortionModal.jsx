import React, { useState } from 'react';

const PortionModal = ({ isOpen, onClose, food, onAdd }) => {
  const [portion, setPortion] = useState(100);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isNaN(portion) || portion <= 0) {
      setError('Please enter a valid portion size greater than 0');
      return;
    }

    // Calculate adjusted nutritional values based on portion
    const ratio = portion / 100; // since base values are per 100g
    const adjustedFood = {
      ...food,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      serving: `${portion}g`
    };

    onAdd(adjustedFood);
    setPortion(100);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Portion Size</h2>
          <p className="text-gray-600 capitalize">{food?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="portion" className="block text-sm font-medium text-gray-700 mb-1">
              Portion Size (grams)
            </label>
            <input
              type="number"
              id="portion"
              value={portion}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="1"
              step="any"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Preview nutritional values */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Nutritional Values (estimated):</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(food?.calories * (portion / 100))} cal
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(food?.protein * (portion / 100) * 10) / 10}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(food?.carbs * (portion / 100) * 10) / 10}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(food?.fat * (portion / 100) * 10) / 10}g
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Meals
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortionModal; 