// File: src/templates/storyTemplatesForBackend.js

/**
 * Story Templates ready for backend submission
 * Each template has 8+ sections with default content and images
 */

export const STORY_TEMPLATES_FOR_BACKEND = [
  {
    // Template 1: Farm Story
    storyTemplateName: "Farm Story",
    userCategoryId: 1, // Adjust based on your categories
    description: "Perfect for showcasing your farm, practices, and produce with a complete farm story",
    isActive: true,
    body: JSON.stringify({
      template: {
        id: 'farm-story',
        name: 'Farm Story',
        category: 'farm',
        colorScheme: {
          primary: '#6B9F5E',
          secondary: '#8B7355',
          accent: '#F5DEB3',
          background: '#FEFEFE',
        }
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'Welcome to Green Valley Farm',
          subtitle: 'Fresh, Local, Sustainable Since 1985',
          content: 'Experience the taste of true farm-fresh produce',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Farm landscape or produce hero image'
        },
        {
          id: 'about',
          type: 'text-image',
          order: 2,
          title: 'Our Story',
          content: 'For over three decades, our family has been dedicated to sustainable farming practices. We believe in growing food the right way - naturally, responsibly, and with care for the land. Every season brings new harvests, and we take pride in sharing the freshest produce with our community.',
          hasImage: true,
          imagePosition: 'right',
          placeholder: 'Family farm photo or farmers working'
        },
        {
          id: 'values',
          type: 'icon-grid',
          order: 3,
          title: 'Our Values',
          content: 'What makes us different',
          items: [
            {
              icon: '🌱',
              title: 'Organic Practices',
              description: 'No synthetic pesticides or fertilizers, just natural farming methods'
            },
            {
              icon: '🚜',
              title: 'Local Community',
              description: 'Supporting local families with fresh, healthy food'
            },
            {
              icon: '♻️',
              title: 'Sustainability',
              description: 'Caring for the land for future generations'
            },
            {
              icon: '❤️',
              title: 'Quality First',
              description: 'Hand-picked and carefully selected produce'
            }
          ],
          hasImage: false
        },
        {
          id: 'products',
          type: 'product-grid',
          order: 4,
          title: 'What We Grow',
          content: 'Seasonal fresh produce available year-round',
          hasImage: true,
          items: [
            {
              name: 'Fresh Vegetables',
              description: 'Tomatoes, lettuce, carrots, and seasonal greens',
              category: 'vegetables'
            },
            {
              name: 'Organic Fruits',
              description: 'Strawberries, apples, berries, and stone fruits',
              category: 'fruits'
            },
            {
              name: 'Herbs & Greens',
              description: 'Basil, parsley, kale, and specialty herbs',
              category: 'herbs'
            },
            {
              name: 'Root Vegetables',
              description: 'Potatoes, beets, turnips, and more',
              category: 'roots'
            }
          ],
          placeholder: 'Product images for each category'
        },
        {
          id: 'process',
          type: 'timeline',
          order: 5,
          title: 'From Seed to Harvest',
          content: 'Our farming process',
          hasImage: true,
          items: [
            {
              step: 1,
              title: 'Planting',
              description: 'Carefully selected seeds planted in nutrient-rich soil'
            },
            {
              step: 2,
              title: 'Growing',
              description: 'Natural growing with organic fertilizers and pest management'
            },
            {
              step: 3,
              title: 'Harvesting',
              description: 'Hand-picked at peak ripeness for maximum flavor'
            },
            {
              step: 4,
              title: 'Delivery',
              description: 'Fresh to your table within 24 hours of harvest'
            }
          ],
          placeholder: 'Process photos showing each step'
        },
        {
          id: 'seasons',
          type: 'text-image',
          order: 6,
          title: 'Seasonal Harvests',
          content: 'We grow with the seasons to bring you the freshest produce year-round. Spring brings tender greens and early vegetables, summer bursts with tomatoes and berries, fall delivers hearty root vegetables, and winter offers stored crops and greenhouse greens. Each season has its special offerings.',
          hasImage: true,
          imagePosition: 'left',
          placeholder: 'Seasonal produce collage'
        },
        {
          id: 'visit',
          type: 'call-to-action',
          order: 7,
          title: 'Visit Our Farm',
          content: 'Come see where your food grows! Farm tours available on weekends.',
          buttonText: 'Book a Tour',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Farm entrance or visitors photo'
        },
        {
          id: 'contact',
          type: 'contact',
          order: 8,
          title: 'Get in Touch',
          content: 'Visit us at the farm or find us at local farmers markets',
          fields: {
            address: '123 Farm Road, Green Valley',
            hours: 'Mon-Sat: 8am-6pm, Sun: 9am-4pm',
            phone: '+1 (555) 123-4567',
            email: 'hello@greenvalleyfarm.com'
          },
          hasImage: false
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          order: 9,
          title: 'What Our Customers Say',
          content: 'Loved by our community',
          items: [
            {
              quote: 'The freshest vegetables I\'ve ever tasted! You can really tell the difference.',
              author: 'Sarah M.',
              role: 'Local Customer'
            },
            {
              quote: 'Supporting Green Valley Farm means supporting sustainable agriculture. Love it!',
              author: 'John D.',
              role: 'Restaurant Owner'
            }
          ],
          hasImage: false
        }
      ],
      defaultImages: {
        hero: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
        about: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
        products: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        process: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        seasons: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        visit: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'
      }
    }),
    media: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
    ]
  },
  
  {
    // Template 2: Artisan Product
    storyTemplateName: "Artisan Product",
    userCategoryId: 1,
    description: "Highlight handcrafted products and their creation process with detailed maker story",
    isActive: true,
    body: JSON.stringify({
      template: {
        id: 'artisan-product',
        name: 'Artisan Product',
        category: 'artisan',
        colorScheme: {
          primary: '#8B6F47',
          secondary: '#D4A574',
          accent: '#E8D5C4',
          background: '#FFFAF5',
        }
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'Handcrafted Artisan Cheese',
          subtitle: 'Traditional Methods, Exceptional Taste',
          content: 'Award-winning cheese made with passion',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Hero product image'
        },
        {
          id: 'story',
          type: 'text-image',
          order: 2,
          title: 'The Maker\'s Story',
          content: 'My journey began in my grandmother\'s kitchen, watching her transform simple milk into extraordinary cheese. Twenty years later, I carry on that tradition, blending old-world techniques with modern quality standards. Every wheel of cheese tells a story of patience, skill, and dedication to the craft.',
          hasImage: true,
          imagePosition: 'left',
          placeholder: 'Maker portrait or working photo'
        },
        {
          id: 'products',
          type: 'product-showcase',
          order: 3,
          title: 'Our Collection',
          content: 'Carefully aged to perfection',
          hasImage: true,
          items: [
            {
              name: 'Aged Cheddar',
              description: 'Sharp, complex, aged 12 months',
              details: 'Rich and nutty with crystalline texture'
            },
            {
              name: 'Herb Goat Cheese',
              description: 'Fresh, creamy, infused with herbs',
              details: 'Perfect for spreading or cooking'
            },
            {
              name: 'Blue Cheese',
              description: 'Bold, tangy, cave-aged',
              details: 'For the adventurous palate'
            }
          ],
          placeholder: 'Individual product photos'
        },
        {
          id: 'process',
          type: 'step-by-step',
          order: 4,
          title: 'How It\'s Made',
          content: 'The art of cheese making',
          hasImage: true,
          items: [
            {
              step: 1,
              title: 'Fresh Milk Selection',
              description: 'We start with the finest local milk, sourced from trusted farms',
              time: 'Day 1'
            },
            {
              step: 2,
              title: 'Culturing',
              description: 'Adding carefully selected cultures and rennet',
              time: 'Day 1-2'
            },
            {
              step: 3,
              title: 'Cutting & Draining',
              description: 'Hand-cut curds and gentle whey removal',
              time: 'Day 2'
            },
            {
              step: 4,
              title: 'Molding & Pressing',
              description: 'Shaping and pressing to develop texture',
              time: 'Day 2-3'
            },
            {
              step: 5,
              title: 'Salting & Brining',
              description: 'Careful salting for flavor development',
              time: 'Day 3-7'
            },
            {
              step: 6,
              title: 'Aging',
              description: 'Cave-aged with regular turning and care',
              time: '2-12 months'
            },
            {
              step: 7,
              title: 'Quality Check',
              description: 'Tasting and grading each wheel',
              time: 'Before sale'
            },
            {
              step: 8,
              title: 'Ready to Enjoy',
              description: 'Cut and packaged at peak flavor',
              time: 'Fresh to you'
            }
          ],
          placeholder: 'Process photos'
        },
        {
          id: 'ingredients',
          type: 'ingredients-list',
          order: 5,
          title: 'Quality Ingredients',
          content: 'Simple, pure, exceptional',
          hasImage: true,
          items: [
            {
              name: 'Fresh Milk',
              description: 'From local pasture-raised cows',
              icon: '🥛'
            },
            {
              name: 'Natural Cultures',
              description: 'Traditional cheese cultures',
              icon: '🦠'
            },
            {
              name: 'Sea Salt',
              description: 'Pure, unrefined salt',
              icon: '🧂'
            },
            {
              name: 'Fresh Herbs',
              description: 'Grown in our garden',
              icon: '🌿'
            }
          ],
          placeholder: 'Ingredient photos'
        },
        {
          id: 'awards',
          type: 'achievements',
          order: 6,
          title: 'Recognition & Awards',
          content: 'Honored for quality and craftsmanship',
          items: [
            {
              year: '2024',
              award: 'Best Artisan Cheese',
              organization: 'National Cheese Awards'
            },
            {
              year: '2023',
              award: 'Gold Medal - Aged Cheddar',
              organization: 'International Cheese Competition'
            },
            {
              year: '2022',
              award: 'Artisan of the Year',
              organization: 'Local Food Alliance'
            }
          ],
          hasImage: false
        },
        {
          id: 'pairing',
          type: 'tips-grid',
          order: 7,
          title: 'Pairing Suggestions',
          content: 'Elevate your cheese experience',
          hasImage: true,
          items: [
            {
              title: 'With Wine',
              description: 'Our aged cheddar pairs beautifully with Cabernet Sauvignon',
              icon: '🍷'
            },
            {
              title: 'With Bread',
              description: 'Try our soft cheeses with crusty sourdough',
              icon: '🥖'
            },
            {
              title: 'With Fruits',
              description: 'Figs and pears complement blue cheese perfectly',
              icon: '🍐'
            },
            {
              title: 'With Honey',
              description: 'Local honey drizzled on goat cheese is divine',
              icon: '🍯'
            }
          ],
          placeholder: 'Pairing presentation photos'
        },
        {
          id: 'workshop',
          type: 'call-to-action',
          order: 8,
          title: 'Join Our Cheese Making Workshop',
          content: 'Learn the art of cheese making hands-on with expert guidance',
          buttonText: 'Book a Workshop',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Workshop or class photo'
        },
        {
          id: 'contact',
          type: 'contact',
          order: 9,
          title: 'Find Our Cheese',
          content: 'Available at select retailers and farmers markets',
          fields: {
            address: '456 Artisan Way, Craftville',
            hours: 'Tue-Sat: 10am-6pm',
            phone: '+1 (555) 234-5678',
            email: 'hello@artisancheese.com'
          },
          hasImage: false
        }
      ],
      defaultImages: {
        hero: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1200',
        story: 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=800',
        products: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800',
        process: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800'
      }
    }),
    media: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1200',
      'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=800'
    ]
  },
  
  {
    // Template 3: Sustainability Focus
    storyTemplateName: "Sustainability Story",
    userCategoryId: 1,
    description: "Emphasize environmental practices and ethical approach with comprehensive impact story",
    isActive: true,
    body: JSON.stringify({
      template: {
        id: 'sustainability-focus',
        name: 'Sustainability Story',
        category: 'sustainable',
        colorScheme: {
          primary: '#2D6A4F',
          secondary: '#52B788',
          accent: '#95D5B2',
          background: '#F8FFF8',
        }
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'Growing for Tomorrow',
          subtitle: 'Sustainable Agriculture for Future Generations',
          content: 'Our commitment to the planet',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Sustainable farm landscape'
        },
        {
          id: 'mission',
          type: 'text-image',
          order: 2,
          title: 'Our Mission',
          content: 'We believe that farming should heal the earth, not harm it. Every decision we make considers the long-term impact on our soil, water, and community. Our regenerative practices don\'t just sustain - they improve the land for future farmers.',
          hasImage: true,
          imagePosition: 'right',
          placeholder: 'Mission statement visual'
        },
        {
          id: 'practices',
          type: 'practices-grid',
          order: 3,
          title: 'Our Sustainable Practices',
          content: 'How we protect the planet',
          hasImage: true,
          items: [
            {
              icon: '🌱',
              title: 'Organic Farming',
              description: 'Zero synthetic chemicals, only natural pest and weed management',
              impact: '100% chemical-free'
            },
            {
              icon: '💧',
              title: 'Water Conservation',
              description: 'Drip irrigation and rainwater harvesting systems',
              impact: '60% less water use'
            },
            {
              icon: '♻️',
              title: 'Zero Waste',
              description: 'Composting, recycling, and circular resource management',
              impact: '95% waste diverted'
            },
            {
              icon: '🌾',
              title: 'Crop Rotation',
              description: 'Diverse planting schedules to maintain soil health',
              impact: 'Healthy soil year-round'
            },
            {
              icon: '🐝',
              title: 'Pollinator Protection',
              description: 'Native wildflower meadows and bee-friendly practices',
              impact: '3x more pollinators'
            },
            {
              icon: '⚡',
              title: 'Renewable Energy',
              description: 'Solar panels powering 100% of farm operations',
              impact: 'Carbon neutral'
            }
          ],
          placeholder: 'Practice demonstration photos'
        },
        {
          id: 'impact-stats',
          type: 'statistics',
          order: 4,
          title: 'Our Environmental Impact',
          content: 'Measurable results',
          hasImage: false,
          items: [
            {
              number: '50,000',
              unit: 'lbs',
              label: 'CO₂ Reduced Annually',
              icon: '🌍'
            },
            {
              number: '1,000,000',
              unit: 'gallons',
              label: 'Water Saved Per Year',
              icon: '💧'
            },
            {
              number: '25',
              unit: 'acres',
              label: 'Regenerated Farmland',
              icon: '🌾'
            },
            {
              number: '100',
              unit: '%',
              label: 'Renewable Energy',
              icon: '☀️'
            }
          ]
        },
        {
          id: 'biodiversity',
          type: 'text-image',
          order: 5,
          title: 'Biodiversity & Ecosystems',
          content: 'Our farm is home to over 50 species of birds, countless beneficial insects, and thriving soil microorganisms. By maintaining hedgerows, wildflower meadows, and natural water features, we create a balanced ecosystem where nature does much of the work for us.',
          hasImage: true,
          imagePosition: 'left',
          placeholder: 'Wildlife and biodiversity photos'
        },
        {
          id: 'certifications',
          type: 'certifications',
          order: 6,
          title: 'Certifications & Standards',
          content: 'Third-party verified sustainability',
          items: [
            {
              name: 'USDA Organic Certified',
              year: '2020',
              description: 'Verified organic practices and inputs'
            },
            {
              name: 'Regenerative Organic Certified',
              year: '2022',
              description: 'Gold standard for soil health and social fairness'
            },
            {
              name: 'Salmon-Safe',
              year: '2021',
              description: 'Protecting water quality and aquatic habitats'
            },
            {
              name: 'Bee Better Certified',
              year: '2023',
              description: 'Pollinator-friendly farming practices'
            }
          ],
          hasImage: false
        },
        {
          id: 'community',
          type: 'text-image',
          order: 7,
          title: 'Community & Education',
          content: 'Sustainability isn\'t just about the environment - it\'s about people too. We host school tours, offer internships, and partner with local food banks to ensure everyone has access to healthy, sustainably-grown food. Education is key to building a sustainable future.',
          hasImage: true,
          imagePosition: 'right',
          placeholder: 'Community events or education photos'
        },
        {
          id: 'future',
          type: 'timeline-future',
          order: 8,
          title: 'Our Sustainability Goals',
          content: 'Continuous improvement',
          hasImage: false,
          items: [
            {
              year: '2025',
              goal: 'Zero Emissions',
              description: 'Complete transition to electric farm equipment'
            },
            {
              year: '2026',
              goal: 'Water Positive',
              description: 'Return more clean water to watershed than we use'
            },
            {
              year: '2027',
              goal: 'Soil Carbon Banking',
              description: 'Sequester 100 tons of carbon in soil annually'
            },
            {
              year: '2030',
              goal: 'Full Circular Economy',
              description: 'Zero external inputs, 100% closed-loop system'
            }
          ]
        },
        {
          id: 'join',
          type: 'call-to-action',
          order: 9,
          title: 'Join the Movement',
          content: 'Support sustainable agriculture by choosing our products',
          buttonText: 'Learn More',
          hasImage: true,
          imagePosition: 'background',
          placeholder: 'Call to action hero image'
        },
        {
          id: 'contact',
          type: 'contact',
          order: 10,
          title: 'Get Involved',
          content: 'Visit us to see sustainability in action',
          fields: {
            address: '789 Green Earth Lane, Sustainability Valley',
            hours: 'Farm tours: Saturdays at 10am',
            phone: '+1 (555) 345-6789',
            email: 'hello@sustainablefarm.com'
          },
          hasImage: false
        }
      ],
      defaultImages: {
        hero: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200',
        mission: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        practices: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        biodiversity: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800'
      }
    }),
    media: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'
    ]
  }
];

export default STORY_TEMPLATES_FOR_BACKEND;