export enum FaceShape {
  ROUND = 'Mặt Tròn',
  LONG = 'Mặt Dài',
  SQUARE = 'Mặt Vuông',
  OVAL = 'Mặt Trái Xoan'
}

export enum ModelType {
  STANDARD = 'gemini-2.5-flash-image', // Banana Standard
  PRO = 'gemini-3-pro-image-preview' // Banana Pro
}

export enum AspectRatio {
  RATIO_9_16 = '9:16',
  RATIO_16_9 = '16:9',
  RATIO_4_3 = '4:3',
  RATIO_3_4 = '3:4',
  RATIO_1_1 = '1:1'
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K' // Only for Pro
}

export interface HairStyleOption {
  id: string;
  name: string;
  description: string;
}

export interface FaceShapeAdvice {
  recommended: string;
  avoid: string;
}

export interface GenerationConfig {
  prompt: string;
  originalImage: File | null;
  referenceImage: File | null;
  faceShape: FaceShape;
  hairStyle: string;
  hairColor: string;
  modelType: ModelType;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  imageCount: number; // 1-4
  description: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
