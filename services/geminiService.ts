import { GoogleGenAI } from "@google/genai";
import type { Movie, TVShow } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// A simple markdown to HTML converter
const simpleMarkdownToHtml = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')     // Italic
    .replace(/^- (.*)/gm, '<li>$1</li>')         // List items
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') // Wrap lists
    .replace(/\n/g, '<br />');                   // Newlines
};

export const askAboutMedia = async (media: Movie | TVShow, question: string, language: 'en' | 'ar'): Promise<string> => {
    const mediaTitle = 'title' in media ? media.title : media.name;
    const systemInstruction = `You are a helpful and knowledgeable movie and TV show assistant named Talvri AI. Your goal is to answer user questions about a specific movie or TV show based on the provided context.
- Provide concise and accurate answers.
- **CRITICAL**: Do not include spoilers unless the user explicitly asks for them. If a question seems like it might lead to a spoiler (e.g., "what happens to the main character?"), warn the user first.
- If you don't know the answer, say so. Do not make up information.
- Respond in the same language as the user's question (${language === 'ar' ? 'Arabic' : 'English'}).
- Format your response using simple markdown (bold, italics, lists).`;

    const prompt = `
Context:
- Title: ${mediaTitle}
- Overview: ${media.overview}
- Genres: ${media.genres?.map(g => g.name).join(', ') || 'N/A'}

User's Question: "${question}"

Answer:
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return simpleMarkdownToHtml(response.text);
    } catch (error) {
        console.error('Gemini API call failed:', error);
        if (language === 'ar') {
            return 'عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.';
        }
        return 'Sorry, there was an error contacting the AI. Please try again.';
    }
};
