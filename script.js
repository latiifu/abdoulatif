// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Éléments du DOM
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const submitBtn = emailForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    
    // Animation d'entrée progressive pour les éléments
    function animateElements() {
        const elements = document.querySelectorAll('.welcome-section, .email-signup, .social-links, .whatsapp-section');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Validation de l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Afficher le message d'erreur
    function showError(message) {
        // Supprimer l'ancien message d'erreur s'il existe
        const existingError = emailForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            padding: 1rem;
            color: #ef4444;
            font-weight: 500;
            margin-top: 1rem;
            animation: slideInUp 0.5s ease-out;
        `;
        errorDiv.textContent = message;
        
        emailForm.appendChild(errorDiv);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }
    
    // Simuler l'envoi du formulaire
    function simulateFormSubmission(email) {
        return new Promise((resolve) => {
            // Simuler un délai de réseau
            setTimeout(() => {
                // Simuler un succès (vous pouvez ajouter une vraie logique ici)
                resolve({ success: true });
            }, 1500);
        });
    }
    
    // Gestion du formulaire d'email
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validation
        if (!email) {
            showError('Veuillez saisir votre adresse email.');
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Veuillez saisir une adresse email valide.');
            emailInput.focus();
            return;
        }
        
        // Désactiver le formulaire pendant l'envoi
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btnLoading.textContent = 'Inscription...';
        emailInput.disabled = true;
        
        try {
            const result = await simulateFormSubmission(email);
            
            if (result.success) {
                // Masquer le formulaire et afficher le message de succès
                emailForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Ajouter une animation de confettis (effet visuel)
                createConfetti();
                
                // Optionnel : envoyer les données à un service réel
                // await sendToEmailService(email);
                
            } else {
                throw new Error('Erreur lors de l\'inscription');
            }
        } catch (error) {
            showError('Une erreur est survenue. Veuillez réessayer.');
            
            // Réactiver le formulaire
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            emailInput.disabled = false;
        }
    });
    
    // Effet de confettis simple
    function createConfetti() {
        const colors = ['#0868F8', '#25d366', '#22c55e', '#ffffff', '#a1a1aa'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                // Supprimer l'élément après l'animation
                setTimeout(() => confetti.remove(), 5000);
            }, i * 50);
        }
    }
    
    // Animation CSS pour les confettis
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
    
    // Effet de parallaxe léger sur le scroll
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.email-signup, .social-links');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Effet de hover sur les liens sociaux
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });
    
    // Effet de typing sur le titre principal
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Appliquer l'effet de typing au titre d'accueil
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        const originalText = welcomeTitle.textContent;
        setTimeout(() => {
            typeWriter(welcomeTitle, originalText, 50);
        }, 1000);
    }
    
    // Gestion du focus pour l'accessibilité
    emailInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(8, 104, 248, 0.1)';
    });
    
    emailInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = 'none';
    });
    
    // Démarrer les animations
    setTimeout(animateElements, 500);
    
    // Gestion des erreurs globales
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.error);
    });
    
    // Performance: Précharger les images importantes
    function preloadImages() {
        const imageUrls = [
            // Ajoutez ici les URLs des images importantes si nécessaire
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    preloadImages();
    
    // Fonction utilitaire pour envoyer l'email à un service réel (à implémenter)
    async function sendToEmailService(email) {
        // Exemple d'intégration avec un service d'email
        /*
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });
            
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            throw error;
        }
        */
    }
    
    // Détection de la connexion réseau
    function handleConnectionChange() {
        if (navigator.onLine) {
            console.log('Connexion rétablie');
        } else {
            console.log('Connexion perdue');
            showError('Connexion internet requise pour l\'inscription.');
        }
    }
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    console.log('🚀 Page Coming Soon initialisée avec succès!');
});

