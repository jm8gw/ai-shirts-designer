import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E routes!" });
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.images.generate({
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        });

        // Test: Generate a simple yet colorful logo with no lettering and a transparent background. I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:

        const image = response.data[0].b64_json;

        res.status(200).json({ photo: image });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while generating the image" });
    }
})

export default router;