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
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche la soumission par défaut
    
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;
    
    // Change le texte du bouton pendant l'envoi
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      
      const response = await fetch('https://formsubmit.co/matynext@outlook.com', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        // Succès
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        submitButton.style.backgroundColor = '#28a745';
        contactForm.reset();
        
        // Affiche un message de confirmation
        showConfirmationMessage('Merci ! Votre message a été envoyé avec succès. Je vous répondrai bientôt.');
        
        // Remet le bouton à l'état initial après 3 secondes
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.style.backgroundColor = '';
          submitButton.disabled = false;
        }, 3000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur d\'envoi';
      submitButton.style.backgroundColor = '#dc3545';
      
      showConfirmationMessage('Désolé, une erreur s\'est produite. Veuillez réessayer ou me contacter directement à matynext@outlook.com');
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.style.backgroundColor = '';
        submitButton.disabled = false;
      }, 3000);
    }
  });
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

