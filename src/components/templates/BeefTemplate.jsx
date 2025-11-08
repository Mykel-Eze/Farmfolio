// File: src/components/templates/BeefTemplate.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BeefTemplate.css';

gsap.registerPlugin(ScrollTrigger);

const BeefTemplate = ({ data, isEditMode = false, onEdit }) => {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const fileInputRef = useRef(null);
  const [currentImageField, setCurrentImageField] = useState(null);

  // Parse data from backend (JSON string)
  const content = typeof data?.body === 'string' ? JSON.parse(data.body) : data?.body || {};

  // Default content structure
  const defaultContent = {
    heroTitle: 'PrimeCuts',
    heroSubtitle: 'Hand-crafted artisan beef — where flavor meets tradition.',
    heroImage: 'https://images.unsplash.com/photo-1690983322025-aab4f95a0269',
    aboutTitle: 'Our Story',
    aboutText: "At PrimeCuts, we've spent decades perfecting the art of premium beef crafting...",
    processTitle: 'Our Process',
    steps: [
      {
        title: 'Farm to Table',
        text: 'We partner with ethical ranchers to raise cattle naturally and sustainably.',
        image: 'https://plus.unsplash.com/premium_photo-1726783305604-950341b0aae3'
      },
      {
        title: 'Dry Aging',
        text: 'Our beef is aged for up to 45 days to bring out deep, savory flavors.',
        image: 'https://plus.unsplash.com/premium_photo-1668616817378-a40921e765ed'
      },
      {
        title: 'Handcrafted Cuts',
        text: 'Each cut is expertly carved by artisans for a perfect dining experience.',
        image: 'https://images.unsplash.com/photo-1690983323540-d6e889c4b107'
      }
    ],
    collectionTitle: 'Signature Cuts',
    products: [
      {
        name: 'Ribeye Supreme',
        image: 'https://images.unsplash.com/photo-1690983323544-026a23725551'
      },
      {
        name: 'T-Bone Masterpiece',
        image: 'https://plus.unsplash.com/premium_photo-1663012872761-33dd73e292cc'
      },
      {
        name: 'Sirloin Heritage',
        image: 'https://images.unsplash.com/photo-1690983323540-d6e889c4b107'
      }
    ],
    recipesTitle: 'Recipes & Pairings',
    recipesText: 'Discover chef-crafted recipes that elevate your dining experience...',
    testimonials: [
      {
        quote: 'The ribeye was unbelievably tender — it melted in my mouth.',
        author: 'Sarah, Chef'
      },
      {
        quote: 'Hands down the best beef I\'ve ever had. You can taste the craftsmanship.',
        author: 'David, Restaurateur'
      },
      {
        quote: 'Their attention to detail and flavor is unmatched in the industry.',
        author: 'Emma, Food Critic'
      }
    ],
    galleryTitle: 'In the Butcher\'s Craft',
    galleryImages: [
      'https://plus.unsplash.com/premium_photo-1682129511550-6a1a403caa75',
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef',
      'https://plus.unsplash.com/premium_photo-1668616817378-a40921e765ed'
    ],
    contactEmail: 'contact@primecuts.com',
    contactPhone: '+1 (555) 987-6543',
    contactLocation: '89 PrimeCuts Lane, Paris, France'
  };

  // Merge with content from backend
  const templateData = { ...defaultContent, ...content };

  // Get media files from backend if available
  const images = data?.mediaFiles || [];

  useEffect(() => {
    if (isEditMode) return; // Skip animations in edit mode

    // Hero fade animations
    const ctx = gsap.context(() => {
      gsap.from('.beef-hero-content h1', { y: 80, opacity: 0, duration: 1 });
      gsap.from('.beef-hero-content p', { y: 50, opacity: 0, delay: 0.3, duration: 1 });
      gsap.from('.beef-hero-content a', { y: 30, opacity: 0, delay: 0.6, duration: 1 });

      // Scroll animations
      sectionsRef.current.forEach(section => {
        if (!section) return;
        const h2 = section.querySelector('h2');
        if (h2) {
          gsap.from(h2, {
            scrollTrigger: section,
            y: 80,
            opacity: 0,
            duration: 1
          });
        }

        const elements = section.querySelectorAll('p, .beef-grid, .beef-steps, blockquote');
        if (elements.length > 0) {
          gsap.from(elements, {
            scrollTrigger: section,
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2
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
    <div className={`beef-template ${isEditMode ? 'edit-mode' : ''}`}>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* Navbar */}
      <header className="beef-navbar">
        <div className="beef-logo">
          <img
            src="/farmfolio.png"
            alt="Logo"
          />
        </div>

        <Link to="/marketplace" className="marketplace-link">
          <img src="/market.png" alt="Marketplace" />
        </Link>
        {/* <div className="beef-search">
          <input type="text" id="search" placeholder="Search cuts, recipes..." />
        </div> */}
      </header>

      {/* Hero Section */}
      <section
        className="beef-hero"
        style={{
          background: `url(${addQueryParams(images[0]?.url || templateData.heroImage, '?auto=format&fit=crop&q=80&w=1170')}) center/cover no-repeat`
        }}
        ref={heroRef}
        onClick={() => handleImageClick('heroImage')}
      >
        <div className="beef-overlay"></div>
        <div className="beef-hero-content">
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
          <a href="#collection" className="beef-btn">Explore Our Cuts</a>
        </div>
      </section>

      {/* About */}
      <section
        className="beef-about"
        ref={el => sectionsRef.current[0] = el}
      >
        <div className="beef-container">
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

      {/* Process */}
      <section
        className="beef-process"
        ref={el => sectionsRef.current[1] = el}
      >
        <div className="beef-container">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('processTitle', e.target.textContent)}
          >
            {templateData.processTitle}
          </h2>
          <div className="beef-steps">
            {templateData.steps.map((step, index) => (
              <div key={index} className="beef-step">
                <img
                  src={addQueryParams(step.image, '?auto=format&fit=crop&q=80&w=400')}
                  alt={step.title}
                  onClick={() => handleImageClick(`steps.${index}.image`)}
                />
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
        </div>
      </section>

      {/* Collection */}
      <section
        id="collection"
        className="beef-collection"
        ref={el => sectionsRef.current[2] = el}
      >
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('collectionTitle', e.target.textContent)}
        >
          {templateData.collectionTitle}
        </h2>
        <div className="beef-grid">
          {templateData.products.map((product, index) => (
            <div key={index} className="beef-card">
              <img
                src={addQueryParams(product.image, '?auto=format&fit=crop&q=80&w=500')}
                alt={product.name}
                onClick={() => handleImageClick(`products.${index}.image`)}
              />
              <h3
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`products.${index}.name`, e.target.textContent)}
              >
                {product.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Recipes */}
      <section
        className="beef-recipes"
        ref={el => sectionsRef.current[3] = el}
      >
        <div className="beef-container">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('recipesTitle', e.target.textContent)}
          >
            {templateData.recipesTitle}
          </h2>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleEditClick('recipesText', e.target.textContent)}
          >
            {templateData.recipesText}
          </p>
          <a href="#" className="beef-btn">View Recipes</a>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="beef-testimonials"
        ref={el => sectionsRef.current[4] = el}
      >
        <h2>What Our Customers Say</h2>
        <div className="beef-testimonials-grid">
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
                className="beef-author"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleEditClick(`testimonials.${index}.author`, e.target.textContent)}
              >
                — {testimonial.author}
              </span>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section
        className="beef-gallery"
        ref={el => sectionsRef.current[5] = el}
      >
        <h2
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleEditClick('galleryTitle', e.target.textContent)}
        >
          {templateData.galleryTitle}
        </h2>
        <div className="beef-gallery-grid">
          {templateData.galleryImages.map((image, index) => (
            <img
              key={index}
              src={addQueryParams(image, '?auto=format&fit=crop&q=80&w=500')}
              alt={`Gallery ${index + 1}`}
              onClick={() => handleImageClick(`galleryImages.${index}`)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="beef-footer">
        <div className="beef-footer-content">
          <div className="beef-footer-logo">
            <img
              src="https://farmfolio-webapp-f7ehgcehfvejeue6.uksouth-01.azurewebsites.net/farmfolio.png"
              alt="Logo"
            />
          </div>
          <div className="beef-contact-info">
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
          <div className="beef-socials">
            <a href="#">Instagram</a> | <a href="#">Pinterest</a> | <a href="#">Facebook</a>
          </div>
        </div>
        <p className="beef-footer-bottom">&copy; 2025 PrimeCuts. Crafted with Passion.</p>
      </footer>
    </div>
  );
};

export default BeefTemplate;
