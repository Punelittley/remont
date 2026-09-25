/**
 * Main JavaScript for "Кровля & Забор" Landing Page
 * Handles: City selector, Gallery filters, Modals, Forms & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. REGIONAL CENTERS & CITY SELECTOR
     ========================================================================== */
  const regionalCenters = [
    "Вологда", "Череповец", "Ярославль", "Кострома", "Иваново", "Владимир", 
    "Тверь", "Нижний Новгород", "Пенза", "Самара", "Саратов", "Челябинск", 
    "Екатеринбург", "Воронеж", "Ростов-на-Дону", "Краснодар", "Волгоград", 
    "Ульяновск", "Казань", "Уфа", "Пермь", "Тюмень", "Рязань", "Тамбов", 
    "Липецк", "Тула", "Калуга", "Смоленск", "Архангельск", "Киров"
  ];

  let currentCity = localStorage.getItem('krisha_selected_city') || "Вологда";

  const cityElements = document.querySelectorAll('.city-text');
  const cityNameHeader = document.getElementById('currentCityName');
  const cityNameMobile = document.getElementById('currentCityNameMobile');
  const cityModal = document.getElementById('cityModal');
  const openCityModalBtn = document.getElementById('openCityModal');
  const openCityModalMobileBtn = document.getElementById('openCityModalMobile');
  const closeCityModalBtn = document.getElementById('closeCityModal');
  const cityModalOverlay = document.getElementById('cityModalOverlay');
  const citySearchInput = document.getElementById('citySearchInput');
  const citiesModalList = document.getElementById('citiesModalList');

  function updateCity(city) {
    currentCity = city;
    localStorage.setItem('krisha_selected_city', city);
    
    cityElements.forEach(el => el.textContent = city);
    if (cityNameHeader) cityNameHeader.textContent = city;
    if (cityNameMobile) cityNameMobile.textContent = city;

    // Update active state in modal list
    const buttons = citiesModalList ? citiesModalList.querySelectorAll('.city-select-card') : [];
    buttons.forEach(btn => {
      if (btn.textContent.trim() === city) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function renderCityList(filterText = '') {
    if (!citiesModalList) return;
    citiesModalList.innerHTML = '';
    const filtered = regionalCenters.filter(c => c.toLowerCase().includes(filterText.toLowerCase()));

    if (filtered.length === 0) {
      citiesModalList.innerHTML = '<div style="grid-column: 1/-1; color: #94a3b8; padding: 20px; text-align: center;">Город не найден. Выберите ближайший областной центр.</div>';
      return;
    }

    filtered.forEach(city => {
      const btn = document.createElement('button');
      btn.className = `city-select-card ${city === currentCity ? 'active' : ''}`;
      btn.textContent = city;
      btn.addEventListener('click', () => {
        updateCity(city);
        closeModal(cityModal);
        showToast('Город обновлен', `Выбран регион: ${city} и прилегающие районы`);
      });
      citiesModalList.appendChild(btn);
    });
  }

  // Initial city render
  updateCity(currentCity);
  renderCityList();

  // Search input filter
  if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
      renderCityList(e.target.value.trim());
    });
  }

  // City Chips click in contacts section
  document.querySelectorAll('.city-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const city = chip.getAttribute('data-city');
      if (city) {
        updateCity(city);
        showToast('Город обновлен', `Выбран регион: ${city}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Modal Open / Close triggers
  if (openCityModalBtn) openCityModalBtn.addEventListener('click', () => openModal(cityModal));
  if (openCityModalMobileBtn) openCityModalMobileBtn.addEventListener('click', () => {
    closeMobileDrawer();
    openModal(cityModal);
  });
  if (closeCityModalBtn) closeCityModalBtn.addEventListener('click', () => closeModal(cityModal));
  if (cityModalOverlay) cityModalOverlay.addEventListener('click', () => closeModal(cityModal));


  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  function openMobileDrawer() {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openMobileDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeMobileDrawer();
    });
  }
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileDrawer));


  /* ==========================================================================
     3. GALLERY FILTER TABS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  /* ==========================================================================
     4. MODAL SYSTEM (LEAD CAPTURE & FAST QUOTE)
     ========================================================================== */
  const leadModal = document.getElementById('leadModal');
  const closeLeadModalBtn = document.getElementById('closeLeadModal');
  const leadModalOverlay = document.getElementById('leadModalOverlay');
  const openLeadModalBtns = document.querySelectorAll('.open-lead-modal');
  const modalServiceInput = document.getElementById('modalServiceInput');
  const modalInterestSelect = document.getElementById('modalInterestSelect');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openLeadModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service') || 'Консультация инженера';
      if (modalServiceInput) modalServiceInput.value = service;
      
      // Auto select dropdown
      if (modalInterestSelect) {
        if (service.includes('заборов крыш') || service.includes('Комплекс')) modalInterestSelect.value = 'complex';
        else if (service.includes('Кров') || service.includes('Крыш')) modalInterestSelect.value = 'roof';
        else if (service.includes('Бан')) modalInterestSelect.value = 'banya';
        else if (service.includes('Забор')) modalInterestSelect.value = 'fence';
        else if (service.includes('Сайдинг')) modalInterestSelect.value = 'siding';
        else if (service.includes('Окн')) modalInterestSelect.value = 'window';
        else if (service.includes('Рассрочк')) modalInterestSelect.value = 'credit';
      }

      openModal(leadModal);
    });
  });

  if (closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', () => closeModal(leadModal));
  if (leadModalOverlay) leadModalOverlay.addEventListener('click', () => closeModal(leadModal));

  /* ----------------- SERVICE DETAIL MODAL (CLICK ON CARDS) ----------------- */
  const servicesData = {
    roof: {
      id: 'roof',
      title: 'Установка Крыш',
      fullTitle: 'Установка Крыш под ключ',
      pretitle: 'Товары и услуги',
      tag: 'Хит сезона',
      image: 'img/roof_product_2.jpg',
      lead: 'Производим установку крыш под ключ любой сложности в Вологде и области',
      bullets: [
        { bold: 'В наличии есть любой материал:', text: 'металлочерепица, профнастил, мягкая кровля, ондулин, доборные элементы напрямую с завода.' },
        { bold: 'Рассрочка кредит без первого взноса:', text: 'честная оплата частями от 1 до 12 месяцев под 0% без скрытых комиссий.' },
        { bold: 'Бесплатный выезд мастера на замер:', text: 'точный расчет сметы и подбор образцов в день обращения.' },
        { bold: 'Правильный кровельный пирог:', text: 'монтаж стропил, гидро- и пароизоляция, вентилируемый конёк и водосточная система.' }
      ],
      features: ['Металлочерепица', 'Профнастил C8/C20', 'Мягкая кровля', 'Стропильная система', 'Водостоки'],
      price: 'от 450 ₽ / м²',
      leadService: 'Установка Крыш под ключ'
    },
    complex: {
      id: 'complex',
      title: 'Крыши заборы окна сайдинг',
      fullTitle: 'Комплекс: крыши, заборы, окна и сайдинг',
      pretitle: 'Товары и услуги',
      tag: 'Комплекс под ключ',
      image: 'img/complex_turnkey_1.jpg',
      lead: 'Полная реконструкция загородного дома и участка «под ключ» с максимальной скидкой',
      bullets: [
        { bold: 'Бесплатный выезд и замер:', text: 'инженер приедет с каталогами и образцами материалов, рассчитает точную смету.' },
        { bold: 'Скидки за комплексный заказ:', text: 'дополнительная скидка до 15% при заказе кровли, забора и обшивки сайдингом.' },
        { bold: 'Рассрочка без первого взноса:', text: 'удобные ежемесячные платежи от 1 до 12 месяцев под 0%.' },
        { bold: 'Единый надежный подрядчик:', text: 'одна ответственная русская бригада, соблюдение технологий и уборка мусора.' }
      ],
      features: ['Кровля под ключ', 'Заборы и ворота', 'Сайдинг и фасады', 'Окна ПВХ', 'Скидка до 15%'],
      price: 'скидки до 15%',
      leadService: 'Установка заборов крыш окон сайдинга'
    },
    fence: {
      id: 'fence',
      title: 'Заборы, ворота и калитки',
      fullTitle: 'Монтаж заборов, ворот и калиток под ключ',
      pretitle: 'Товары и услуги',
      tag: 'Быстрый монтаж',
      image: 'img/fence_product_blue.jpg',
      lead: 'Монтаж надежных ограждений любой сложности и конфигурации с гарантией',
      bullets: [
        { bold: 'В наличии все типы ограждений:', text: 'евроштакетник (шахматка/односторонний), профнастил C8/C20, жалюзи, 3D сетка, калитки и ворота.' },
        { bold: 'Надежное заглубление и бетонирование:', text: 'бурение ям мотобуром, бетонирование столбов ниже глубины промерзания.' },
        { bold: 'Рассрочка кредит без первого взноса:', text: 'оплата удобными равными долями от 1 до 12 месяцев.' },
        { bold: 'Фурнитура и замки в комплекте:', text: 'качественные петли, врезные замки, упоры и надежные щеколды.' }
      ],
      features: ['Евроштакетник', 'Профнастил C8/C20', 'Откатные ворота', 'Бетонирование столбов'],
      price: 'от 1 100 ₽ / пог. м',
      leadService: 'Установка заборов под ключ'
    },
    siding: {
      id: 'siding',
      title: 'Устанавливаем сайдинги',
      fullTitle: 'Установка сайдинга и фасадных панелей',
      pretitle: 'Товары и услуги',
      tag: 'Любая сложность',
      image: 'img/siding_product_1.jpg',
      lead: 'Установим сайдинг любой сложности, есть в наличии любой фасадный материал',
      bullets: [
        { bold: 'Есть в наличии любой материал:', text: 'металлический под брус, виниловый, фасадные панели под кирпич и камень, цокольный сайдинг.' },
        { bold: 'Рассрочка кредит без первого взноса:', text: 'честная оплата частями от 1 до 12 месяцев под 0%.' },
        { bold: 'Монтаж надежной подсистемы:', text: 'выравнивание стен, гидро-ветрозащита, утепление базальтовой плитой.' },
        { bold: 'Идеальная геометрия углов:', text: 'аккуратные наружные и внутренние углы, наличники, откосы и подшив карнизов (софиты).' }
      ],
      features: ['Под кирпич и камень', 'Металлосайдинг брус', 'Виниловый', 'Утепление стен'],
      price: 'от 650 ₽ / м²',
      leadService: 'Установка сайдинга любой сложности'
    },
    window: {
      id: 'window',
      title: 'Окна ПВХ и остекление',
      fullTitle: 'Окна ПВХ и остекление домов и веранд',
      pretitle: 'Товары и услуги',
      tag: 'Тепло и тишина',
      image: 'img/window_product_real.jpg',
      lead: 'Энергосберегающие пластиковые окна и остекление веранд под ключ',
      bullets: [
        { bold: 'В наличии любой профиль:', text: 'Rehau, Veka, Brusbox, надежная фурнитура Roto, мультифункциональные стеклопакеты.' },
        { bold: 'Комплексный монтаж по ГОСТу:', text: 'замер, демонтаж, установка по уровню, подоконники, водоотливы, теплые откосы и москитные сетки.' },
        { bold: 'Рассрочка без первого взноса:', text: 'комфортные платежи от 1 до 12 месяцев под 0%.' },
        { bold: 'Максимальное энергосбережение:', text: 'надежная защита от холода, сквозняков, уличной пыли и постороннего шума.' }
      ],
      features: ['Двухкамерные пакеты', 'Остекление веранд', 'Теплые откосы', 'Подоконники и отливы'],
      price: 'от 4 900 ₽ / окно',
      leadService: 'Окна ПВХ и остекление'
    },
    banya: {
      id: 'banya',
      title: 'Баня БОЧКА',
      fullTitle: 'Баня БОЧКА под ключ с доставкой и сборкой',
      pretitle: 'Товары и услуги',
      tag: 'В наличии и на заказ',
      image: 'img/banya_bochka_1.jpg',
      lead: 'Изготовим Баньку по вашим размерам! Есть готовые в наличии',
      bullets: [
        { bold: 'В стоимость входит доставка и установка:', text: 'привозим спецтехникой и монтируем на участке за 1 день.' },
        { bold: 'Рассрочка кредит без первого взноса:', text: 'быстрое оформление и оплата частями от 1 до 12 месяцев.' },
        { bold: 'Полная комплектация под ключ:', text: 'дровяная печь с камнями и баком для воды, дымоход, парная, столик и лавки в комнате отдыха.' },
        { bold: 'Готова к парению в день установки:', text: 'растопите печь и наслаждайтесь горячим паром в тот же вечер.' }
      ],
      features: ['Есть готовые', 'По вашим размерам', 'Печь в комплекте', 'Монтаж за 1 день'],
      price: 'от 120 000 ₽ / комплект',
      leadService: 'Баня БОЧКА под ключ'
    }
  };

  const serviceDetailModal = document.getElementById('serviceDetailModal');
  const serviceDetailModalOverlay = document.getElementById('serviceDetailModalOverlay');
  const closeServiceDetailModalBtn = document.getElementById('closeServiceDetailModal');
  const sdmImage = document.getElementById('sdmImage');
  const sdmTag = document.getElementById('sdmTag');
  const sdmPretitle = document.getElementById('sdmPretitle');
  const sdmTitle = document.getElementById('sdmTitle');
  const sdmLead = document.getElementById('sdmLead');
  const sdmBullets = document.getElementById('sdmBullets');
  const sdmFeatures = document.getElementById('sdmFeatures');
  const sdmPrice = document.getElementById('sdmPrice');
  const sdmOrderBtn = document.getElementById('sdmOrderBtn');

  function openServiceDetail(serviceId) {
    const data = servicesData[serviceId];
    if (!data || !serviceDetailModal) return;

    if (sdmImage) {
      sdmImage.src = data.image;
      sdmImage.alt = data.title;
    }
    if (sdmTag) sdmTag.textContent = data.tag;
    if (sdmPretitle) sdmPretitle.textContent = data.pretitle;
    if (sdmTitle) sdmTitle.textContent = data.fullTitle || data.title;
    if (sdmLead) sdmLead.textContent = data.lead;
    if (sdmPrice) sdmPrice.textContent = data.price;

    if (sdmBullets) {
      sdmBullets.innerHTML = data.bullets.map(b => `
        <div class="sdm-bullet-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span><strong>${b.bold}</strong> ${b.text}</span>
        </div>
      `).join('');
    }

    if (sdmFeatures) {
      sdmFeatures.innerHTML = data.features.map(f => `<span>${f}</span>`).join('');
    }

    if (sdmOrderBtn) {
      sdmOrderBtn.onclick = () => {
        closeModal(serviceDetailModal);
        if (modalServiceInput) modalServiceInput.value = data.leadService;
        if (modalInterestSelect) modalInterestSelect.value = data.id;
        openModal(leadModal);
      };
    }

    openModal(serviceDetailModal);
  }

  // Click listener for cards and detail buttons
  document.querySelectorAll('.open-service-detail').forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not trigger modal if clicking directly on a VK link
      if (e.target.closest('a') && !e.target.closest('.btn-open-detail')) return;
      const serviceId = card.getAttribute('data-service-id');
      if (serviceId) openServiceDetail(serviceId);
    });
  });

  document.querySelectorAll('.btn-open-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceId = btn.getAttribute('data-service-id');
      if (serviceId) openServiceDetail(serviceId);
    });
  });

  if (closeServiceDetailModalBtn) closeServiceDetailModalBtn.addEventListener('click', () => closeModal(serviceDetailModal));
  if (serviceDetailModalOverlay) serviceDetailModalOverlay.addEventListener('click', () => closeModal(serviceDetailModal));

  /* ----------------- FULLSCREEN IMAGE LIGHTBOX VIEWER ----------------- */
  const imageLightboxModal = document.getElementById('imageLightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxBadge = document.getElementById('lightboxBadge');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');

  // Collect all gallery items
  const lightboxPhotos = [];
  const galleryElements = document.querySelectorAll('.gallery-item');

  galleryElements.forEach((el, index) => {
    const img = el.querySelector('.gallery-item__img');
    const badge = el.querySelector('.gallery-item__badge');
    const caption = el.querySelector('.gallery-item__caption');
    const sub = el.querySelector('.gallery-item__sub');

    const itemData = {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      badge: badge ? badge.textContent.trim() : 'Объект компании',
      title: caption ? caption.textContent.trim() : 'Фото объекта',
      desc: sub ? sub.textContent.trim() : 'Монтаж под ключ с гарантией',
      serviceName: caption ? caption.textContent.trim() : 'Монтаж объекта'
    };
    lightboxPhotos.push(itemData);

    el.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  let currentLightboxIndex = 0;

  function updateLightboxView(index) {
    if (lightboxPhotos.length === 0) return;
    currentLightboxIndex = (index + lightboxPhotos.length) % lightboxPhotos.length;
    const item = lightboxPhotos[currentLightboxIndex];

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 100);
    }

    if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxPhotos.length}`;
    if (lightboxBadge) lightboxBadge.textContent = item.badge;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;

    if (lightboxOrderBtn) {
      lightboxOrderBtn.onclick = () => {
        closeModal(imageLightboxModal);
        if (modalServiceInput) modalServiceInput.value = item.serviceName;
        openModal(leadModal);
      };
    }
  }

  function openLightbox(index = 0) {
    updateLightboxView(index);
    openModal(imageLightboxModal);
  }

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', () => closeModal(imageLightboxModal));
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', () => closeModal(imageLightboxModal));
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxView(currentLightboxIndex - 1);
  });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxView(currentLightboxIndex + 1);
  });

  // Support clicking on service modal visual image to view in lightbox
  const zoomableImages = document.querySelectorAll('.service-detail-modal__img, .bento-stats__col-image img');
  zoomableImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const foundIdx = lightboxPhotos.findIndex(item => item.src === src);
      if (foundIdx !== -1) {
        openLightbox(foundIdx);
      } else {
        if (lightboxImg) lightboxImg.src = src;
        if (lightboxCounter) lightboxCounter.textContent = '1 / 1';
        if (lightboxBadge) lightboxBadge.textContent = 'Фото объекта';
        if (lightboxTitle) lightboxTitle.textContent = img.getAttribute('alt') || 'Качественный монтаж';
        if (lightboxDesc) lightboxDesc.textContent = 'Гарантия качества по договору';
        openModal(imageLightboxModal);
      }
    });
  });

  /* ----------------- LEGAL MODALS (152-FZ, CONSENT, OFFER) ----------------- */
  const privacyModal = document.getElementById('privacyModal');
  const consentModal = document.getElementById('consentModal');
  const offerModal = document.getElementById('offerModal');

  const closePrivacyModalBtn = document.getElementById('closePrivacyModal');
  const closeConsentModalBtn = document.getElementById('closeConsentModal');
  const closeOfferModalBtn = document.getElementById('closeOfferModal');

  const privacyModalOverlay = document.getElementById('privacyModalOverlay');
  const consentModalOverlay = document.getElementById('consentModalOverlay');
  const offerModalOverlay = document.getElementById('offerModalOverlay');

  document.querySelectorAll('.open-privacy-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  document.querySelectorAll('.open-consent-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(consentModal);
    });
  });

  document.querySelectorAll('.open-offer-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(offerModal);
    });
  });

  if (closePrivacyModalBtn) closePrivacyModalBtn.addEventListener('click', () => closeModal(privacyModal));
  if (privacyModalOverlay) privacyModalOverlay.addEventListener('click', () => closeModal(privacyModal));

  if (closeConsentModalBtn) closeConsentModalBtn.addEventListener('click', () => closeModal(consentModal));
  if (consentModalOverlay) consentModalOverlay.addEventListener('click', () => closeModal(consentModal));

  if (closeOfferModalBtn) closeOfferModalBtn.addEventListener('click', () => closeModal(offerModal));
  if (offerModalOverlay) offerModalOverlay.addEventListener('click', () => closeModal(offerModal));

  /* ----------------- COOKIE NOTICE BANNER (152-FZ COMPLIANCE) ----------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookieBtn = document.getElementById('acceptCookieBtn');

  if (cookieBanner && !localStorage.getItem('krisha_cookie_accepted')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1200);
  }

  if (acceptCookieBtn) {
    acceptCookieBtn.addEventListener('click', () => {
      localStorage.setItem('krisha_cookie_accepted', '1');
      if (cookieBanner) cookieBanner.classList.remove('show');
    });
  }

  // Close modals on Escape key & Arrow navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(cityModal);
      closeModal(leadModal);
      closeModal(serviceDetailModal);
      closeModal(imageLightboxModal);
      closeModal(privacyModal);
      closeModal(consentModal);
      closeModal(offerModal);
      closeMobileDrawer();
    } else if (imageLightboxModal && imageLightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        updateLightboxView(currentLightboxIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateLightboxView(currentLightboxIndex + 1);
      }
    }
  });


  /* ==========================================================================
     5. FORMS SUBMISSION SIMULATION & NOTIFICATIONS (WITH 152-FZ CHECK)
     ========================================================================== */
  const leadModalForm = document.getElementById('leadModalForm');
  const ctaLeadForm = document.getElementById('ctaLeadForm');

  function handleFormSubmit(form, e) {
    e.preventDefault();

    // 152-FZ Consent verification
    const consentBox = form.querySelector('input[type="checkbox"]');
    if (consentBox && !consentBox.checked) {
      showToast('Требуется согласие', 'Пожалуйста, подтвердите согласие на обработку персональных данных по 152-ФЗ');
      consentBox.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Отправка...';

    // Simulate fast dispatch & lead recording
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      // Keep consent checkbox checked after reset
      if (consentBox) consentBox.checked = true;
      closeModal(leadModal);
      showToast('Заявка принята!', `Инженер по региону ${currentCity} свяжется с вами в течение 10 минут`);
    }, 600);
  }

  if (leadModalForm) {
    leadModalForm.addEventListener('submit', (e) => handleFormSubmit(leadModalForm, e));
  }

  if (ctaLeadForm) {
    ctaLeadForm.addEventListener('submit', (e) => handleFormSubmit(ctaLeadForm, e));
  }


  /* ==========================================================================
     6. TOAST NOTIFICATION
     ========================================================================== */
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toast) return;
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }


  /* ==========================================================================
     7. SCROLL EFFECTS: PROGRESS BAR, SCROLL-TO-TOP & REVEAL ANIMATIONS
     ========================================================================== */
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const header = document.getElementById('header');

  const onScroll = () => {
    const scrolled = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Reading progress line
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrolled / docHeight) * 100));
      scrollProgress.style.width = `${progress}%`;
    }

    // Header styling on scroll
    if (header) {
      if (scrolled > 30) {
        header.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrolled > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Intersection Observer for scroll animations
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay > 0) {
            setTimeout(() => {
              el.classList.add('animated');
            }, delay);
          } else {
            el.classList.add('animated');
          }
          obs.unobserve(el);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('animated'));
  }

});
