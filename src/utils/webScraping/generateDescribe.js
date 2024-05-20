import { GoogleGenerativeAI } from "@google/generative-ai";

// Accede a tu clave de API como una variable de entorno
const genAI = new GoogleGenerativeAI("AIzaSyD4yUFzCRr3abCqRG2dqydlrZ0I9fPs-4g");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const generateDescriptionAttraction = async (title) => {
  const prompt = "Escribe una descripción de 70 palabras de esta actividad: " + title;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
};

export const generateDescriptionRestaurant = async (title) => {
  const prompt = "Escribe una descripción de 70 palabras de este restaurante: " + title;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}; 
