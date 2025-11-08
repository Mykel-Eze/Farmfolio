// File: src/components/templates/WineTemplate.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WineTemplate.css';

gsap.registerPlugin(ScrollTrigger);

const WineTemplate = ({ data, isEditMode = false, onEdit }) => {
  const sectionsRef = useRef([]);
  const fileInputRef = useRef(null);
  const [currentImageField, setCurrentImageField] = useState(null);

  const content = typeof data?.body === 'string' ? JSON.parse(data.body) : data?.body || {};

  const defaultContent = {
    heroTitle: "Château d'Élégance",
    heroSubtitle: 'A Symphony of Timeless Taste',
    heroImage: 'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309',
    aboutTitle: 'Our Heritage',
    aboutText: 'Nestled in the rolling hills of Bordeaux, Château d\'Élégance crafts wines that embody sophistication and tradition.',
    storyTitle: 'The Art of Winemaking',
    storyText: 'Our story began in 1872 with a small family vineyard and a dream to create wines that inspire emotion...',
    vineyardTitle: 'Our Vineyard',
    vineyardText: 'Located in the heart of Bordeaux, our vineyard stretches across sun-kissed valleys...',
    vineyardImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    collectionTitle: 'Signature Collection',
    wines: [
      { name: 'Merlot Reserve', image: 'https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5' },
      { name: 'Cabernet Vintage', image: 'https://plus.unsplash.com/premium_photo-1683141416406-f73cadbde37c' },
      { name: 'Rosé Prestige', image: 'https://plus.unsplash.com/premium_photo-1743043625853-7bd3a0b19e91' }
    ],
    awardsTitle: 'International Recognition',
    awards: [
      { title: 'Gold Medal', description: 'Paris Wine Expo 2023' },
      { title: 'Best European Winery', description: 'World Wine Awards 2022' },
      { title: "Sommelier's Choice", description: 'Global Wine Guild 2024' }
    ],
    testimonials: [
      { quote: 'A masterpiece in every pour. Château d\'Élégance defines luxury.', author: 'Wine Enthusiast Magazine' },
      { quote: 'Smooth, velvety texture with a finish that lingers like a memory.', author: 'Marie Leclerc, Sommelier' },
      { quote: 'Their Merlot Reserve redefines elegance.', author: 'Thomas Green, Critic & Author' }
    ],
    contactEmail: 'info@chateadelegance.com',
    contactPhone: '+33 1 23 45 67 89',
    contactLocation: '14 Rue du Vin, Bordeaux, France'
  };

  const templateData = { ...defaultContent, ...content };
  const images = data?.mediaFiles || [];

  useEffect(() => {
    if (isEditMode) return;

    const ctx = gsap.context(() => {
      gsap.from('.wine-hero-content h1', { duration: 1.2, y: 80, opacity: 0 });
      gsap.from('.wine-hero-content p', { duration: 1.2, delay: 0.4, y: 40, opacity: 0 });
      gsap.from('.wine-hero-content a', { duration: 1.2, delay: 0.8, y: 20, opacity: 0 });

      sectionsRef.current.forEach(section => {
        if (!section) return;
        const h2 = section.querySelector('h2');
        if (h2) {
          gsap.from(h2, {
            scrollTrigger: section,
            y: 60,
            opacity: 0,
            duration: 1
          });
        }
      });
    });

    return () => ctx.revert();
  }, [isEditMode]);

  const handleEditClick = (field, value) => {
    if (onEdit && isEditMode) {
      onEdit(field, value);
    }
  };

  const handleImageClick = (field) => {
    if (!isEditMode) return;
    setCurrentImageField(field);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentImageField) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleEditClick(currentImageField, reader.result);
      setCurrentImageField(null);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to add query params only to URLs, not base64
  const addQueryParams = (imageUrl, params) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('data:')) return imageUrl; // Don't add params to base64
    return `${imageUrl}${params}`;
  };

  return (
    <div className={`wine-template ${isEditMode ? 'edit-mode' : ''}`}>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* Navigation */}
      <header className="wine-navbar">
        <div className="wine-logo">
          <img src="/farmfolio.png" alt="logo" />
        </div>

        <Link to="/marketplace" className="marketplace-link">
          <img src="/market.png" alt="Marketplace" />
        </Link>
        {/* <input type="text" id="search" placeholder="Search Marketplace..." className="wine-search-input" /> */}
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="wine-hero"
        style={{
          background: `url(${addQueryParams(images[0]?.url || templateData.heroImage, '?auto=format&fit=crop&q=80&w=1170')}) center/cover no-repeat`
        }}
        onClick={() => handleImageClick('heroImage')}
      >
        <div className="wine-overlay"></div>
        <div className="wine-hero-content">
          <h1
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('heroTitle', e.target.textContent)}
          >
            {templateData.heroTitle}
          </h1>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('heroSubtitle', e.target.textContent)}
          >
            {templateData.heroSubtitle}
          </p>
          <a href="#collection" className="wine-btn">Explore Collection</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="wine-about" ref={el => sectionsRef.current[0] = el}>
        <div className="wine-content">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('aboutTitle', e.target.textContent)}
          >
            {templateData.aboutTitle}
          </h2>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('aboutText', e.target.textContent)}
          >
            {templateData.aboutText}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="wine-story" ref={el => sectionsRef.current[1] = el}>
        <div className="wine-content">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('storyTitle', e.target.textContent)}
          >
            {templateData.storyTitle}
          </h2>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('storyText', e.target.textContent)}
          >
            {templateData.storyText}
          </p>
        </div>
      </section>

      {/* Vineyard Section */}
      <section id="vineyard" className="wine-vineyard" ref={el => sectionsRef.current[2] = el}>
        <div className="wine-vineyard-text">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('vineyardTitle', e.target.textContent)}
          >
            {templateData.vineyardTitle}
          </h2>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('vineyardText', e.target.textContent)}
          >
            {templateData.vineyardText}
          </p>
        </div>
        <div className="wine-vineyard-img">
          <img
            src={addQueryParams(templateData.vineyardImage, '?auto=format&fit=crop&w=1000&q=80')}
            alt="Vineyard"
            onClick={() => handleImageClick('vineyardImage')}
          />
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="wine-collection" ref={el => sectionsRef.current[3] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('collectionTitle', e.target.textContent)}
        >
          {templateData.collectionTitle}
        </h2>
        <div className="wine-grid">
          {templateData.wines.map((wine, index) => (
            <div key={index} className="wine-card">
              <img
                src={addQueryParams(wine.image, '?auto=format&fit=crop&q=80&w=500')}
                alt={wine.name}
                onClick={() => handleImageClick(`wines.${index}.image`)}
              />
              <h3
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`wines.${index}.name`, e.target.textContent)}
              >
                {wine.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="wine-awards" ref={el => sectionsRef.current[4] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('awardsTitle', e.target.textContent)}
        >
          {templateData.awardsTitle}
        </h2>
        <div className="wine-awards-grid">
          {templateData.awards.map((award, index) => (
            <div key={index} className="wine-award-card">
              <h3
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`awards.${index}.title`, e.target.textContent)}
              >
                {award.title}
              </h3>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`awards.${index}.description`, e.target.textContent)}
              >
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="wine-testimonials" ref={el => sectionsRef.current[5] = el}>
        <h2>What Connoisseurs Say</h2>
        <div className="wine-testimonial-grid">
          {templateData.testimonials.map((testimonial, index) => (
            <blockquote key={index}>
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`testimonials.${index}.quote`, e.target.textContent)}
              >
                "{testimonial.quote}"
              </span>
              <span
                className="wine-author"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`testimonials.${index}.author`, e.target.textContent)}
              >
                – {testimonial.author}
              </span>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="wine-footer">
        <div className="wine-footer-content">
          <div className="wine-footer-logo">
            <img src="https://farmfolio-webapp-f7ehgcehfvejeue6.uksouth-01.azurewebsites.net/farmfolio.png" alt="logo" />
          </div>
          <div className="wine-contact-info">
            <p>
              <strong>Email:</strong> <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick('contactEmail', e.target.textContent)}
              >
                {templateData.contactEmail}
              </span>
            </p>
            <p>
              <strong>Phone:</strong> <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick('contactPhone', e.target.textContent)}
              >
                {templateData.contactPhone}
              </span>
            </p>
            <p>
              <strong>Location:</strong> <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick('contactLocation', e.target.textContent)}
              >
                {templateData.contactLocation}
              </span>
            </p>
          </div>
          <div className="wine-socials">
            <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Twitter</a>
          </div>
        </div>
        <p className="wine-footer-bottom">&copy; 2025 Château d'Élégance. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default WineTemplate;
