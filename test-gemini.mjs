const API_KEY = "AIzaSyBCXemYS3E9X6e_CuBsNfh5fK6o11_oFXE";

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
