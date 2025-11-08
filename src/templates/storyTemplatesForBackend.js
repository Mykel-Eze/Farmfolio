// File: src/templates/storyTemplatesForBackend.js

/**
 * Story Templates ready for backend submission
 * Each template has 8+ sections with default content and images
 */

export const STORY_TEMPLATES_FOR_BACKEND = [
  {
    // Template 1: Artisan Beef
    storyTemplateName: "Artisan Beef",
    userCategoryId: 1, // Adjust based on your categories
    description: "Perfect for showcasing premium meat products, butchery craftsmanship, and farm-to-table stories",
    isActive: true,
    body: JSON.stringify({
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
    }),
    media: [
      'https://images.unsplash.com/photo-1690983322025-aab4f95a0269',
      'https://plus.unsplash.com/premium_photo-1726783305604-950341b0aae3',
      'https://images.unsplash.com/photo-1690983323544-026a23725551'
    ]
  },

  {
    // Template 2: Handcrafted Artisan
    storyTemplateName: "Handcrafted Artisan",
    userCategoryId: 1,
    description: "Ideal for artisan products, handcrafted goods, and makers who value authentic storytelling",
    isActive: true,
    body: JSON.stringify({
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
    }),
    media: [
      'https://images.unsplash.com/photo-1632660820654-f609bf2e83e5',
      'https://images.unsplash.com/photo-1503602642458-232111445657',
      'https://images.unsplash.com/photo-1498550744921-75f79806b8a7'
    ]
  }
];

export default STORY_TEMPLATES_FOR_BACKEND;
