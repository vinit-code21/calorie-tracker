import React, { useState } from "react";

const PortionModal = ({ isOpen, onClose, food, onAdd }) => {
  const [portion, setPortion] = useState(100);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(portion) || portion <= 0) {
      setError("Please enter a valid portion size greater than 0");
      return;
    }

    const ratio = portion / 100;

    const adjustedFood = {
      ...food,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      serving: `${portion}g`,
    };

    onAdd(adjustedFood);
    setPortion(100);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50">
      <div
        className="relative max-w-md w-full mx-4 p-8 rounded-2xl
      backdrop-blur-2xl bg-white/10 border border-white/20 
      shadow-[0_0_25px_rgba(255,255,255,0.15)] animate-fadeIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white
          transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-7 h-7"
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

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide mb-1">
            Set Portion Size
          </h2>
          <p className="text-gray-300 capitalize text-sm">{food?.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input */}
          <div>
            <label
              htmlFor="portion"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Portion Size (grams)
            </label>
            <input
              type="number"
              id="portion"
              value={portion}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              className="w-full p-3 rounded-xl bg-white/10 text-white 
              border border-white/20 outline-none backdrop-blur-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              placeholder-gray-400"
              min="1"
              step="any"
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          </div>

          {/* Nutrition Preview */}
          <div
            className="p-5 rounded-xl bg-white/10 border border-white/10 
          backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Nutritional Values (estimated):
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Calories */}
              <div>
                <p className="text-xs text-gray-400">Calories</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(food?.calories * (portion / 100))} cal
                </p>
              </div>

              {/* Protein */}
              <div>
                <p className="text-xs text-gray-400">Protein</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(food?.protein * (portion / 100) * 10) / 10}g
                </p>
              </div>

              {/* Carbs */}
              <div>
                <p className="text-xs text-gray-400">Carbs</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(food?.carbs * (portion / 100) * 10) / 10}g
                </p>
              </div>

              {/* Fat */}
              <div>
                <p className="text-xs text-gray-400">Fat</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(food?.fat * (portion / 100) * 10) / 10}g
                </p>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white text-lg font-semibold
          bg-gradient-to-r from-green-500 to-green-600
          hover:from-green-600 hover:to-green-700
          shadow-[0_0_20px_rgba(0,255,0,0.3)]
          transition-all duration-300"
          >
            Add to Meals
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortionModal;
