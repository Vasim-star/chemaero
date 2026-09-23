const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const pageLoader = document.querySelector('.page-loader');
const chatToggle = document.querySelectorAll('.chat-toggle');
const chatPanels = document.querySelectorAll('.chat-panel');
const chatCloseButtons = document.querySelectorAll('.chat-close');
const chatForms = document.querySelectorAll('.chat-form');
const chatSuggestions = document.querySelectorAll('.chat-suggestions');
const chatActions = document.querySelectorAll('[data-whatsapp]');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const accordionButtons = document.querySelectorAll('.accordion-button');
const newsletterForms = document.querySelectorAll('.newsletter-form');
const contactForms = document.querySelectorAll('.contact-form');
const config = window.CHEMAERO_CONFIG || {
  social: {
    linkedIn: 'https://www.linkedin.com/company/chemaero-technologies/?viewAsMember=true',
    instagram: 'https://www.instagram.com/chemaero_technologies?igsh=MndobmZmNmhpYzRj',
    email: 'chemaerotech@gmail.com',
    phone: '918780267351',
    whatsapp: '918780267351'
  },
  chatbot: {
    endpoint: '/api/chemaero-chat'
  }
};

document.documentElement.setAttribute('data-theme', 'dark');
if (themeToggle) {
  themeToggle.style.display = 'none';
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const handleChatOpen = (panel) => {
  panel.hidden = false;
  const toggle = panel.previousElementSibling;
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  panel.querySelector('.chat-body').innerHTML = '';
  panel.querySelector('#chatInput')?.focus();
};

const handleChatClose = (panel) => {
  panel.hidden = true;
  const toggle = panel.previousElementSibling;
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
};

chatToggle.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const panel = toggle.parentElement?.querySelector('.chat-panel');
    if (!panel) return;
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      handleChatOpen(panel);
    } else {
      handleChatClose(panel);
    }
  });
});

chatCloseButtons.forEach((closeBtn) => {
  closeBtn.addEventListener('click', () => {
    const panel = closeBtn.closest('.chat-panel');
    if (panel) handleChatClose(panel);
  });
});

const getChatHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('chemaero-chat-history') || '[]');
  } catch (error) {
    return [];
  }
};

const saveChatHistory = (messages) => {
  localStorage.setItem('chemaero-chat-history', JSON.stringify(messages));
};

const renderChatMessage = (container, text, role = 'assistant') => {
  const message = document.createElement('div');
  message.className = `chat-message ${role}`;
  message.textContent = text;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
};

const openWhatsApp = (message = 'Hello CHEMAERO, I need assistance regarding your services.') => {
  const url = `https://wa.me/${config.social.whatsapp}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, '_blank', 'noopener');
  if (!popup) {
    window.location.href = url;
  }
  return url;
};

const sendChatRequest = async (message) => {
  const endpoint = config.chatbot?.endpoint;

  if (!endpoint || endpoint === '/api/chemaero-chat') {
    return 'The assistant is currently unavailable on this static site. Please contact us directly on WhatsApp for immediate help.';
  }

  const payload = {
    query: message,
    context: 'CHEMAERO services, products, research, careers, contact'
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.answer || 'I’m sorry, I can’t find that information right now.';
  } catch (error) {
    return 'There was a problem contacting the assistant. Please try again or use WhatsApp.';
  }
};

const submitChatMessage = async (form) => {
  const input = form.querySelector('input[name="chatInput"]');
  const chatBody = form.closest('.chat-panel')?.querySelector('.chat-body');
  if (!input || !chatBody || !input.value.trim()) return;

  const userMessage = input.value.trim();
  renderChatMessage(chatBody, userMessage, 'user');
  input.value = '';

  const messages = getChatHistory();
  messages.push({ role: 'user', text: userMessage });
  saveChatHistory(messages);

  const endpoint = config.chatbot?.endpoint;
  const isStaticFallback = !endpoint || endpoint === '/api/chemaero-chat';

  if (isStaticFallback) {
    renderChatMessage(chatBody, 'The assistant is unavailable on this static site. Redirecting you to WhatsApp for immediate support...', 'assistant');
    openWhatsApp(`Hello CHEMAERO, I need assistance regarding: ${userMessage}`);
    messages.push({ role: 'assistant', text: 'The assistant is unavailable on this static site. Redirecting to WhatsApp for immediate support...' });
    saveChatHistory(messages);
    return;
  }

  renderChatMessage(chatBody, 'Typing...', 'assistant');

  const answer = await sendChatRequest(userMessage);
  const typingBubble = chatBody.querySelector('.chat-message.assistant:last-child');
  if (typingBubble) {
    typingBubble.textContent = answer;
  } else {
    renderChatMessage(chatBody, answer, 'assistant');
  }

  messages.push({ role: 'assistant', text: answer });
  saveChatHistory(messages);
};

chatForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitChatMessage(form);
  });
});

chatSuggestions.forEach((suggestionWrapper) => {
  suggestionWrapper.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-prompt]');
    if (!button) return;
    const prompt = button.dataset.prompt;
    const form = suggestionWrapper.closest('.chat-panel')?.querySelector('.chat-form');
    const input = form?.querySelector('input[name="chatInput"]');
    if (input) {
      input.value = prompt;
      submitChatMessage(form);
    }
  });
});

chatActions.forEach((button) => {
  button.addEventListener('click', () => {
    openWhatsApp('Hello CHEMAERO, I need assistance regarding your services.');
  });
});

const showContactFeedback = (form, message, success = true) => {
  let feedback = form.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.className = 'form-feedback';
    form.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.color = success ? '#9df2c9' : '#ff9aa1';
  feedback.style.opacity = '1';
  setTimeout(() => {
    if (feedback) {
      feedback.style.opacity = '0';
    }
  }, 5200);
};

contactForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Inquiry';
      }
      form.reset();
      showContactFeedback(form, 'Thanks! Your inquiry is ready. We’ll respond within 1–2 business days.');
    }, 900);
  });
});

accordionButtons.forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    if (panel) {
      panel.style.maxHeight = !expanded ? `${panel.scrollHeight}px` : '0px';
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      card.style.display = filter === 'all' || category === filter ? 'grid' : 'none';
    });
  });
});

if (pageLoader) {
  window.addEventListener('load', () => {
    pageLoader?.classList.add('hidden');
    setTimeout(() => {
      pageLoader?.remove();
    }, 400);
  });
}

const localMessages = getChatHistory();
if (localMessages.length > 0) {
  chatPanels.forEach((panel) => {
    const body = panel.querySelector('.chat-body');
    if (!body) return;
    body.innerHTML = '';
    localMessages.forEach((message) => renderChatMessage(body, message.text, message.role));
  });
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes particleFloat {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -24px, 0); }
}
`;
document.head.appendChild(styleSheet);

const particles = document.getElementById('particles');
if (particles) {
  const count = 60;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    const size = Math.random() * 3 + 1;
    particle.className = 'particle';
    Object.assign(particle.style, {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      background: i % 2 === 0 ? 'rgba(77,225,194,0.8)' : 'rgba(109,124,255,0.7)',
      borderRadius: '999px',
      opacity: `${Math.random() * 0.7 + 0.2}`,
      animation: `particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 3}s`
    });
    particles.appendChild(particle);
  }
}
