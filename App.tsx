import React, { useState, useMemo } from 'react';
import { 
  FaceShape, 
  ModelType, 
  AspectRatio, 
  Resolution, 
  GenerationConfig 
} from './types';
import { 
  HAIR_STYLES, 
  HAIR_COLORS, 
  FACE_SHAPE_ADVICE 
} from './constants';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { generateHairstyle } from './services/geminiService';
import { Sparkles, AlertCircle, Info, Scissors, Settings2, Loader2, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShape>(FaceShape.OVAL);
  const [hairStyleId, setHairStyleId] = useState<string>(HAIR_STYLES[0].id);
  const [hairColor, setHairColor] = useState<string>(HAIR_COLORS[0]);
  const [description, setDescription] = useState<string>('');
  const [modelType, setModelType] = useState<ModelType>(ModelType.STANDARD);
  const [imageCount, setImageCount] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.RATIO_9_16);
  const [resolution, setResolution] = useState<Resolution>(Resolution.RES_1K);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Derived State ---
  const advice = useMemo(() => FACE_SHAPE_ADVICE[faceShape], [faceShape]);
  const currentStyle = HAIR_STYLES.find(h => h.id === hairStyleId) || HAIR_STYLES[0];

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Vui lòng tải lên ảnh gốc (Ảnh khuôn mặt).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const config: GenerationConfig = {
        originalImage,
        referenceImage,
        faceShape,
        hairStyle: currentStyle.name,
        hairColor,
        description,
        modelType,
        aspectRatio,
        resolution,
        imageCount,
        prompt: '' // Will be built in service
      };

      const images = await generateHairstyle(config);
      setResults(images);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi khi tạo ảnh. Vui lòng kiểm tra API Key hoặc thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Scissors className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Phạm Tùng Vip
              </h1>
              <p className="text-xs text-slate-400">Thay đổi kiểu tóc chuyên nghiệp</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls (Sticky on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-300">
                <Settings2 size={20} />
                Cấu Hình
              </h3>

              {/* 1. Images */}
              <div className="space-y-4 mb-6">
                <ImageUploader 
                  id="img-original"
                  label="1. Ảnh Gốc (Bắt buộc)" 
                  subLabel="Ảnh chân dung khuôn mặt cần đổi tóc"
                  selectedImage={originalImage} 
                  onImageSelected={setOriginalImage} 
                />
                <ImageUploader 
                  id="img-ref"
                  label="2. Ảnh Tham Chiếu (Tùy chọn)" 
                  subLabel="Ảnh mẫu kiểu tóc muốn bắt chước"
                  selectedImage={referenceImage} 
                  onImageSelected={setReferenceImage} 
                />
              </div>

              {/* 2. Face & Style */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hình dáng khuôn mặt</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(FaceShape).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setFaceShape(shape)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          faceShape === shape 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                  {/* Advice Box */}
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-xs">
                    <p className="flex gap-2 mb-1"><span className="text-green-400 font-bold shrink-0">Nên:</span> <span className="text-slate-300">{advice.recommended}</span></p>
                    <p className="flex gap-2"><span className="text-red-400 font-bold shrink-0">Tránh:</span> <span className="text-slate-300">{advice.avoid}</span></p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kiểu tóc mong muốn</label>
                  <select 
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={hairStyleId}
                    onChange={(e) => setHairStyleId(e.target.value)}
                  >
                    {HAIR_STYLES.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.name} - {style.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Màu tóc</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setHairColor(color)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                          hairColor === color
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mô tả thêm (Tùy chọn)</label>
                  <textarea 
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    rows={3}
                    placeholder="Ví dụ: Tóc uốn nhẹ, bóng mượt, mái thưa..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <Wand2 size={20} />
                Nâng Cao
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">Model</label>
                   <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm"
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value as ModelType)}
                   >
                     <option value={ModelType.STANDARD}>Banana Standard (Flash)</option>
                     <option value={ModelType.PRO}>Banana Pro (Chất lượng cao)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">Số lượng ảnh</label>
                   <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm"
                      value={imageCount}
                      onChange={(e) => setImageCount(Number(e.target.value))}
                   >
                     {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">Tỷ lệ khung hình</label>
                   <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                   >
                     {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">Độ phân giải</label>
                   <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm disabled:opacity-50"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as Resolution)}
                      disabled={modelType !== ModelType.PRO}
                   >
                     <option value={Resolution.RES_1K}>1K</option>
                     <option value={Resolution.RES_2K}>2K (Chỉ Pro)</option>
                   </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !originalImage}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isLoading || !originalImage
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Sparkles className="fill-current" />
                  Tạo Kiểu Tóc
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Preview & Results */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             {/* Info Panel if no results yet */}
             {results.length === 0 && !isLoading && (
               <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-800/20">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Info className="text-slate-600 w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có kết quả</h3>
                 <p className="text-slate-500 max-w-md">
                   Tải ảnh lên và chọn cấu hình bên trái, sau đó nhấn "Tạo Kiểu Tóc" để xem phép màu của AI.
                 </p>
                 <div className="mt-8 grid grid-cols-3 gap-4 opacity-50 w-full max-w-lg">
                    <div className="aspect-[3/4] bg-slate-800 rounded animate-pulse"></div>
                    <div className="aspect-[3/4] bg-slate-800 rounded animate-pulse delay-75"></div>
                    <div className="aspect-[3/4] bg-slate-800 rounded animate-pulse delay-150"></div>
                 </div>
               </div>
             )}

             {/* Loading State */}
             {isLoading && (
               <div className="h-full flex flex-col items-center justify-center min-h-[400px] rounded-2xl p-8 text-center">
                 <div className="relative">
                   <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles className="text-purple-400 w-6 h-6 animate-pulse" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-white mt-6">Đang thiết kế kiểu tóc...</h3>
                 <p className="text-slate-400 mt-2">Vui lòng đợi trong giây lát, AI đang xử lý chi tiết.</p>
               </div>
             )}

             {/* Results */}
             <ResultViewer images={results} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;