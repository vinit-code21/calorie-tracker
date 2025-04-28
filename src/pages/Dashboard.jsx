import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCalorieStore from '../store/calorieStore';
import { searchFood, getCategorySuggestions } from '../services/calorieApi';
import { useAuth } from '../context/AuthContext';
import SetDailyGoalModal from '../components/SetDailyGoalModal';
import PortionModal from '../components/PortionModal';
import LogoutModal from '../components/LogoutModal';
import { 
  ChartBarIcon, 
  HomeIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';

const foodCategories = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Fruits',
  'Vegetables',
  'Proteins',
  'Other'
];

const Dashboard = () => {
  const { 
    dailyGoal,
    selectedDate,
    addMeal,
    removeMeal,
    setSelectedDate,
    getTodaysMeals,
    getTotalCalories
  } = useCalorieStore();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Show goal modal on first load if no goal is set
  useEffect(() => {
    if (dailyGoal === null) {
      setIsGoalModalOpen(true);
    }
  }, [dailyGoal]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch food data when debounced search term changes
  useEffect(() => {
    const fetchFoodData = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchFood(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching food data:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodData();
  }, [debouncedSearchTerm]);

  const handleDateChange = (offset) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search when changing category
    setSearchResults([]); // Clear previous search results

    if (category !== 'All') {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await getCategorySuggestions(category);
        setCategorySuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching category suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setCategorySuggestions([]);
    }
  };

  const handleAddMeal = (food) => {
    setSelectedFood(food);
    setIsPortionModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredFoods = searchResults.filter((food) => 
    selectedCategory === 'All' || food.category === selectedCategory
  );

  const todaysMeals = getTodaysMeals();
  const totalCalories = getTotalCalories();
  const remainingCalories = dailyGoal - totalCalories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                <HomeIcon className="h-6 w-6" />
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-blue-600">Dashboard</h1>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.displayName || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.style.display = 'none';
                      // Show fallback avatar
                      const fallback = document.createElement('div');
                      fallback.className = 'h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center';
                      fallback.innerHTML = `<span class="text-white text-sm font-medium">${user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}</span>`;
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700">{user?.displayName || user?.email}</div>
                  {user?.displayName && <div className="text-xs text-gray-500">{user?.email}</div>}
                </div>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="text-gray-500 hover:text-gray-700"
                title="Set Daily Goal"
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogoutClick}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <button
              onClick={() => handleDateChange(1)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calorie Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">Daily Goal</h3>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {dailyGoal ? `${dailyGoal} cal` : 'Not set'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Consumed</h3>
              <p className="text-2xl font-bold text-green-600">{totalCalories} cal</p>
            </div>
            <div className={`p-4 rounded-lg ${remainingCalories >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
              <h3 className="text-lg font-semibold text-gray-700">Remaining</h3>
              <p className={`text-2xl font-bold ${remainingCalories >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {dailyGoal ? `${remainingCalories} cal` : 'Set a goal'}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          {dailyGoal && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    totalCalories > dailyGoal ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((totalCalories / dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Food Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Add Food</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search foods (e.g., '100g chicken breast' or '1 apple')"
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              {isLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {foodCategories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Results or Category Suggestions */}
            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
              {isLoading || isLoadingSuggestions ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : searchTerm.trim().length < 2 ? (
                categorySuggestions.length > 0 ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested {selectedCategory} Items:</h3>
                    {categorySuggestions.map((food) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div>
                          <h3 className="font-medium capitalize">{food.name}</h3>
                          <p className="text-sm text-gray-600">{food.serving}</p>
                          <div className="text-sm text-gray-500">
                            <span>{Math.round(food.calories)} cal</span>
                            <span className="mx-2">•</span>
                            <span>P: {Math.round(food.protein)}g</span>
                            <span className="mx-2">•</span>
                            <span>C: {Math.round(food.carbs)}g</span>
                            <span className="mx-2">•</span>
                            <span>F: {Math.round(food.fat)}g</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddMeal(food)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {selectedCategory === 'All' 
                      ? 'Start typing to search for foods (minimum 2 characters)'
                      : `No suggestions available for ${selectedCategory}`}
                  </p>
                )
              ) : filteredFoods.length === 0 && !isLoading ? (
                <p className="text-gray-500 text-center py-4">
                  No foods found. Try a different search term.
                </p>
              ) : (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <h3 className="font-medium capitalize">{food.name}</h3>
                      <p className="text-sm text-gray-600">{food.serving}</p>
                      <div className="text-sm text-gray-500">
                        <span>{Math.round(food.calories)} cal</span>
                        <span className="mx-2">•</span>
                        <span>P: {Math.round(food.protein)}g</span>
                        <span className="mx-2">•</span>
                        <span>C: {Math.round(food.carbs)}g</span>
                        <span className="mx-2">•</span>
                        <span>F: {Math.round(food.fat)}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddMeal(food)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Meals */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Today's Meals</h2>
              <span className="text-sm text-gray-600">
                {todaysMeals.length} {todaysMeals.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-3">
              {todaysMeals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meals added yet today</p>
              ) : (
                todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium capitalize">{meal.name}</h3>
                      <p className="text-sm text-gray-600">{meal.serving}</p>
                      <div className="text-sm text-gray-500">
                        <span>{Math.round(meal.calories)} cal</span>
                        <span className="mx-2">•</span>
                        <span>P: {Math.round(meal.protein)}g</span>
                        <span className="mx-2">•</span>
                        <span>C: {Math.round(meal.carbs)}g</span>
                        <span className="mx-2">•</span>
                        <span>F: {Math.round(meal.fat)}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMeal(meal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <SetDailyGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
      
      <PortionModal
        isOpen={isPortionModalOpen}
        onClose={() => {
          setIsPortionModalOpen(false);
          setSelectedFood(null);
        }}
        food={selectedFood}
        onAdd={addMeal}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogoutConfirm}
        userName={user}
      />
    </div>
  );
};

export default Dashboard; 