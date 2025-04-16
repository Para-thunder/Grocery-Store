// src/components/ImageTest.js
import React from 'react';

const ImageTest = () => {
  const testImages = [
    `${process.env.PUBLIC_URL}/images/products/1.jpg`,
    `${process.env.PUBLIC_URL}/images/placeholder-product.jpg`,
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Image Load Test</h2>
      {testImages.map((img, i) => (
        <div key={i} style={{ margin: 20 }}>
          <p>Trying to load: <code>{img}</code></p>
          <img 
            src={img}
            alt="Test" 
            style={{ 
              width: '200px', 
              border: '2px solid red',
              display: 'block' 
            }}
            onError={(e) => console.error('FAILED to load:', e.target.src)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTest;