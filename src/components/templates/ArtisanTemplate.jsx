// File: src/components/templates/ArtisanTemplate.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ArtisanTemplate.css';

gsap.registerPlugin(ScrollTrigger);

const ArtisanTemplate = ({ data, isEditMode = false, onEdit }) => {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const fileInputRef = useRef(null);
  const [currentImageField, setCurrentImageField] = useState(null);

  // Parse data from backend (JSON string)
  const content = typeof data?.body === 'string' ? JSON.parse(data.body) : data?.body || {};

  // Default content structure
  const defaultContent = {
    heroTitle: 'Handcrafted with Soul',
    heroSubtitle: 'Discover timeless artisan creations made with love and precision.',
    heroImage: 'https://images.unsplash.com/photo-1632660820654-f609bf2e83e5',
    aboutTitle: 'Our Story',
    aboutText: 'At Artesano, every piece tells a story. From raw materials to refined art, our craft honors tradition, sustainability, and authenticity.',
    craftsmanshipTitle: 'The Craftsmanship',
    craftsmanshipText: 'Each product is meticulously handmade by artisans who have honed their skills for decades...',
    galleryTitle: 'Gallery',
    galleryImages: [
      'https://images.unsplash.com/photo-1503602642458-232111445657',
      'https://images.unsplash.com/photo-1498550744921-75f79806b8a7',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
    ],
    processTitle: 'Our Process',
    steps: [
      { title: '01. Inspiration', text: 'Every masterpiece begins with a vision born from nature and culture.' },
      { title: '02. Creation', text: 'With patience and care, raw materials are transformed into lasting beauty.' },
      { title: '03. Legacy', text: 'Each piece carries the soul of its maker — destined to inspire generations.' }
    ],
    testimonials: [
      { quote: "Artesano's craftsmanship is breathtaking. You can feel the dedication in every detail.", author: 'Amelia R., Interior Designer' },
      { quote: 'Each item feels alive — made not just by hand, but by heart. Truly exceptional.', author: 'James K., Art Collector' },
      { quote: 'Their pieces add warmth and soul to my home. Artisan excellence at its finest.', author: 'Sofia M., Home Stylist' }
    ],
    newsletterTitle: 'Join Our Artisan Circle',
    newsletterText: 'Be the first to know about new collections and special offers.',
    contactEmail: 'contact@artesano.com',
    contactPhone: '+1 (555) 987-6543',
    contactLocation: '89 Artisan Lane, Florence, Italy'
  };

  const templateData = { ...defaultContent, ...content };
  const images = data?.mediaFiles || [];

  useEffect(() => {
    if (isEditMode) return;

    const ctx = gsap.context(() => {
      gsap.from('.artisan-hero-content', { opacity: 0, y: 80, duration: 1.5 });

      gsap.to('.artisan-hero', {
        backgroundPositionY: '40%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.artisan-hero',
          start: 'top top',
          scrub: true
        }
      });

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
    <div className={`artisan-template ${isEditMode ? 'edit-mode' : ''}`}>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* Navbar */}
      <nav className="artisan-navbar">
        <div className="artisan-logo">
          <img src="https://farmfolio-webapp-f7ehgcehfvejeue6.uksouth-01.azurewebsites.net/farmfolio.png" alt="Logo" />
        </div>
        <div className="artisan-search-bar">
          <input type="text" placeholder="Search artisan crafts..." />
        </div>
      </nav>

      {/* Hero */}
      <section
        className="artisan-hero"
        style={{
          background: `url(${addQueryParams(images[0]?.url || templateData.heroImage, '?auto=format&fit=crop&q=80&w=1400')}) center/cover no-repeat`
        }}
        ref={heroRef}
        onClick={() => handleImageClick('heroImage')}
      >
        <div className="artisan-overlay"></div>
        <div className="artisan-hero-content">
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
          <a href="#about" className="artisan-btn">Explore Collection</a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="artisan-about" ref={el => sectionsRef.current[0] = el}>
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
      </section>

      {/* Craftsmanship */}
      <section id="craftsmanship" className="artisan-craftsmanship" ref={el => sectionsRef.current[1] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('craftsmanshipTitle', e.target.textContent)}
        >
          {templateData.craftsmanshipTitle}
        </h2>
        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('craftsmanshipText', e.target.textContent)}
        >
          {templateData.craftsmanshipText}
        </p>
      </section>

      {/* Gallery */}
      <section id="gallery" className="artisan-gallery" ref={el => sectionsRef.current[2] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('galleryTitle', e.target.textContent)}
        >
          {templateData.galleryTitle}
        </h2>
        <div className="artisan-grid">
          {templateData.galleryImages.map((image, index) => (
            <img
              key={index}
              src={addQueryParams(image, '?auto=format&fit=crop&w=800&q=80')}
              alt={`Gallery ${index + 1}`}
              onClick={() => handleImageClick(`galleryImages.${index}`)}
            />
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="artisan-process" ref={el => sectionsRef.current[3] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('processTitle', e.target.textContent)}
        >
          {templateData.processTitle}
        </h2>
        <div className="artisan-steps">
          {templateData.steps.map((step, index) => (
            <div key={index} className="artisan-step">
              <h3
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`steps.${index}.title`, e.target.textContent)}
              >
                {step.title}
              </h3>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`steps.${index}.text`, e.target.textContent)}
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="artisan-testimonials" ref={el => sectionsRef.current[4] = el}>
        <h2>What Our Customers Say</h2>
        <div className="artisan-testimonial-grid">
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
                className="artisan-author"
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

      {/* Newsletter */}
      {/* <section id="newsletter" className="artisan-newsletter" ref={el => sectionsRef.current[5] = el}>
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('newsletterTitle', e.target.textContent)}
        >
          {templateData.newsletterTitle}
        </h2>
        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('newsletterText', e.target.textContent)}
        >
          {templateData.newsletterText}
        </p>
        <form>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section> */}

      {/* Footer */}
      <footer className="artisan-footer">
        <div className="artisan-footer-content">
          <div className="artisan-footer-logo">
            <img src="https://farmfolio-webapp-f7ehgcehfvejeue6.uksouth-01.azurewebsites.net/farmfolio.png" alt="Logo" />
          </div>
          <div className="artisan-contact-info">
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
          <div className="artisan-socials">
            <a href="#">Instagram</a> | <a href="#">Pinterest</a> | <a href="#">Facebook</a>
          </div>
        </div>
        <p className="artisan-footer-bottom">&copy; 2025 Artesano. Crafted with Passion.</p>
      </footer>
    </div>
  );
};

export default ArtisanTemplate;
