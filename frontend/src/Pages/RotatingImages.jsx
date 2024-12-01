import React, { useState, useEffect } from 'react';

import './RotatingImages.css';

const images = [
  '/images/budget-planning.jpeg',
  '/images/expense-tracking.jpeg',
  '/images/saving-goals.avif',
  '/images/reports.webp',
  // Add more image paths as needed
];

const RotatingImages = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="rotating-images">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Financial Management Illustration ${index + 1}`}
          className={index === currentImageIndex ? 'active' : ''}
        />
      ))}
    </div>
  );
};

export default RotatingImages;