const API_KEY = "AIzaSyBCXemYS3E9X6e_CuBsNfh5fK6o11_oFXE";

async function listModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        const data = await response.json();
        if (data.models) {
            const geminiModels = data.models.filter(m => m.name.includes('gemini'));
            geminiModels.forEach(m => console.log(m.name));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
