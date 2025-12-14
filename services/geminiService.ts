import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, ModelType, Resolution } from "../types";

// Helper to convert File to Base64
const fileToPart = async (file: File, mimeType: string) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: mimeType,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateHairstyle = async (config: GenerationConfig): Promise<string[]> => {
  // NOTE: For 'gemini-3-pro-image-preview', in a real production app using Veo/Pro features, 
  // you might need window.aistudio.openSelectKey() flow as per instructions.
  // For this generated code, we rely on process.env.API_KEY or assume the environment is configured.
  // If the user selects PRO model, we attempt to use the specific model configuration.
  
  if (!process.env.API_KEY) {
     throw new Error("API Key chưa được cấu hình (process.env.API_KEY).");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct the text prompt based on the template
  const textPrompt = `
  Tạo một bản render kiến trúc chân thực dựa trên Ảnh Gốc (Ảnh 1).
  LƯU Ý QUAN TRỌNG: Hình ảnh đầu ra PHẢI có kích thước pixel và tỉ lệ khung hình GIỐNG Y HỆT so với Ảnh Gốc (Ảnh 1), chi tiết bám theo ảnh 1.
  KHÔNG được lấy kích thước hoặc tỉ lệ khung hình của Ảnh Tham Chiếu (Ảnh 2) nếu có.
  
  Yêu cầu chi tiết:
  - Kiểu tóc mục tiêu: ${config.hairStyle}
  - Màu tóc: ${config.hairColor}
  - Khuôn mặt người mẫu: ${config.faceShape}
  - Mô tả bổ sung: ${config.description || 'Không có'}
  
  Hướng dẫn sáng tạo chính là: một bản render chân thực của kiểu tóc mới dựa trên khuôn mặt mẫu trong ảnh gốc,
  nằm trong bối cảnh điện ảnh, với ánh sáng sáng trung tính.
  Hãy tránh các yếu tố sau: chữ, dầu mờ, mờ, chất lượng thấp, biến dạng khuôn mặt.
  `;

  const parts: any[] = [];

  // 1. Original Image (Priority 1)
  if (config.originalImage) {
    const originalPart = await fileToPart(config.originalImage, config.originalImage.type);
    parts.push(originalPart);
  }

  // 2. Reference Image (Optional)
  if (config.referenceImage) {
    const refPart = await fileToPart(config.referenceImage, config.referenceImage.type);
    parts.push(refPart);
  }

  // 3. Text Prompt
  parts.push({ text: textPrompt });

  const modelName = config.modelType;
  
  // Configure parameters
  const imageConfig: any = {
    aspectRatio: config.aspectRatio,
  };

  // Only Pro model supports imageSize parameter
  if (modelName === ModelType.PRO && config.resolution) {
    imageConfig.imageSize = config.resolution;
  }

  // Call the API
  // We loop based on imageCount because standard generateContent usually returns 1-4 candidates 
  // but for explicit image generation models, sometimes we need to make parallel requests 
  // or rely on 'numberOfImages' if using generateImages (Imagen).
  // However, for Gemini 2.5/3 Pro Image models, we use generateContent.
  // Typically returns 1 image per candidate or based on internal logic. 
  // To support multiple images strictly, we might need to loop or check if model supports 'numberOfImages' in config.
  // The Gemini 2.5 Flash Image model usually outputs 1 image per request unless configured differently (rarely exposed publicly yet for simple content generation).
  // We will loop requests to guarantee count.
  
  const promises = [];
  for (let i = 0; i < config.imageCount; i++) {
    promises.push(
      ai.models.generateContent({
        model: modelName,
        contents: {
          parts: parts
        },
        config: {
            imageConfig: imageConfig,
            // We use a small random seed variation or rely on temperature if applicable to get variety, 
            // though generateContent for images usually varies by itself.
        }
      })
    );
  }

  const results = await Promise.all(promises);
  const imageUrls: string[] = [];

  for (const response of results) {
      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                  const base64 = part.inlineData.data;
                  const mimeType = part.inlineData.mimeType || 'image/png';
                  imageUrls.push(`data:${mimeType};base64,${base64}`);
              }
          }
      }
  }
  
  if (imageUrls.length === 0) {
      throw new Error("Không tạo được ảnh nào. Vui lòng thử lại.");
  }

  return imageUrls;
};
