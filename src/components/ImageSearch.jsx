'use client';

import { useState, useEffect } from 'react';

export default function ImageSearch({ uploadedImage }) {
  const [images, setImages] = useState([]); // To store search results
  const [loading, setLoading] = useState(true);

  // Google Custom Search API credentials
  const API_KEY = 'AIzaSyASBvpvG_95i30gcetYIZC3rYWRyc-erzE';
  const SEARCH_ENGINE_ID = '658f460bbaea94eeb';

  useEffect(() => {
    // Fetch images when an image is uploaded
    const fetchImages = async () => {
      setLoading(true);
      const query = uploadedImage.name || 'Sample Image Search';

      const url = `https://www.googleapis.com/customsearch/v1?q=${query}&searchType=image&key=${API_KEY}&cx=${SEARCH_ENGINE_ID}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
          setImages(data.items); // Store image results
        } else {
          setImages([]); // If no results are found
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (uploadedImage) {
      fetchImages();
    }
  }, [uploadedImage]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Image Search Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.link} className="border p-2">
              <img
                src={img.link}
                alt={img.title}
                className="w-full h-48 object-cover"
              />
              <p className="mt-2 text-center text-sm">{img.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No images found. Try another query.</p>
      )}
    </div>
  );
}
