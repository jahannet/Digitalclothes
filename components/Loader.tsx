
import React from 'react';

const Loader: React.FC = () => {
  const messages = [
    "در حال آماده‌سازی استایل جدید شما...",
    "استایلیست هوش مصنوعی ما در حال کار است...",
    "فقط چند لحظه دیگر...",
    "ترکیب تصاویر..."
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="text-white text-lg mt-4">{message}</p>
    </div>
  );
};

export default Loader;
