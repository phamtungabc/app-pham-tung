import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  subLabel?: string;
  onImageSelected: (file: File | null) => void;
  selectedImage: File | null;
  id: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  subLabel,
  onImageSelected,
  selectedImage,
  id
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    onImageSelected(null);
    setPreview(null);
    // Reset input value
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {subLabel && <p className="text-xs text-slate-500 mb-1">{subLabel}</p>}
      
      {!preview ? (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-750 hover:border-blue-500 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-slate-400" />
            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Bấm để tải ảnh</span></p>
            <p className="text-xs text-slate-500">PNG, JPG (Tối đa 5MB)</p>
          </div>
          <input 
            id={id} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="relative w-full h-40 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleClear}
              className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-transform transform hover:scale-110"
              title="Xóa ảnh"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-1 right-1 bg-black/60 px-2 py-0.5 rounded text-xs text-white pointer-events-none">
            {selectedImage?.name.length && selectedImage.name.length > 20 
              ? selectedImage.name.substring(0, 18) + '...' 
              : selectedImage?.name}
          </div>
        </div>
      )}
    </div>
  );
};
