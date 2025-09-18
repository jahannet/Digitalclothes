
import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageSelect, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full md:w-1/2 p-2">
      <h3 className="text-lg font-semibold text-center text-cyan-300 mb-2">{title}</h3>
      <div
        onClick={handleAreaClick}
        className="cursor-pointer bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg h-80 flex items-center justify-center transition-all duration-300 hover:border-cyan-400 hover:bg-gray-700"
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt={title} className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">برای انتخاب عکس کلیک کنید</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
