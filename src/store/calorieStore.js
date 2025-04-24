import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCalorieStore = create(
  persist(
    (set, get) => ({
      meals: [],
      dailyGoal: 2000,
      selectedDate: new Date().toISOString().split('T')[0],
      
      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, { ...meal, id: Date.now(), date: state.selectedDate }],
        })),
        
      removeMeal: (mealId) =>
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== mealId),
        })),
        
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      getTodaysMeals: () => {
        const state = get();
        return state.meals.filter((meal) => meal.date === state.selectedDate);
      },
        
      getTotalCalories: () => {
        const state = get();
        return state.meals
          .filter((meal) => meal.date === state.selectedDate)
          .reduce((sum, meal) => sum + meal.calories, 0);
      },
    }),
    {
      name: 'calorie-storage',
    }
  )
);

export default useCalorieStore; 