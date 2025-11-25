import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCalorieStore from "../store/calorieStore";
import { searchFood, getCategorySuggestions } from "../services/calorieApi";
import { useAuth } from "../context/AuthContext";
import SetDailyGoalModal from "../components/SetDailyGoalModal";
import PortionModal from "../components/PortionModal";
import LogoutModal from "../components/LogoutModal";
import Chatbot from "../components/Chatbot";
import {
  ChartBarIcon,
  HomeIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

/**
 * Dashboard.jsx
 * - Glassmorphism + neon accent dark theme
 * - Keeps your logic, only UI/classNames changed
 * - Tailwind required (no extra libs)
 */

const foodCategories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Fruits",
  "Vegetables",
  "Proteins",
  "Other",
];

const Dashboard = () => {
  const {
    dailyGoal,
    selectedDate,
    addMeal,
    removeMeal,
    setSelectedDate,
    getTodaysMeals,
    getTotalCalories,
  } = useCalorieStore();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (dailyGoal === null) {
      setIsGoalModalOpen(true);
    }
  }, [dailyGoal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        console.error("Error fetching food data:", error);
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
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setSearchResults([]);
    if (category !== "All") {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await getCategorySuggestions(category);
        setCategorySuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching category suggestions:", error);
        setCategorySuggestions([]);
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
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredFoods = searchResults.filter(
    (food) => selectedCategory === "All" || food.category === selectedCategory
  );

  const todaysMeals = getTodaysMeals();
  const totalCalories = getTotalCalories();
  const remainingCalories = dailyGoal ? dailyGoal - totalCalories : 0;
  const progressPercent = dailyGoal ? Math.min((totalCalories / dailyGoal) * 100, 100) : 0;

  /* ---------- UI ---------- */
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white antialiased">
      {/* Top Nav */}
      <nav className="shrink-0 backdrop-blur-md bg-black/30 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-[0_6px_30px_rgba(10,200,200,0.08)]">
                <HomeIcon className="h-5 w-5 text-black" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">Dashboard</h1>
            </Link>
            <span className="hidden md:inline-block text-sm text-gray-300">Welcome back{user?.displayName ? `, ${user.displayName}` : ""}.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="p-2 rounded-lg hover:bg-white/6 transition"
              title="Set Daily Goal"
            >
              <Cog6ToothIcon className="h-6 w-6 text-gray-300" />
            </button>

            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName || "User"}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-black font-semibold">
                  {user?.displayName?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-gray-200">{user?.displayName || user?.email}</span>
                {user?.displayName && <span className="text-xs text-gray-400">{user?.email}</span>}
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              className="px-3 py-1 rounded-md bg-red-600/90 hover:bg-red-600/100 text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden max-w-7xl mx-auto px-6 py-4 w-full">
        <div className="shrink-0 space-y-4 mb-4">
          {/* Date selector */}
          <section>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-md flex items-center justify-between">
              <button
                onClick={() => handleDateChange(-1)}
                className="p-2 rounded-md hover:bg-white/6 transition"
                aria-label="Previous day"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-200" />
              </button>

              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                <p className="text-xs text-gray-400">Your daily intake overview</p>
              </div>

              <button
                onClick={() => handleDateChange(1)}
                className="p-2 rounded-md hover:bg-white/6 transition"
                aria-label="Next day"
              >
                <ArrowRightIcon className="h-5 w-5 text-gray-200" />
              </button>
            </div>
          </section>

          {/* Summary */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/4 to-white/3 border border-white/6 backdrop-blur-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-gray-300">Daily Goal</h3>
                    <p className="mt-2 text-2xl font-bold text-teal-300">{dailyGoal ? `${dailyGoal} cal` : "Not set"}</p>
                  </div>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="p-2 rounded-md hover:bg-white/6 transition"
                    title="Edit goal"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/4 to-white/3 border border-white/6 backdrop-blur-lg">
                <h3 className="text-sm text-gray-300">Consumed</h3>
                <p className="mt-2 text-2xl font-bold text-green-300">{totalCalories} cal</p>
              </div>

              <div className={`p-4 rounded-2xl border border-white/6 backdrop-blur-lg ${remainingCalories >= 0 ? "bg-white/3" : "bg-red-900/20"}`}>
                <h3 className="text-sm text-gray-300">Remaining</h3>
                <p className={`mt-2 text-2xl font-bold ${remainingCalories >= 0 ? "text-purple-300" : "text-red-400"}`}>
                  {dailyGoal ? `${remainingCalories} cal` : "Set a goal"}
                </p>
              </div>
            </div>

            {/* progress bar */}
            {dailyGoal && (
              <div className="mt-4 p-3 rounded-2xl bg-white/3 border border-white/6">
                <div className="text-xs text-gray-300 mb-2">Daily progress</div>
                <div className="w-full h-3 rounded-full bg-white/6 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${totalCalories > dailyGoal ? "bg-red-500" : "bg-teal-400"} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>{Math.round(progressPercent)}%</span>
                  <span>{totalCalories}/{dailyGoal} cal</span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Grid: Add Food + Today's Meals */}
        <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
          {/* Add Food Column */}
          <div className="flex flex-col h-full p-6 rounded-2xl bg-white/4 border border-white/6 backdrop-blur-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold shrink-0">Add Food</h2>
              <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto">
                <div className="text-sm text-gray-400 hidden lg:block shrink-0">Category:</div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                  {foodCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${selectedCategory === category ? "bg-gradient-to-r from-teal-400 to-blue-500 text-black shadow-lg shadow-teal-500/20" : "bg-white/6 text-gray-200 hover:bg-white/10"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search box */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search foods — e.g. '100g chicken' or '1 apple'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/6 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              {isLoading && <div className="absolute right-3 top-3 animate-spin rounded-full h-5 w-5 border-t-2 border-white/30"></div>}
            </div>

            {/* Results / Suggestions */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {isLoading || isLoadingSuggestions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/30"></div>
                </div>
              ) : searchTerm.trim().length < 2 ? (
                categorySuggestions.length > 0 ? (
                  <>
                    <h3 className="text-sm text-gray-300 mb-2">Suggested {selectedCategory}</h3>
                    {categorySuggestions.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-3 bg-white/4 rounded-xl border border-white/6">
                        <div>
                          <div className="font-medium capitalize">{food.name}</div>
                          <div className="text-xs text-gray-400">{food.serving}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span>{Math.round(food.calories)} cal</span>
                            <span className="mx-2">•</span>
                            <span>P: {Math.round(food.protein)}g</span>
                            <span className="mx-2">•</span>
                            <span>C: {Math.round(food.carbs)}g</span>
                          </div>
                        </div>
                        <button onClick={() => handleAddMeal(food)} className="p-2 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 hover:scale-105 transition">
                          <PlusIcon className="h-5 w-5 text-black" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    {selectedCategory === "All" ? "Start typing to search (min 2 chars)" : `No suggestions for ${selectedCategory}`}
                  </p>
                )
              ) : filteredFoods.length === 0 && !isLoading ? (
                <p className="text-center text-gray-400 py-8">No foods found. Try a different search.</p>
              ) : (
                filteredFoods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-3 bg-white/4 rounded-xl border border-white/6">
                    <div>
                      <div className="font-medium capitalize">{food.name}</div>
                      <div className="text-xs text-gray-400">{food.serving}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span>{Math.round(food.calories)} cal</span>
                        <span className="mx-2">•</span>
                        <span>P: {Math.round(food.protein)}g</span>
                        <span className="mx-2">•</span>
                        <span>C: {Math.round(food.carbs)}g</span>
                      </div>
                    </div>
                    <button onClick={() => handleAddMeal(food)} className="p-2 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 hover:scale-105 transition">
                      <PlusIcon className="h-5 w-5 text-black" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Meals Column */}
          <div className="flex flex-col h-full p-6 rounded-2xl bg-white/4 border border-white/6 backdrop-blur-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Today's Meals</h2>
                <p className="text-xs text-gray-400">{todaysMeals.length} {todaysMeals.length === 1 ? "item" : "items"}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ChartBarIcon className="h-5 w-5 text-gray-300" />
                Summary
              </div>
            </div>

            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {todaysMeals.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No meals yet — add your first meal.</p>
              ) : (
                todaysMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-white/4 rounded-xl border border-white/6">
                    <div>
                      <div className="font-medium capitalize">{meal.name}</div>
                      <div className="text-xs text-gray-400">{meal.serving}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span>{Math.round(meal.calories)} cal</span>
                        <span className="mx-2">•</span>
                        <span>P: {Math.round(meal.protein)}g</span>
                        <span className="mx-2">•</span>
                        <span>C: {Math.round(meal.carbs)}g</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeMeal(meal.id)} className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 transition">
                        <TrashIcon className="h-5 w-5 text-black" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <SetDailyGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />

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

      <Chatbot />
    </div>
  );
};

export default Dashboard;
