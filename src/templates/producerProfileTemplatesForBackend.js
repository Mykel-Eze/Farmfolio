// File: src/templates/producerProfileTemplatesForBackend.js

/**
 * Producer Profile Templates ready for backend submission
 * Each template has comprehensive sections for marketplace profiles
 */

export const PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND = [
  {
    // Template 1: Farm Profile
    producerProfileTemplateName: "Complete Farm Profile",
    userCategoryId: 1,
    description: "Comprehensive farm profile template for marketplace listing with all essential sections",
    isActive: true,
    location: "123 Farm Road, Green Valley, State 12345",
    latitude: 40.7128,
    longitude: -74.0060,
    body: JSON.stringify({
      template: {
        id: 'farm-profile',
        name: 'Complete Farm Profile',
        category: 'farm'
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'Green Valley Family Farm',
          subtitle: 'Sustainable farming for three generations',
          hasImage: true,
          imageType: 'cover',
          placeholder: 'Farm landscape or logo'
        },
        {
          id: 'about',
          type: 'about',
          order: 2,
          title: 'About Our Farm',
          content: 'Welcome to Green Valley Family Farm, where tradition meets innovation. For over 50 years, our family has been dedicated to sustainable farming practices, growing the freshest produce for our local community. We believe in organic methods, crop rotation, and caring for the land that feeds us all.',
          hasImage: true,
          placeholder: 'Farm or family photo'
        },
        {
          id: 'products',
          type: 'product-list',
          order: 3,
          title: 'What We Grow',
          content: 'Seasonal produce and specialty items',
          items: [
            {
              category: 'Vegetables',
              items: ['Tomatoes', 'Lettuce', 'Peppers', 'Carrots', 'Zucchini']
            },
            {
              category: 'Fruits',
              items: ['Strawberries', 'Apples', 'Peaches', 'Berries']
            },
            {
              category: 'Herbs',
              items: ['Basil', 'Rosemary', 'Thyme', 'Parsley']
            }
          ],
          hasImage: true,
          placeholder: 'Product photos'
        },
        {
          id: 'farming-practices',
          type: 'features-grid',
          order: 4,
          title: 'Our Farming Practices',
          items: [
            {
              icon: '🌱',
              title: 'Organic Methods',
              description: 'No synthetic pesticides or chemicals'
            },
            {
              icon: '♻️',
              title: 'Sustainable',
              description: 'Regenerative agriculture practices'
            },
            {
              icon: '🚜',
              title: 'Local First',
              description: 'Supporting our community'
            },
            {
              icon: '🌾',
              title: 'Quality Focused',
              description: 'Hand-picked at peak freshness'
            }
          ],
          hasImage: false
        },
        {
          id: 'certifications',
          type: 'certifications',
          order: 5,
          title: 'Certifications & Awards',
          items: [
            {
              name: 'USDA Organic Certified',
              year: '2020'
            },
            {
              name: 'Local Food Alliance Member',
              year: '2019'
            },
            {
              name: 'Best Farm Award',
              year: '2023'
            }
          ],
          hasImage: false
        },
        {
          id: 'location-info',
          type: 'location-details',
          order: 6,
          title: 'Visit Us',
          content: 'Come see where your food grows',
          fields: {
            address: '123 Farm Road, Green Valley',
            directions: 'Take Highway 1 North, exit at Green Valley Road',
            parking: 'Free parking available',
            accessibility: 'Wheelchair accessible'
          },
          hasImage: true,
          placeholder: 'Farm entrance or map'
        },
        {
          id: 'hours',
          type: 'hours-schedule',
          order: 7,
          title: 'Hours & Availability',
          schedule: {
            farmStand: {
              'Monday-Friday': '8:00 AM - 6:00 PM',
              'Saturday': '8:00 AM - 5:00 PM',
              'Sunday': '9:00 AM - 4:00 PM'
            },
            farmersMarkets: [
              {
                location: 'Downtown Farmers Market',
                day: 'Saturday',
                time: '7:00 AM - 1:00 PM'
              },
              {
                location: 'Community Market',
                day: 'Wednesday',
                time: '3:00 PM - 7:00 PM'
              }
            ]
          },
          hasImage: false
        },
        {
          id: 'contact',
          type: 'contact',
          order: 8,
          title: 'Contact Information',
          fields: {
            phone: '+1 (555) 123-4567',
            email: 'info@greenvalleyfarm.com',
            website: 'www.greenvalleyfarm.com',
            social: {
              facebook: 'greenvalleyfarm',
              instagram: '@greenvalleyfarm'
            }
          },
          hasImage: false
        },
        {
          id: 'gallery',
          type: 'photo-gallery',
          order: 9,
          title: 'Farm Gallery',
          content: 'See our farm in action',
          hasImage: true,
          imageCount: 6,
          placeholder: 'Farm photos, products, team'
        },
        {
          id: 'testimonials',
          type: 'customer-reviews',
          order: 10,
          title: 'What Customers Say',
          items: [
            {
              quote: 'Best produce in town! Always fresh and delicious.',
              author: 'Sarah M.',
              rating: 5
            },
            {
              quote: 'Love supporting a local, sustainable farm.',
              author: 'John D.',
              rating: 5
            }
          ],
          hasImage: false
        }
      ]
    }),
    media: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ]
  },
  
  {
    // Template 2: Artisan Producer Profile
    producerProfileTemplateName: "Artisan Producer Profile",
    userCategoryId: 2,
    description: "Perfect for artisan food producers, crafters, and makers showcasing handcrafted products",
    isActive: true,
    location: "456 Artisan Way, Craftville, State 67890",
    latitude: 34.0522,
    longitude: -118.2437,
    body: JSON.stringify({
      template: {
        id: 'artisan-profile',
        name: 'Artisan Producer Profile',
        category: 'artisan'
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'Heritage Artisan Cheese',
          subtitle: 'Handcrafted cheese from local milk',
          hasImage: true,
          imageType: 'cover',
          placeholder: 'Product hero image'
        },
        {
          id: 'maker-story',
          type: 'maker-bio',
          order: 2,
          title: 'Meet the Maker',
          content: 'Hi, I\'m Maria, and I\'ve been making artisan cheese for 15 years. What started as a hobby in my home kitchen has grown into a passion for creating exceptional, handcrafted cheeses using traditional methods and the finest local ingredients.',
          hasImage: true,
          placeholder: 'Maker portrait'
        },
        {
          id: 'products',
          type: 'product-showcase',
          order: 3,
          title: 'Our Products',
          items: [
            {
              name: 'Aged Cheddar',
              description: 'Sharp and complex, aged 12 months',
              price: '$18/lb',
              availability: 'Year-round'
            },
            {
              name: 'Fresh Goat Cheese',
              description: 'Creamy and mild with herb variations',
              price: '$12/8oz',
              availability: 'Year-round'
            },
            {
              name: 'Blue Cheese',
              description: 'Bold and tangy, cave-aged',
              price: '$22/lb',
              availability: 'Limited batches'
            }
          ],
          hasImage: true,
          placeholder: 'Product photos'
        },
        {
          id: 'craft-process',
          type: 'process-overview',
          order: 4,
          title: 'The Craft',
          content: 'Every wheel of cheese is made by hand using traditional techniques passed down through generations',
          steps: [
            'Source local milk daily',
            'Hand-stir and culture',
            'Hand-cut curds',
            'Mold and press',
            'Cave-age with care',
            'Hand-wrap and label'
          ],
          hasImage: true,
          placeholder: 'Process photos'
        },
        {
          id: 'ingredients',
          type: 'ingredients',
          order: 5,
          title: 'Quality Ingredients',
          items: [
            {
              name: 'Local Milk',
              source: 'Green Pastures Dairy (5 miles away)',
              description: 'Grass-fed, hormone-free'
            },
            {
              name: 'Cultures',
              source: 'Traditional cheese cultures',
              description: 'Time-tested strains'
            },
            {
              name: 'Sea Salt',
              source: 'Unrefined sea salt',
              description: 'Natural minerals'
            }
          ],
          hasImage: false
        },
        {
          id: 'awards',
          type: 'awards-recognition',
          order: 6,
          title: 'Awards & Recognition',
          items: [
            {
              year: '2024',
              award: 'Best Artisan Cheese',
              organization: 'State Fair'
            },
            {
              year: '2023',
              award: 'Gold Medal',
              organization: 'National Cheese Competition'
            }
          ],
          hasImage: false
        },
        {
          id: 'where-to-buy',
          type: 'retail-locations',
          order: 7,
          title: 'Where to Find Us',
          locations: [
            {
              type: 'Farmers Markets',
              list: [
                'Saturday Downtown Market - 8am-2pm',
                'Sunday Riverside Market - 9am-1pm'
              ]
            },
            {
              type: 'Retailers',
              list: [
                'Whole Foods Market - Cheese Section',
                'Local Food Co-op',
                'Artisan Marketplace'
              ]
            },
            {
              type: 'Online',
              list: [
                'Order through our website',
                'Local delivery available'
              ]
            }
          ],
          hasImage: false
        },
        {
          id: 'workshops',
          type: 'classes-events',
          order: 8,
          title: 'Cheese Making Workshops',
          content: 'Learn to make cheese at home',
          upcoming: [
            {
              title: 'Beginner Cheese Making',
              date: 'First Saturday of each month',
              duration: '3 hours',
              price: '$75 per person'
            },
            {
              title: 'Advanced Techniques',
              date: 'Third Saturday of each month',
              duration: '4 hours',
              price: '$125 per person'
            }
          ],
          hasImage: true,
          placeholder: 'Workshop photos'
        },
        {
          id: 'contact',
          type: 'contact',
          order: 9,
          title: 'Get in Touch',
          fields: {
            phone: '+1 (555) 234-5678',
            email: 'hello@heritagecheese.com',
            website: 'www.heritagecheese.com',
            ordering: 'Order online or call ahead for pickup',
            social: {
              instagram: '@heritagecheese',
              facebook: 'heritagecheese'
            }
          },
          hasImage: false
        },
        {
          id: 'gallery',
          type: 'photo-gallery',
          order: 10,
          title: 'Behind the Scenes',
          hasImage: true,
          imageCount: 8,
          placeholder: 'Process, products, events photos'
        }
      ]
    }),
    media: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1200',
      'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=800',
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800'
    ]
  },
  
  {
    // Template 3: Sustainable Producer Profile
    producerProfileTemplateName: "Sustainable Producer Profile",
    userCategoryId: 3,
    description: "Ideal for eco-focused producers highlighting sustainability practices and environmental impact",
    isActive: true,
    location: "789 Eco Lane, Green City, State 11111",
    latitude: 37.7749,
    longitude: -122.4194,
    body: JSON.stringify({
      template: {
        id: 'sustainable-profile',
        name: 'Sustainable Producer Profile',
        category: 'sustainable'
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          title: 'EcoHarvest Organics',
          subtitle: 'Growing food, healing the earth',
          hasImage: true,
          imageType: 'cover',
          placeholder: 'Sustainable farm landscape'
        },
        {
          id: 'mission',
          type: 'mission-statement',
          order: 2,
          title: 'Our Mission',
          content: 'We\'re on a mission to prove that farming can regenerate the earth while producing nutrient-dense food. Every practice we implement considers the long-term health of our soil, water, and community.',
          hasImage: true,
          placeholder: 'Mission visual'
        },
        {
          id: 'sustainability-practices',
          type: 'sustainability-grid',
          order: 3,
          title: 'Our Practices',
          items: [
            {
              icon: '🌱',
              title: '100% Organic',
              description: 'Certified organic since 2015',
              impact: 'Zero chemical residues'
            },
            {
              icon: '💧',
              title: 'Water Smart',
              description: 'Drip irrigation + rainwater harvest',
              impact: '70% less water usage'
            },
            {
              icon: '♻️',
              title: 'Zero Waste',
              description: 'Composting + closed-loop system',
              impact: '98% waste diverted'
            },
            {
              icon: '☀️',
              title: 'Solar Powered',
              description: '100% renewable energy',
              impact: 'Carbon negative'
            },
            {
              icon: '🐝',
              title: 'Pollinator Haven',
              description: 'Native wildflower meadows',
              impact: '200+ bee species'
            },
            {
              icon: '🌾',
              title: 'Soil Health',
              description: 'Cover crops + no-till methods',
              impact: '40% more organic matter'
            }
          ],
          hasImage: true,
          placeholder: 'Practice photos'
        },
        {
          id: 'impact-metrics',
          type: 'impact-dashboard',
          order: 4,
          title: 'Environmental Impact',
          metrics: [
            {
              value: '75,000',
              unit: 'lbs',
              label: 'CO₂ Sequestered',
              period: 'annually'
            },
            {
              value: '2M',
              unit: 'gallons',
              label: 'Water Saved',
              period: 'per year'
            },
            {
              value: '50',
              unit: 'acres',
              label: 'Land Regenerated',
              period: 'total'
            },
            {
              value: '100',
              unit: '%',
              label: 'Renewable Energy',
              period: 'since 2022'
            }
          ],
          hasImage: false
        },
        {
          id: 'certifications',
          type: 'certifications-detailed',
          order: 5,
          title: 'Certifications',
          items: [
            {
              name: 'USDA Organic',
              certifier: 'Oregon Tilth',
              year: '2015',
              scope: 'All crops and products'
            },
            {
              name: 'Regenerative Organic Certified',
              certifier: 'ROC',
              year: '2021',
              scope: 'Gold level - Soil, Animal, Social'
            },
            {
              name: 'Salmon-Safe',
              certifier: 'Salmon-Safe',
              year: '2019',
              scope: 'Water and habitat protection'
            },
            {
              name: 'B Corporation',
              certifier: 'B Lab',
              year: '2023',
              scope: 'Social and environmental performance'
            }
          ],
          hasImage: false
        },
        {
          id: 'products-seasonal',
          type: 'seasonal-products',
          order: 6,
          title: 'Seasonal Offerings',
          seasons: {
            spring: ['Asparagus', 'Peas', 'Lettuce', 'Radishes'],
            summer: ['Tomatoes', 'Peppers', 'Zucchini', 'Berries'],
            fall: ['Squash', 'Pumpkins', 'Kale', 'Apples'],
            winter: ['Root vegetables', 'Greens', 'Storage crops']
          },
          hasImage: true,
          placeholder: 'Seasonal harvest photos'
        },
        {
          id: 'community-impact',
          type: 'community-engagement',
          order: 7,
          title: 'Community Programs',
          programs: [
            {
              name: 'Farm Education',
              description: 'Free tours for school groups',
              impact: '500+ students annually'
            },
            {
              name: 'Intern Program',
              description: 'Training next generation of farmers',
              impact: '20 graduates since 2018'
            },
            {
              name: 'Food Access',
              description: 'Sliding scale CSA + food bank donations',
              impact: '10,000 lbs donated'
            }
          ],
          hasImage: true,
          placeholder: 'Community events photos'
        },
        {
          id: 'visit-info',
          type: 'visit-information',
          order: 8,
          title: 'Visit Our Farm',
          options: [
            {
              type: 'Farm Store',
              schedule: 'Tue-Sat: 9am-6pm',
              details: 'Fresh produce, eggs, value-added products'
            },
            {
              type: 'Farm Tours',
              schedule: 'Saturdays at 10am (reservation required)',
              details: 'See regenerative practices in action'
            },
            {
              type: 'CSA Pickup',
              schedule: 'Wednesdays 3-7pm',
              details: 'Weekly farm share pickups'
            }
          ],
          hasImage: false
        },
        {
          id: 'transparency',
          type: 'transparency-report',
          order: 9,
          title: 'Transparency Report',
          content: 'We believe in radical transparency about our practices',
          reports: [
            {
              year: '2024',
              title: 'Annual Sustainability Report',
              link: '#'
            },
            {
              year: '2024',
              title: 'Soil Health Report',
              link: '#'
            }
          ],
          hasImage: false
        },
        {
          id: 'contact',
          type: 'contact',
          order: 10,
          title: 'Connect With Us',
          fields: {
            phone: '+1 (555) 345-6789',
            email: 'hello@ecoharvestorganics.com',
            website: 'www.ecoharvestorganics.com',
            csa: 'Join our CSA - spaces available',
            social: {
              instagram: '@ecoharvestorganics',
              facebook: 'ecoharvestorganics',
              youtube: 'EcoHarvestTV'
            }
          },
          hasImage: false
        }
      ]
    }),
    media: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800'
    ]
  }
];

export default PRODUCER_PROFILE_TEMPLATES_FOR_BACKEND;