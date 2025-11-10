// File: src/components/templates/index.js
import BeefTemplate from './BeefTemplate';
import ArtisanTemplate from './ArtisanTemplate';
import WineTemplate from './WineTemplate';

// Template type constants
export const TEMPLATE_TYPES = {
  STORY: 'story',
  MARKETPLACE: 'marketplace'
};

// Template ID mappings (matches backend template IDs)
export const STORY_TEMPLATES = {
  BEEF: { id: 12, name: 'Artisan Beef', component: BeefTemplate },
  ARTISAN: { id: 11, name: 'Handcrafted Artisan', component: ArtisanTemplate }
};

export const MARKETPLACE_TEMPLATES = {
  WINE: { id: 4, name: 'Premium Wine Estate', component: WineTemplate }
};

// Get template component by ID and type
export const getTemplateComponent = (templateId, type = TEMPLATE_TYPES.STORY) => {
  if (type === TEMPLATE_TYPES.STORY) {
    const template = Object.values(STORY_TEMPLATES).find(t => t.id === templateId);
    return template?.component || BeefTemplate;
  } else {
    const template = Object.values(MARKETPLACE_TEMPLATES).find(t => t.id === templateId);
    return template?.component || WineTemplate;
  }
};

export { BeefTemplate, ArtisanTemplate, WineTemplate };
