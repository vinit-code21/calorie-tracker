const API_KEY = 'ejBKJGfD718IGeHgXVV5xQ==avuTvWD0kJuRzNWk';
const BASE_URL = 'https://api.calorieninjas.com/v1/nutrition';

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