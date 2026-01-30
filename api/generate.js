export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, image } = request.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'Server Authorization Missing (Key)' });
    }

    if (!prompt) {
        return response.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Attempt to use the Google Generative AI (Gemini/Imagen) API
        // Endpoint for Imagen 3 via AI Studio (Generative Language API)
        // Note: Check if "imagen-3.0-generateImages" is the exact model name available to the key.
        // Fallback or Standard: 'imagen-3.0-generate-001' or similar in Vertex, but for API Key we use generative-language.

        // Strategy: Use the standard v1beta endpoint for image generation
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

        // Construct the payload compatible with Imagen API
        // Ensure the input image (base64) is handled if the model supports image-to-image, 
        // otherwise it might be text-to-image only. Imagen 3 is primarily Text-to-Image.
        // If Image-to-Image is required, we might need a different endpoint or parameter structure.
        // For now, prompt-based generation (Text-to-Image) is the safest baseline.

        const requestBody = {
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "4:5" // Matching the card format
            }
        };

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error("Vertex/Gemini API Error:", data);
            throw new Error(data.error?.message || apiResponse.statusText);
        }

        // Parse the response to get the base64 image
        // Structure usually: predictions[0].bytesBase64Encoded or similar
        const generatedImageB64 = data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.mimeType ? data.predictions[0].bytesBase64Encoded : null;

        if (!generatedImageB64) {
            throw new Error("No image data received from API");
        }

        return response.status(200).json({
            image: `data:image/png;base64,${generatedImageB64}`
        });

    } catch (error) {
        console.error("Generation failed:", error);
        return response.status(500).json({ error: error.message });
    }
}
