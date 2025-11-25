const API_KEY = "AIzaSyDc_0Twq1D0usQTATpnHXRi0lCUruZyksQ";

async function test() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }],
                }),
            }
        );

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
