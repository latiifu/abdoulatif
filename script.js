document.addEventListener('DOMContentLoaded', function () {
    // Supabase config
    const supabaseUrl = "https://xgbzlbndjfrnqutjnuzn.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // DOM elements
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const submitBtn = emailForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');

    // Entrée progressive des éléments
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

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        const existingError = emailForm.querySelector('.error-message');
        if (existingError) existingError.remove();

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

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }

    async function submitToSupabase(email) {
        try {
            // التحقق من التكرار
            const { data: existing } = await supabase
                .from("subscribers")
                .select("*")
                .eq("email", email);
            if (existing.length > 0) {
                return { success: false, message: "Adresse email déjà inscrite." };
            }

            const { error } = await supabase
                .from("subscribers")
                .insert([{ email }]);

            if (error) {
                return { success: false, message: error.message };
            }

            return { success: true };
        } catch (e) {
            return { success: false, message: "Erreur lors de l'envoi." };
        }
    }

    emailForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

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

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btnLoading.textContent = 'Inscription...';
        emailInput.disabled = true;

        const result = await submitToSupabase(email);

        if (result.success) {
            emailForm.style.display = 'none';
            successMessage.style.display = 'block';
            createConfetti();
        } else {
            showError('❌ ' + result.message);
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            emailInput.disabled = false;
        }
    });

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
                setTimeout(() => confetti.remove(), 5000);
            }, i * 50);
        }
    }

    // Style dynamique
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

    // Parallax
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

    // Hover social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
        });
        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });

    // Typing effect
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

    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        const originalText = welcomeTitle.textContent;
        setTimeout(() => {
            typeWriter(welcomeTitle, originalText, 50);
        }, 1000);
    }

    // Focus style
    emailInput.addEventListener('focus', function () {
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(8, 104, 248, 0.1)';
    });
    emailInput.addEventListener('blur', function () {
        this.parentElement.style.boxShadow = 'none';
    });

    // Global error handling
    window.addEventListener('error', function (e) {
        console.error('Erreur JavaScript:', e.error);
    });

    // Préchargement
    function preloadImages() {
        const imageUrls = [];
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    preloadImages();
    setTimeout(animateElements, 500);

    // Connexion réseau
    function handleConnectionChange() {
        if (!navigator.onLine) {
            showError('Connexion internet requise pour l\'inscription.');
        }
    }
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    console.log('🚀 Page Coming Soon initialisée avec succès!');
});