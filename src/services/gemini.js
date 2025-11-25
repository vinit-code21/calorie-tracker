const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBCXemYS3E9X6e_CuBsNfh5fK6o11_oFXE";

export const sendMessageToGemini = async (message, history = []) => {
    try {
        // Gemini API requires the conversation to start with a user message.
        // We filter the history to find the first user message and keep everything after it.
        // If there are no user messages in history yet, we send an empty history (just the current message).
        let validHistory = [];
        const firstUserIndex = history.findIndex(msg => msg.role === 'user');

        if (firstUserIndex !== -1) {
            validHistory = history.slice(firstUserIndex);
        }

        const contents = validHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Add current message
        contents.push({
            role: "user",
            parts: [{ text: message }]
        });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: contents,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Details:", errorData);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        return reply;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error; // Re-throw to let the component handle the UI message
    }
};
