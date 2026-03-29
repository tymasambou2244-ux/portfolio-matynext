// Initialisation EmailJS (remplacez par vos vraies clés)
emailjs.init('rWzRk0GjeMgitQrbP'); // Remplacez par votre clé publique EmailJS

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');

    if (isOpen) {
      navLinks.querySelector('a')?.focus();
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      navToggle.focus();
    });
  });

  // Fermeture au clavier
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      navToggle.focus();
    }
  });
}

// Intersection Observer pour les animations d'entrée
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.project-card, .service-item, .tool-item').forEach(el => {
  observer.observe(el);
});

// Effet de parallax léger sur scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Parallax sur la section hero si elle existe
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.transform = `translateY(${scrollY * 0.5}px)`;
  }
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
console.log('contactForm trouvé?', contactForm); // DÉBOGAGE

if (contactForm) {
  console.log('Formulaire détecté, ajout de l\'écouteur'); // DÉBOGAGE
  contactForm.addEventListener('submit', (e) => {
    console.log('Formulaire soumis!'); // DÉBOGAGE
    e.preventDefault(); // Empêcher la soumission par défaut

    const submitButton = contactForm.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;

    // Indicateur d'envoi et désactivation du bouton
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;

    // Paramètres pour EmailJS
    const templateParams = {
      from_name: document.getElementById('userName').value,
      from_email: document.getElementById('userEmail').value,
      message: document.getElementById('userMessage').value,
      to_email: 'matynext@outlook.com' // Votre email
    };

    // Envoi via EmailJS
    console.log('Données envoyées:', templateParams);
    emailjs.send('service_0cloki4', 'template_d5lth5e', templateParams)
      .then((response) => {
        console.log('Email envoyé avec succès!', response.status, response.text);
        showConfirmationMessage('✅ Votre message a été envoyé avec succès !');
        contactForm.reset(); // Réinitialiser le formulaire
      }, (error) => {
        console.error('Erreur détaillée:', error);
        showConfirmationMessage('❌ Erreur : ' + (error.text || error.message || 'Réessayez svp'));
      })
      .finally(() => {
        // Restaurer le bouton
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      });
  });
} else {
  console.error('❌ Formulaire contactForm non trouvé!');
}

// Fonction pour afficher un message de confirmation
function showConfirmationMessage(message) {
  // Supprime les anciens messages
  const existingMessage = document.querySelector('.confirmation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crée un nouveau message
  const messageDiv = document.createElement('div');
  messageDiv.className = 'confirmation-message';
  messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
  
  // Insère après le formulaire
  const contactSection = document.querySelector('.contact-section');
  contactSection.insertBefore(messageDiv, contactSection.querySelector('.contact-info'));
}

