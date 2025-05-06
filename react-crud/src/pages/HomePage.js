import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBasket, 
  FaTags, 
  FaFire,
  FaFileContract,
  FaPercentage,
  FaLeaf,
  FaAppleAlt,
  FaCarrot
} from 'react-icons/fa';
import '../styles/Home.css';

const HomePage = () => {
  // Function to create floating particles
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (!particlesContainer) return;
      
      // Clear existing particles
      particlesContainer.innerHTML = '';
      
      // Create new particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position, size and delay
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
      }
    };
    
    createParticles();
    
    // Recreate particles on window resize
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  return (
    <div className="animated-background">
      <div className="particles-container"></div>
      
      <div className="home-content">
        {/* Decorative grocery illustrations */}
        <div className="floating-illustrations">
          <div className="floating-icon icon-1"><FaAppleAlt /></div>
          <div className="floating-icon icon-2"><FaCarrot /></div>
          <div className="floating-icon icon-3"><FaLeaf /></div>
        </div>
        
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="banner-decoration circle-1"></div>
          <div className="banner-decoration circle-2"></div>
          <div className="banner-decoration circle-3"></div>
          
          <div className="banner-content">
            <h1>Welcome to Online Grocery Manager</h1>
            <p>All your grocery needs in one place</p>
            
            <div className="banner-cta">
              <Link to="/products" className="cta-button">
                Start Shopping
              </Link>
            </div>
          </div>
          
          {/* Decorative wave */}
          <div className="wave-container">
            <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="rgba(255,255,255,0.2)" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,160C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="dashboard-section">
          <h2 className="section-title">Managing online store just got easier!</h2>
          <p className="subtitle">Select a section to explore</p>

          <div className="card-container">
            <Link to="/products" className="dashboard-card product-card">
              <div className="card-content">
                <div className="card-icon">
                  <FaShoppingBasket />
                </div>
                <h3>Explore Products</h3>
                <p>Browse all store products</p>
                <div className="card-shine"></div>
              </div>
            </Link>

            <Link to="/categories" className="dashboard-card category-card">
              <div className="card-content">
                <div className="card-icon">
                  <FaTags />
                </div>
                <h3>Categories</h3>
                <p>Shop by categories</p>
                <div className="card-shine"></div>
              </div>
            </Link>

            <Link to="/top-selling" className="dashboard-card top-selling-card">
              <div className="card-content">
                <div className="card-icon">
                  <FaFire />
                </div>
                <h3>Top Selling</h3>
                <p>See what's selling like hotcakes!</p>
                <div className="card-shine"></div>
              </div>
            </Link>

            {/* New Deals Card */}
            <Link to="/deals" className="dashboard-card deals-card">
              <div className="card-content">
                <div className="card-icon">
                  <FaPercentage />
                </div>
                <h3>Special Deals</h3>
                <p>Create your own bundle deals!</p>
                <div className="card-shine"></div>
              </div>
            </Link>

            {/* Shopping Policies Card */}
            <Link to="/policies" className="dashboard-card policies-card">
              <div className="card-content">
                <div className="card-icon">
                  <FaFileContract />
                </div>
                <h3>Shopping Policies</h3>
                <p>Returns, payments & terms</p>
                <div className="card-shine"></div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* New feature highlight section */}
        <div className="feature-highlight">
          <div className="highlight-content">
            <h2>New & Improved</h2>
            <p>Discover our latest features designed to make your shopping experience better!</p>
            <Link to="/features" className="highlight-link">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;