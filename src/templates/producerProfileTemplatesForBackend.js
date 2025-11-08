// File: src/templates/producerProfileTemplatesForBackend.js

/**
 * Producer Profile Templates ready for backend submission
 */

export const PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND = [
  {
    // Template 1: Premium Wine Estate
    producerProfileTemplateName: "Premium Wine Estate",
    userCategoryId: 1, // Adjust based on your categories
    description: "Perfect for wineries, vineyards, and premium beverage producers",
    location: "Bordeaux, France",
    latitude: 44.8378,
    longitude: -0.5792,
    isActive: true,
    body: JSON.stringify({
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
    }),
    media: [
      'https://plus.unsplash.com/premium_photo-1683141424343-60a8b9639309',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      'https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5'
    ]
  }
];

export default PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND;
