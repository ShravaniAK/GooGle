'use client';

import { useState, useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillMicFill, BsCamera } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import ImageUploadModal from './ImageUploadModal';
import ImageSearch from './ImageSearch';

export default function HomeSearch() {
  const [input, setInput] = useState('');
  const [randomSearchLoading, setRandomSearchLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const router = useRouter();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); 

  const openImageUploadModal = () => {
    setShowImageUpload(true);
  };

  const handleImageUploaded = (imageFile) => {
    setUploadedImage(imageFile); // Pass uploaded image
    setShowImageUpload(false); // Close modal
  };

  // Submit search
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search/web?searchTerm=${input}`);
  };

  // Voice search functionality
  const [isRecognizing, setIsRecognizing] = useState(false); // Track recognition state

const startVoiceRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Speech Recognition is not supported in your browser.');
    return;
  }

  if (isRecognizing) {
    console.warn('Voice recognition is already running.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false; // Stops after detecting speech
  recognition.maxAlternatives = 1;

  recognitionRef.current = recognition;

  recognition.start();
  setListening(true);
  setIsRecognizing(true);

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setInput(result); // Update input field
    handleSubmit(new Event('submit'));
  };

  recognition.onend = () => {
    console.log('Voice recognition stopped.');
    setListening(false);
    setIsRecognizing(false);
  };

  recognition.onerror = (event) => {
    console.error('Voice Search Error:', event.error);
    setListening(false);
    setIsRecognizing(false);

    switch (event.error) {
      case 'no-speech':
        alert('No speech detected. Please try again.');
        console.log('Restarting voice recognition...');
        recognition.stop(); // Stop recognition
        setTimeout(() => {
          if (!isRecognizing) recognition.start(); // Restart safely
        }, 1000); // Delay restart to avoid conflicts
        break;
      case 'aborted':
        console.warn('Voice recognition aborted.');
        break;
      case 'not-allowed':
        alert('Microphone access is blocked. Please allow microphone permissions.');
        break;
      default:
        alert(`An error occurred: ${event.error}`);
    }
  };
};

  

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='flex w-full mt-5 mx-auto max-w-[90%] border border-gray-200 px-5 py-3 rounded-full hover:shadow-md focus-within:shadow-md transition-shadow sm:max-w-xl lg:max-w-2xl'
      >
        <AiOutlineSearch className='text-xl text-gray-500 mr-3' />
        <input
          type='text'
          value={input} // Bind input field with the state
          className='flex-grow focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder='Search Google or use voice'
        />
        <BsFillMicFill
          className={`text-lg cursor-pointer my-auto mr-2 ${
            listening ? 'text-red-500 animate-pulse' : 'text-gray-500'
          }`}
          onClick={startVoiceRecognition}
          title={listening ? 'Listening...' : 'Start Voice Search'}
        />
         <BsCamera
        className="cursor-pointer text-gray-500"
        size={24}
        onClick={openImageUploadModal}
        title="Search by Image"
      />
      </form>
      {/* Image Upload Modal */}
     {/* Image Upload Modal */}
     {showImageUpload && (
        <ImageUploadModal
          onClose={() => setShowImageUpload(false)}
          onImageUpload={handleImageUploaded} // Pass uploaded image to parent
        />
      )}

      {/* Trigger Image Search */}
      {uploadedImage && <ImageSearch uploadedImage={uploadedImage} />}
    
      <div className='flex flex-col space-y-2 sm:space-y-0 justify-center sm:flex-row mt-8 sm:space-x-4'>
        <button
          className='bg-[#f8f9fa] rounded-md text-sm text-gray-800 hover:ring-gray-200 focus:outline-none active:ring-gray-300 hover:shadow-md w-36 h-10 transition-shadow'
          onClick={handleSubmit}
        >
          Google Search
        </button>
        <button
          disabled={randomSearchLoading}
          className='bg-[#f8f9fa] rounded-md text-sm text-gray-800 hover:ring-gray-200 focus:outline-none active:ring-gray-300 hover:shadow-md w-36 h-10 transition-shadow disabled:opacity-80 disabled:shadow-sm'
         
        >
          {randomSearchLoading ? 'Loading...' : 'I am feeling lucky'}
        </button>
      </div>
    </>
  );
}
