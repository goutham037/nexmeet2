document.addEventListener('DOMContentLoaded', () => {
  // Fallback if GSAP fails to load
  if (!window.gsap) {
    console.warn('GSAP not loaded, buttons will appear without animation');
    document.querySelectorAll('.btn').forEach(btn => {
      btn.style.opacity = '1';
      btn.style.transform = 'none';
    });
  }

  // Initialize Particles.js with circular particles
  if (window.particlesJS) {
    particlesJS('particles-login', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: '#FF3D6D' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true, anim: { enable: false } },
        size: { value: 8, random: true, anim: { enable: false } },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'top',
          random: true,
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: false }, onclick: { enable: false } },
        modes: {}
      },
      retina_detect: true
    });
  } else {
    console.warn('Particles.js not loaded');
  }

  // Initialize Typed.js for romantic taglines
  if (window.Typed) {
    new Typed('#typed-login', {
      strings: [
        'Find your spark.',
        'Let hearts connect.',
        'Begin a new romance.',
        'Your love journey starts here.'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });
  } else {
    console.warn('Typed.js not loaded');
    document.getElementById('typed-login').textContent = 'Find your spark.';
  }

  // GSAP Animations
  if (window.gsap) {
    gsap.from('.btn', {
      duration: 0.6,
      opacity: 0,
      y: 10,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.2
    });
    gsap.from('.input-field', {
      duration: 0.6,
      opacity: 0,
      y: 10,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.4
    });
    gsap.from('.icon', {
      duration: 0.6,
      opacity: 0,
      x: -10,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.5
    });
  }

  // Toggle Email Form Visibility
  const emailBtn = document.getElementById('emailBtn');
  const emailAuthForm = document.getElementById('emailAuthForm');
  if (emailBtn && emailAuthForm) {
    emailBtn.addEventListener('click', () => {
      const isVisible = emailAuthForm.classList.contains('visible');
      if (!isVisible) {
        emailAuthForm.classList.add('visible');
        if (window.gsap) {
          gsap.from('#emailAuthForm .input-field', {
            duration: 0.5,
            opacity: 0,
            y: 10,
            ease: 'power3.out',
            stagger: 0.1
          });
          gsap.from('#emailAuthForm .email-buttons .btn', {
            duration: 0.5,
            opacity: 0,
            y: 10,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.2
          });
        }
        emailBtn.innerHTML = '<i class="fa fa-times"></i> Close';
      } else {
        if (window.gsap) {
          gsap.to('#emailAuthForm', {
            duration: 0.5,
            opacity: 0,
            y: 10,
            ease: 'power3.in',
            onComplete: () => {
              emailAuthForm.classList.remove('visible');
              emailAuthForm.style.opacity = '';
              emailAuthForm.style.transform = '';
              emailBtn.innerHTML = '<i class="fa fa-envelope-open"></i> Use Email';
            }
          });
        } else {
          emailAuthForm.classList.remove('visible');
          emailBtn.innerHTML = '<i class="fa fa-envelope-open"></i> Use Email';
        }
      }
    });
  } else {
    console.error('Email button or form not found in DOM');
  }

  // Show Error Message
  const showError = (message) => {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      if (window.gsap) {
        gsap.fromTo(
          errorContainer,
          { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
        setTimeout(() => {
          gsap.to(errorContainer, {
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
              errorContainer.style.display = 'none';
            }
          });
        }, 3000);
      } else {
        setTimeout(() => {
          errorContainer.style.display = 'none';
        }, 3000);
      }
    }
    console.error('Error:', message);
  };

  // Firebase Auth Flows
  const anonBtn = document.getElementById('anonBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  if (!firebase.auth) {
    showError('Firebase Auth not loaded');
    console.error('Firebase Auth not loaded');
    return;
  }

  if (anonBtn) {
    anonBtn.addEventListener('click', () => {
      console.log('Anonymous sign-in clicked');
      firebase.auth().signInAnonymously()
        .then(() => {
          console.log('Anonymous sign-in successful');
          window.location.href = 'preferences.html';
        })
        .catch((error) => {
          showError('Anonymous sign-in failed: ' + error.message);
        });
    });
  } else {
    console.error('Anonymous button not found');
  }

  if (signUpBtn && emailInput && passwordInput) {
    signUpBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      console.log('Sign-up clicked', { email, password });
      if (!email || !password) {
        showError('Please enter both email and password.');
        return;
      }
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Sign-up successful');
          window.location.href = 'preferences.html';
        })
        .catch((error) => {
          showError('Sign-up failed: ' + error.message);
        });
    });
  } else {
    console.error('Sign-up button or inputs not found');
  }

  if (signInBtn && emailInput && passwordInput) {
    signInBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      console.log('Sign-in clicked', { email, password });
      if (!email || !password) {
        showError('Please enter both email and password.');
        return;
      }
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Sign-in successful');
          window.location.href = 'preferences.html';
        })
        .catch((error) => {
          showError('Sign-in failed: ' + error.message);
        });
    });
  } else {
    console.error('Sign-in button or inputs not found');
  }

  // Ensure Card Stays Centered on Resize
  window.addEventListener('resize', () => {
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
      loginContainer.style.margin = '0';
    }
  });
});