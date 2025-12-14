import React, { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ResultViewerProps {
  images: string[];
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ images }) => {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-green-500 rounded-full"></span>
        Kết Quả
      </h2>
      
      <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="group relative aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 hover:border-green-500/50 transition-all cursor-zoom-in"
            onClick={() => setZoomImage(img)}
          >
            <img 
              src={img} 
              alt={`Result ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <ZoomIn className="text-white drop-shadow-md" size={32} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-center text-white font-medium">Bấm để phóng to</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <button 
            className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-200 rounded-full hover:bg-slate-700 transition-colors z-50"
            onClick={() => setZoomImage(null)}
          >
            <X size={32} />
          </button>
          
          <div className="relative max-w-7xl max-h-screen w-full flex flex-col items-center justify-center">
            <img 
              src={zoomImage} 
              alt="Zoomed Result" 
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <a 
              href={zoomImage} 
              download={`hair-style-result-${Date.now()}.png`}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-transform active:scale-95"
            >
              <Download size={20} />
              Tải Xuống
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
