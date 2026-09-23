/*
  CHEMAERO configuration file
  Update social links, contact details, and chatbot endpoint in one place.
  Never expose API keys in client-side code. Use a secure server proxy or environment variable-backed endpoint.
*/
window.CHEMAERO_CONFIG = {
  siteUrl: 'https://www.chemaero.com',
  companyName: 'Chemaero Technologies',
  companyTagline: 'Advanced aerospace, propulsion, and engineered systems.',
  social: {
    linkedIn: 'https://www.linkedin.com/company/chemaero-technologies/?viewAsMember=true',
    instagram: 'https://www.instagram.com/chemaero_technologies?igsh=MndobmZmNmhpYzRj',
    email: 'chemaerotech@gmail.com',
    phone: '918780267351',
    whatsapp: '918780267351'
  },
  analytics: {
    gtagId: 'G-XXXXXXXXXX',
    clarityId: 'CLARITY_PROJECT_ID'
  },
  chatbot: {
    endpoint: '/api/chemaero-chat'
  }
};

(function applyChemaeroConfig() {
  const config = window.CHEMAERO_CONFIG;
  if (!config || !config.social) return;

  const mapping = {
    email: `mailto:${config.social.email}`,
    phone: `tel:+${config.social.phone}`,
    linkedIn: config.social.linkedIn,
    instagram: config.social.instagram,
    whatsapp: `https://wa.me/${config.social.whatsapp}?text=${encodeURIComponent('Hello CHEMAERO, I need assistance regarding your services.')}`
  };

  const updateLinks = () => {
    Object.entries(mapping).forEach(([key, href]) => {
      document.querySelectorAll(`[data-config="${key}"]`).forEach((element) => {
        if (element.tagName.toLowerCase() === 'a') {
          element.href = href;
        }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinks);
  } else {
    updateLinks();
  }
})();
