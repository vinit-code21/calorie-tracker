const API_KEY = 'ejBKJGfD718IGeHgXVV5xQ==avuTvWD0kJuRzNWk';
const BASE_URL = 'https://api.calorieninjas.com/v1/nutrition';

// Category-specific search terms
const categorySearchTerms = {
  Breakfast: '1 bowl oatmeal, 2 eggs, 1 toast',
  Lunch: '1 chicken sandwich, 1 bowl rice',
  Dinner: '1 salmon fillet, 1 potato',
  Snacks: '1 apple, handful almonds',
  Fruits: '1 banana, 1 orange, 1 apple',
  Vegetables: '1 cup broccoli, 1 carrot, spinach',
  Proteins: '100g chicken breast, 100g salmon',
  Other: '1 pizza slice, 1 burger'
};

export const searchFood = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    return data.items.map(item => ({
      id: Date.now() + Math.random(), // Generate a unique ID
      name: item.name,
      calories: item.calories,
      serving: `${item.serving_size_g}g`,
      protein: item.protein_g,
      carbs: item.carbohydrates_total_g,
      fat: item.fat_total_g,
      category: 'Other' // Default category since API doesn't provide categories
    }));
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return [];
  }
};

export const getCategorySuggestions = async (category) => {
  if (!category || category === 'All') return [];
  
  try {
    const searchTerm = categorySearchTerms[category] || '';
    if (!searchTerm) return [];

    const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(searchTerm)}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category suggestions');
    }

    const data = await response.json();
    return data.items.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      calories: item.calories,
      serving: `${item.serving_size_g}g`,
      protein: item.protein_g,
      carbs: item.carbohydrates_total_g,
      fat: item.fat_total_g,
      category
    }));
  } catch (error) {
    console.error('Error fetching category suggestions:', error);
    return [];
  }
}; 