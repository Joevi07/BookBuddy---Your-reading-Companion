import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import pdf from 'pdf-parse';
import { genkit } from 'genkit/beta';
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

app.post('/ask', async (req: Request, res: Response) => {
  try {
    const file = req.files?.pdf as fileUpload.UploadedFile;
    const question = req.body.question;

    if (!file || !question) {
      return res.status(400).json({ error: 'PDF and question required.' });
    }

    const pdfData = await pdf(file.data);
    const prompt = `
      Use the following PDF content to answer:
      ${pdfData.text}
    `;

    const chat = ai.chat({ system: prompt });
    const response = await chat.send(question);

    res.json({ answer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
