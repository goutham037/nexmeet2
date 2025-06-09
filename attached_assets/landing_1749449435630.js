// landing.js

document.addEventListener('DOMContentLoaded', () => {
  // ========== 1. Typed.js: Hero Subtitle Animation ==========
  new Typed('#typed-text', {
    strings: [
      'Meet someone special.',
      'Share your passions.',
      'Discover new connections.',
      'Begin a romantic journey.'
    ],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 2000,
    loop: true,
  });

  // ========== 2. GSAP: Hero Content Entrance Animation ==========
  gsap.from('.hero-title', {
    duration: 1.2,
    y: -50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3,
  });
  gsap.from('.hero-subtitle', {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 1.2,
  });
  gsap.from('.btn-large', {
    duration: 1.2,
    scale: 0.6,
    opacity: 0,
    ease: 'back.out(1.7)',
    delay: 2.5,
  });

  // ========== 3. ScrollReveal: Features & Blog Card Reveals ==========
  ScrollReveal().reveal('.feature-card', {
    distance: '40px',
    duration: 800,
    easing: 'ease-in-out',
    origin: 'bottom',
    interval: 200,
  });
  ScrollReveal().reveal('.blog-card', {
    distance: '30px',
    duration: 800,
    easing: 'ease-in-out',
    origin: 'bottom',
    interval: 300,
  });

  // ========== 4. Dummy Data Array for Blog Posts ==========
  const dummyBlogPosts = [
    {
      title: 'How to Break the Ice',
      excerpt:
        'Stuck on your first message? Check out these creative ice-breakers to get the conversation flowing.',
      image:
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
    {
      title: 'Guide for Introverts',
      excerpt:
        'Feeling shy? Learn how NexMeet creates a comfortable space for introverted souls to connect.',
      image:
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
    {
      title: 'Privacy & Safety',
      excerpt:
        'Your privacy is our priority. Discover how NexMeet keeps your data secure and conversations safe.',
      image:
        'https://images.unsplash.com/photo-1513173865269-5f55d118a6ae?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
    {
      title: 'Top Romantic Conversation Topics',
      excerpt:
        'Unlock deeper connections with our curated list of romantic conversation topics to share with your match.',
      image:
        'https://images.unsplash.com/photo-1532372329833-5abfdf8dab69?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
    {
      title: 'Making Lasting Friendships',
      excerpt:
        'Tips and tricks to transition a random chat into a meaningful friendship that lasts beyond one session.',
      image:
        'https://images.unsplash.com/photo-1524578271613-2ed7e3382d02?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
    {
      title: 'Virtual Date Ideas',
      excerpt:
        'From movie nights to online games—discover fun virtual date ideas to enjoy with your NexMeet partner.',
      image:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=60',
      link: '#',
    },
  ];

  // ========== 5. Populate Swiper Slides Dynamically ==========
  const swiperWrapper = document.querySelector('.swiper-wrapper');

  dummyBlogPosts.forEach((post, index) => {
    // Create slide element
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'blog-card', 'reveal');
    // Add staggered delay classes after the first three
    if (index >= 3) {
      slide.classList.add(`delay-${(index - 2)}`);
    }

    // Slide inner HTML
    slide.innerHTML = `
      <img
        src="${post.image}"
        alt="${post.title}"
        class="blog-image"
        loading="lazy"
      />
      <div class="blog-content">
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="${post.link}" class="btn btn-secondary">Read More</a>
      </div>
    `;

    swiperWrapper.appendChild(slide);
  });

  // ========== 6. Initialize Swiper.js ==========
  new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // ========== 7. Initialize Particles.js ==========
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: {
        value: 0.3,
        random: true,
        anim: { enable: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        out_mode: 'out',
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
      },
      modes: {},
    },
    retina_detect: true,
  });

  // ========== 8. Smooth Scroll & Mobile Nav Toggle ==========
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
      document.querySelector('.nav-links').classList.remove('show');
    });
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // ========== 9. “Get Started” Button Redirect ==========
  document.getElementById('getStartedBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
  });
});
