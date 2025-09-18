
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import { virtualTryOn } from './services/geminiService';
import type { UploadedImage } from './types';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<UploadedImage | null>(null);
  const [clothingImage, setClothingImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const convertFileToUploadedImage = (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const [header, base64] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
        resolve({ base64, mimeType, dataUrl });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleModelImageSelect = useCallback(async (file: File) => {
    try {
      const uploadedImage = await convertFileToUploadedImage(file);
      setModelImage(uploadedImage);
    } catch (err) {
      setError('خطا در بارگذاری عکس مدل.');
    }
  }, []);

  const handleClothingImageSelect = useCallback(async (file: File) => {
    try {
      const uploadedImage = await convertFileToUploadedImage(file);
      setClothingImage(uploadedImage);
    } catch (err) {
      setError('خطا در بارگذاری عکس لباس.');
    }
  }, []);

  const handleTryOn = async () => {
    if (!modelImage || !clothingImage) {
      setError('لطفاً هر دو عکس مدل و لباس را بارگذاری کنید.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await virtualTryOn(modelImage, clothingImage);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || 'یک خطای ناشناخته رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setModelImage(null);
    setClothingImage(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  };

  const isTryOnDisabled = !modelImage || !clothingImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {isLoading && <Loader />}
      <main className="container mx-auto max-w-6xl w-full">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            مانکن دیجیتال
          </h1>
          <p className="text-gray-400 mt-2">لباس‌ها را به صورت مجازی پرو کنید</p>
        </header>
        
        {!resultImage ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col md:flex-row md:space-x-4 md:rtl:space-x-reverse">
              <ImageUploader id="model-uploader" title="۱. عکس مدل را بارگذاری کنید" onImageSelect={handleModelImageSelect} imagePreviewUrl={modelImage?.dataUrl || null} />
              <ImageUploader id="clothing-uploader" title="۲. عکس لباس را بارگذاری کنید" onImageSelect={handleClothingImageSelect} imagePreviewUrl={clothingImage?.dataUrl || null}/>
            </div>

            {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-center">
              <button
                onClick={handleTryOn}
                disabled={isTryOnDisabled}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'در حال پردازش...' : 'پرو مجازی'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl shadow-cyan-500/10 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">استایل جدید شما آماده است!</h2>
            <div className="max-w-2xl mx-auto border-4 border-cyan-400 rounded-lg overflow-hidden">
                <img src={resultImage} alt="Final look" className="w-full h-auto" />
            </div>
            <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
              <a 
                href={resultImage} 
                download="virtual-try-on.png"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-500"
              >
                دانلود تصویر
              </a>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-500"
              >
                شروع مجدد
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>     Designed by Ali Norouzi</p>
      </footer>
    </div>
  );
};

export default App;
