'use client';

import { useState } from 'react';

export default function ImageUploadModal({ onClose, onImageUpload }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      // Simulate slight delay (e.g., API prep)
      setTimeout(() => {
        onImageUpload(file); // Pass the uploaded image to the parent
        setIsProcessing(false);
        onClose(); // Close modal
      }, 500);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload({ target: { files: [file] } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload or Drag Image
        </h2>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-dashed border-2 border-gray-300 rounded-lg h-32 flex justify-center items-center cursor-pointer"
        >
          <p className="text-gray-400">Drag & Drop or Click to Upload</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {isProcessing && <p className="text-center mt-4">Processing...</p>}
      </div>
    </div>
  );
}
