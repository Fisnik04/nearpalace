// Vendos datën minimale = sot (nuk lejohen datat e kaluara)
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

// Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    mobileMenuBtn.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
  });

  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      mobileMenuBtn.textContent = '☰';
    });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  reveals.forEach(r => observer.observe(r));

  // Menu tabs
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // 360 drag simulation
  const pano = document.getElementById('panorama');
  let isDragging = false, startX = 0, currentPos = 50;

  pano.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; pano.style.cursor = 'grabbing'; });
  window.addEventListener('mouseup', () => { isDragging = false; pano.style.cursor = 'grab'; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const delta = (e.clientX - startX) * 0.08;
    startX = e.clientX;
    currentPos = Math.max(0, Math.min(100, currentPos - delta));
    pano.querySelector('.panorama-bg').style.backgroundPosition = currentPos + '% center';
  });

  pano.style.cursor = 'grab';

  // Form submit via Web3Forms
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      const toast = document.getElementById('toast');
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Duke dërguar...';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
          toast.textContent = '✓ Rezervimi u dërgua me sukses!';
          toast.classList.add('show');
          form.reset();
        } else {
          console.log(response);
          toast.textContent = '❌ Pati një problem: ' + jsonRes.message;
          toast.classList.add('show');
        }
      })
      .catch(error => {
        console.log(error);
        toast.textContent = '❌ Diçka shkoi keq!';
        toast.classList.add('show');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        setTimeout(() => toast.classList.remove('show'), 4000);
      });
    });
  }