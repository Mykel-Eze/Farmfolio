// File: src/templates/templateConfig.js

export const STORY_TEMPLATES_CONFIG = [
  {
    id: 'farm-story',
    name: 'Farm Story',
    description: 'Perfect for showcasing your farm, practices, and produce',
    category: 'farm',
    thumbnail: '/templates/farm-story-thumb.png',
    preview: {
      title: 'Our Farm Story',
      subtitle: 'Sustainable farming since 1985',
      sections: [
        {
          type: 'hero',
          title: 'Welcome to [Farm Name]',
          text: 'Share your farm\'s unique story and values',
          image: null,
        },
        {
          type: 'about',
          title: 'About Us',
          text: 'Tell customers about your farming practices, history, and what makes you special',
          image: null,
        },
        {
          type: 'products',
          title: 'Our Products',
          text: 'Showcase your seasonal produce and specialty items',
          image: null,
        },
        {
          type: 'contact',
          title: 'Visit Us',
          text: 'Share your location, opening hours, and how to find you',
        }
      ]
    },
    defaultData: {
      hero: {
        title: 'Welcome to Our Farm',
        subtitle: 'Fresh, Local, Sustainable',
        image: null,
      },
      about: {
        title: 'Our Story',
        content: 'Tell your farm\'s story here...',
        image: null,
      },
      products: {
        title: 'What We Grow',
        items: [],
        image: null,
      },
      contact: {
        title: 'Visit Us',
        address: '',
        hours: '',
        phone: '',
        email: '',
      }
    }
  },
  {
    id: 'artisan-product',
    name: 'Artisan Product',
    description: 'Highlight handcrafted products and their creation process',
    category: 'artisan',
    thumbnail: '/templates/artisan-product-thumb.png',
    preview: {
      title: 'Handcrafted with Care',
      subtitle: 'Traditional methods, modern quality',
      sections: [
        {
          type: 'hero',
          title: '[Product Name]',
          text: 'Introduce your artisan product',
          image: null,
        },
        {
          type: 'process',
          title: 'How It\'s Made',
          text: 'Share your craft and the care that goes into each product',
          image: null,
        },
        {
          type: 'ingredients',
          title: 'Ingredients & Materials',
          text: 'Highlight quality ingredients or materials',
          image: null,
        },
        {
          type: 'story',
          title: 'The Maker\'s Story',
          text: 'Connect with customers through your personal journey',
        }
      ]
    },
    defaultData: {
      hero: {
        title: 'Our Artisan Product',
        subtitle: 'Handcrafted with Tradition',
        image: null,
      },
      process: {
        title: 'Our Craft',
        content: 'Describe your making process...',
        steps: [],
        image: null,
      },
      ingredients: {
        title: 'Quality Ingredients',
        list: [],
        image: null,
      },
      maker: {
        title: 'Meet the Maker',
        content: 'Share your story...',
        image: null,
      }
    }
  },
  {
    id: 'sustainability-focus',
    name: 'Sustainability Story',
    description: 'Emphasize your environmental practices and ethical approach',
    category: 'sustainable',
    thumbnail: '/templates/sustainability-thumb.png',
    preview: {
      title: 'Growing Responsibly',
      subtitle: 'For people, planet, and future generations',
      sections: [
        {
          type: 'hero',
          title: 'Our Commitment',
          text: 'Share your sustainability mission',
          image: null,
        },
        {
          type: 'practices',
          title: 'Sustainable Practices',
          text: 'Detail your environmental initiatives',
          image: null,
        },
        {
          type: 'impact',
          title: 'Our Impact',
          text: 'Show the positive difference you\'re making',
          image: null,
        },
        {
          type: 'future',
          title: 'Looking Ahead',
          text: 'Share your vision and ongoing commitments',
        }
      ]
    },
    defaultData: {
      hero: {
        title: 'Sustainable by Nature',
        subtitle: 'Our commitment to the environment',
        image: null,
      },
      practices: {
        title: 'How We Do It',
        items: [
          { icon: '🌱', title: 'Organic Methods', description: '' },
          { icon: '💧', title: 'Water Conservation', description: '' },
          { icon: '♻️', title: 'Zero Waste', description: '' },
        ],
        image: null,
      },
      impact: {
        title: 'Making a Difference',
        stats: [],
        content: '',
        image: null,
      },
      vision: {
        title: 'Our Vision',
        content: 'Share your future goals...',
      }
    }
  }
];

// Template color schemes
export const TEMPLATE_COLORS = {
  'farm-story': {
    primary: '#6B9F5E',
    secondary: '#8B7355',
    accent: '#F5DEB3',
    background: '#FEFEFE',
  },
  'artisan-product': {
    primary: '#8B6F47',
    secondary: '#D4A574',
    accent: '#E8D5C4',
    background: '#FFFAF5',
  },
  'sustainability-focus': {
    primary: '#2D6A4F',
    secondary: '#52B788',
    accent: '#95D5B2',
    background: '#F8FFF8',
  }
};

// Get template by ID
export const getTemplateById = (id) => {
  return STORY_TEMPLATES_CONFIG.find(template => template.id === id);
};

// Get all templates
export const getAllTemplates = () => {
  return STORY_TEMPLATES_CONFIG;
};

// Get templates by category
export const getTemplatesByCategory = (category) => {
  return STORY_TEMPLATES_CONFIG.filter(template => template.category === category);
};

export default STORY_TEMPLATES_CONFIG;