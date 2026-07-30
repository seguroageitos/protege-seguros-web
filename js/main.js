// TODO: reemplazar por el número real (formato: código país + área + número, sin + ni espacios, ej: 5491123456789)
const WHATSAPP_NUMBER = '5491100000000';

// Todo elemento con data-wa-msg se convierte automáticamente en un link a WhatsApp.
// Cambiar el número de arriba actualiza TODOS los botones/tarjetas del sitio.
document.querySelectorAll('[data-wa-msg]').forEach(el => {
  const text = encodeURIComponent(el.getAttribute('data-wa-msg'));
  el.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.hero-copy, .hero-visual, .section-head, .quote-card, .sobre-visual, .sobre-copy, .product-card, .contact-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ===================================================================
// COTIZADOR — wizard de Auto / Moto (3 pasos, termina en WhatsApp)
// ===================================================================

// Listas de marcas separadas por tipo de vehículo (no se mezclan autos y motos).
// Si la marca no está en la lista, "Otra (no está en la lista)" habilita un
// campo de texto para escribirla a mano. Lo mismo pasa con el modelo.
const BRANDS = {
  auto: [
    'Alfa Romeo', 'Audi', 'BMW', 'BYD', 'Changan', 'Chery', 'Chevrolet',
    'Chrysler', 'Citroën', 'Dodge', 'DS', 'Fiat', 'Ford', 'Geely', 'GWM',
    'Haval', 'Honda', 'Hyundai', 'Isuzu', 'JAC', 'Jeep', 'JMC', 'Kia',
    'Land Rover', 'Lifan', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan',
    'Peugeot', 'RAM', 'Renault', 'SsangYong', 'Subaru', 'Suzuki', 'Toyota',
    'Volkswagen', 'Volvo'
  ],
  moto: [
    'Bajaj', 'Benelli', 'Beta', 'BMW Motorrad', 'Corven', 'Ducati', 'Gilera',
    'Guerrero', 'Harley-Davidson', 'Honda', 'Husqvarna', 'Kawasaki', 'Keeway',
    'KTM', 'Mondial', 'Motomel', 'Royal Enfield', 'Suzuki', 'TVS', 'Yamaha',
    'Zanella'
  ]
};

// Modelos y versiones frecuentes por marca (dataset propio, no oficial ni
// conectado a una base de datos real de vehículos). Las marcas más comunes
// tienen versiones/equipamientos específicos (LS, LT, LTZ, Premier, etc.);
// el resto tiene modelos base. Si algo no está listado, el usuario lo escribe
// directamente en el campo — no está limitado a la lista.
const MODELS = {
  auto: {
    'Chevrolet': [
      'Onix LS 1.2', 'Onix LT 1.2', 'Onix LTZ 1.0 Turbo', 'Onix Premier 1.0 Turbo',
      'Onix Plus LT', 'Onix Plus LTZ', 'Onix Plus Premier',
      'Cruze LT', 'Cruze Premier',
      'Tracker LS', 'Tracker LT', 'Tracker LTZ', 'Tracker Premier',
      'S10 LS', 'S10 LT', 'S10 LTZ', 'S10 High Country',
      'Spin LT', 'Spin Premier', 'Prisma LT', 'Prisma LTZ'
    ],
    'Volkswagen': [
      'Gol Trend Trendline', 'Gol Trend Comfortline',
      'Polo Trendline', 'Polo Comfortline', 'Polo Highline',
      'Virtus Trendline', 'Virtus Comfortline', 'Virtus Highline',
      'Vento Trendline', 'Vento Highline',
      'T-Cross Trendline', 'T-Cross Comfortline', 'T-Cross Highline',
      'Taos Trendline', 'Taos Highline',
      'Amarok Trendline', 'Amarok Comfortline', 'Amarok Highline', 'Amarok V6 Extreme',
      'Nivus Comfortline', 'Nivus Highline'
    ],
    'Ford': [
      'Ka S', 'Ka SE', 'Ka SEL',
      'Fiesta S', 'Fiesta SE',
      'EcoSport S', 'EcoSport SE', 'EcoSport Titanium', 'EcoSport Storm',
      'Ranger XL', 'Ranger XLS', 'Ranger XLT', 'Ranger Limited', 'Ranger Raptor',
      'Territory SE', 'Territory Titanium'
    ],
    'Fiat': [
      'Cronos Like', 'Cronos Drive', 'Cronos Precision',
      'Argo Drive', 'Argo Trekking', 'Argo HGT',
      'Mobi Easy', 'Mobi Like', 'Mobi Trekking',
      'Pulse Drive', 'Pulse Audace', 'Pulse Abarth',
      'Toro Freedom', 'Toro Volcano', 'Toro Ranch', 'Toro Ultra',
      'Strada Endurance', 'Strada Freedom', 'Strada Volcano'
    ],
    'Toyota': [
      'Corolla XLI', 'Corolla XEI', 'Corolla SEG', 'Corolla Hybrid',
      'Corolla Cross XLI', 'Corolla Cross XEI', 'Corolla Cross SEG', 'Corolla Cross Hybrid',
      'Etios X', 'Etios XLS',
      'Hilux DX', 'Hilux SR', 'Hilux SRV', 'Hilux SRX', 'Hilux GR-Sport',
      'SW4 SR', 'SW4 SRV', 'SW4 Diamond', 'Yaris XS', 'Yaris XLS'
    ],
    'Renault': [
      'Sandero Life', 'Sandero Zen', 'Sandero Intens',
      'Logan Life', 'Logan Zen', 'Kwid Life', 'Kwid Zen', 'Kwid Iconic',
      'Duster Iconic', 'Duster Techroad', 'Duster Iconic Plus',
      'Alaskan Intens', 'Alaskan Iconic', 'Stepway Iconic', 'Oroch Iconic'
    ],
    'Peugeot': [
      '208 Active', '208 Allure', '208 GT',
      '2008 Active', '2008 Allure', '2008 GT',
      '3008 Allure', '3008 GT', 'Partner Confort', '408 Allure', '408 GT'
    ],
    'Honda': ['HR-V LX', 'HR-V EX', 'HR-V Touring', 'Civic EX', 'Civic Touring', 'City LX', 'City EX', 'CR-V EXL', 'Fit LX', 'WR-V LX', 'WR-V EX'],
    'Hyundai': ['HB20 Sense', 'HB20 Vision', 'HB20 Diamond', 'Creta Smart', 'Creta Style', 'Creta Prestige', 'Tucson', 'Santa Fe'],
    'Nissan': ['Versa Sense', 'Versa Advance', 'Versa Exclusive', 'Kicks Sense', 'Kicks Advance', 'Kicks Exclusive', 'Frontier S', 'Frontier LE'],
    'Jeep': ['Renegade Sport', 'Renegade Longitude', 'Renegade Trailhawk', 'Compass Longitude', 'Compass Limited', 'Compass Trailhawk', 'Commander Longitude', 'Commander Limited'],
    'Citroën': ['C3 Live', 'C3 Feel', 'C3 Shine', 'C3 Aircross', 'C4 Cactus Live', 'C4 Cactus Feel', 'Berlingo'],
    'Mercedes-Benz': ['Clase A 200', 'Clase A 250', 'Clase C 200', 'GLA 200', 'GLA 250', 'Sprinter', 'Vito'],
    'Mitsubishi': ['L200 GLS', 'L200 GLS-R', 'L200 Outdoor', 'ASX', 'Outlander', 'Eclipse Cross'],
    'Kia': ['Sportage LX', 'Sportage EX', 'Rio', 'Cerato', 'Seltos'],
    'Suzuki': ['Fronx', 'Swift', 'Vitara'],
    'Chery': ['Tiggo 2 Comfort', 'Tiggo 2 Luxury', 'Tiggo 4 Comfort', 'Tiggo 4 Luxury', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 5'],
    'Changan': ['CS35 Plus', 'CS55 Plus', 'Alsvin', 'Hunter'],
    'Haval': ['H6', 'Jolion', 'H2'],
    'GWM': ['Poer', 'Tank 300', 'Haval H6'],
    'Alfa Romeo': ['Giulia', 'Stelvio'],
    'Audi': ['A3', 'A4', 'Q3', 'Q5'],
    'BMW': ['Serie 1', 'Serie 3', 'X1', 'X3'],
    'BYD': ['Dolphin', 'Song Plus', 'Yuan Plus', 'Han'],
    'Chrysler': ['300C', 'Grand Caravan'],
    'Dodge': ['Journey'],
    'DS': ['DS3', 'DS4', 'DS7'],
    'Geely': ['Coolray', 'Emgrand', 'Azkarra'],
    'Isuzu': ['D-Max', 'MU-X'],
    'JAC': ['T40', 'T60', 'S2', 'e-JS4'],
    'JMC': ['Vigus Pro'],
    'Land Rover': ['Discovery Sport', 'Defender', 'Range Rover Evoque'],
    'Lifan': ['X60', 'Foison'],
    'MINI': ['Cooper', 'Countryman'],
    'RAM': ['1500', '2500', '700'],
    'SsangYong': ['Korando', 'Rexton', 'Musso'],
    'Subaru': ['Forester', 'XV', 'Outback'],
    'Volvo': ['XC40', 'XC60', 'XC90']
  },
  moto: {
    'Honda': ['Wave 110', 'CG 150 Titan', 'CB 190R', 'XR 150', 'Biz 125', 'CB 250 Twister', 'XRE 300'],
    'Yamaha': ['YBR 125', 'FZ 25', 'FZ-S', 'MT-03', 'Crypton', 'XTZ 150', 'XTZ 250 Ténéré'],
    'Zanella': ['ZB 110', 'RX 150', 'Styler 150', 'RX 200', 'ZR 250'],
    'Motomel': ['Blitz 110', 'Skua 200', 'Skua 250', 'S2 125', 'CG150'],
    'Bajaj': ['Rouser NS200', 'Rouser 180', 'Rouser 200', 'Dominar 400', 'Pulsar'],
    'Gilera': ['Smash 110', 'VC 150', 'SMX 200', 'YL 200'],
    'Guerrero': ['Trip 110', 'GXT 200', 'G110', 'TRIAX 150'],
    'Corven': ['Triax', 'Energy 110', 'Hunter 250'],
    'Kawasaki': ['Ninja 300', 'Ninja 400', 'Z400', 'Versys 650'],
    'Suzuki': ['Gixxer 150', 'Gixxer SF 250', 'V-Strom 250', 'Best 125'],
    'KTM': ['Duke 200', 'Duke 390', 'Adventure 390'],
    'Royal Enfield': ['Classic 350', 'Meteor 350', 'Hunter 350'],
    'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Ntorq 125'],
    'Benelli': ['TRK 502', 'Leoncino 500', 'TNT 300'],
    'Beta': ['RR 300', 'Xtrainer'],
    'BMW Motorrad': ['G 310 R', 'F 850 GS'],
    'Ducati': ['Monster', 'Scrambler', 'Panigale'],
    'Harley-Davidson': ['Iron 883', 'Sportster S'],
    'Husqvarna': ['Svartpilen 401', 'Vitpilen 401'],
    'Keeway': ['TX 300', 'K-Light 200'],
    'Mondial': ['HG 200', 'RD 200']
  }
};

const modal = document.getElementById('quoteModal');

if (modal) {
  const modalVehicleType = document.getElementById('modalVehicleType');
  const wizardForm = document.getElementById('quoteWizardForm');
  const steps = Array.from(wizardForm.querySelectorAll('.wizard-step'));
  const stepCurrentEl = document.getElementById('stepCurrent');
  const progressFill = document.getElementById('progressFill');
  const backBtn = document.getElementById('wizardBack');
  const nextBtn = document.getElementById('wizardNext');
  const summaryEl = document.getElementById('wizardSummary');
  const TOTAL_STEPS = steps.length;

  const OTRA = '__otra__';

  const marcaSelect = document.getElementById('w-marca');
  const marcaOtraWrap = document.getElementById('w-marca-otra-wrap');
  const marcaOtraInput = document.getElementById('w-marca-otra');
  const modeloWrap = document.getElementById('w-modelo-wrap');
  const modeloSelect = document.getElementById('w-modelo');
  const modeloOtraWrap = document.getElementById('w-modelo-otra-wrap');
  const modeloOtraInput = document.getElementById('w-modelo-otra');

  let currentStep = 1;
  let vehicleType = 'auto';

  function fillOptions(select, values, placeholder) {
    select.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = placeholder;
    select.appendChild(ph);
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
    const otraOpt = document.createElement('option');
    otraOpt.value = OTRA;
    otraOpt.textContent = 'Otra (no está en la lista)';
    select.appendChild(otraOpt);
  }

  function resetVehicleFields() {
    fillOptions(marcaSelect, BRANDS[vehicleType], 'Seleccioná la marca');
    marcaOtraWrap.hidden = true;
    marcaOtraInput.value = '';
    modeloWrap.hidden = true;
    modeloOtraWrap.hidden = true;
    modeloOtraInput.value = '';
  }

  marcaSelect.addEventListener('change', () => {
    const marca = marcaSelect.value;
    marcaOtraWrap.hidden = marca !== OTRA;
    if (marca !== OTRA) marcaOtraInput.value = '';

    const models = MODELS[vehicleType][marca];
    if (marca === OTRA) {
      modeloWrap.hidden = true;
      modeloOtraWrap.hidden = false;
    } else if (models && models.length) {
      fillOptions(modeloSelect, models, 'Elegí un modelo');
      modeloWrap.hidden = false;
      modeloOtraWrap.hidden = true;
      modeloOtraInput.value = '';
    } else {
      modeloWrap.hidden = true;
      modeloOtraWrap.hidden = false;
    }
  });

  modeloSelect.addEventListener('change', () => {
    modeloOtraWrap.hidden = modeloSelect.value !== OTRA;
    if (modeloSelect.value !== OTRA) modeloOtraInput.value = '';
  });

  function getMarca() {
    return marcaSelect.value === OTRA ? (marcaOtraInput.value || 'A confirmar') : marcaSelect.value;
  }

  function getModelo() {
    if (!modeloWrap.hidden && modeloSelect.value && modeloSelect.value !== OTRA) return modeloSelect.value;
    return modeloOtraInput.value || '-';
  }

  function updateStepUI() {
    steps.forEach(s => { s.hidden = Number(s.dataset.step) !== currentStep; });
    stepCurrentEl.textContent = currentStep;
    progressFill.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
    backBtn.hidden = currentStep === 1;
    nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Enviar cotización por WhatsApp' : 'Siguiente →';
    const panel = modal.querySelector('.quote-modal-panel');
    if (panel) panel.scrollTop = 0;
    if (currentStep === TOTAL_STEPS) buildSummary();
  }

  function buildSummary() {
    const data = new FormData(wizardForm);
    const rows = [
      ['Vehículo', vehicleType === 'auto' ? 'Auto' : 'Moto'],
      ['Marca', getMarca() || '-'],
      ['Año', `${data.get('anio') || '-'}${data.get('es0km') ? ' (0km)' : ''}`],
      ['Modelo', getModelo()],
      ['Uso', data.get('uso')],
      ['Garage', data.get('garage') ? 'Sí' : 'No'],
      ['GNC', data.get('gnc') ? 'Sí' : 'No'],
      ['Rastreador satelital', data.get('rastreador') ? 'Sí' : 'No'],
      ['Localidad de guarda', data.get('localidad') || '-'],
      ['Nombre', data.get('nombre') || '-'],
      ['Teléfono', data.get('telefono') || '-'],
      ['Email', data.get('email') || '-'],
    ];
    summaryEl.innerHTML = rows
      .map(([k, v]) => `<div class="summary-row"><span>${k}</span><strong>${v}</strong></div>`)
      .join('');
  }

  function openWizard(type) {
    vehicleType = type;
    modalVehicleType.textContent = type === 'auto' ? 'auto' : 'moto';
    currentStep = 1;
    wizardForm.reset();
    resetVehicleFields();
    updateStepUI();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeWizard() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-wizard]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWizard(el.getAttribute('data-open-wizard'));
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeWizard);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeWizard();
  });

  backBtn.addEventListener('click', () => {
    currentStep = Math.max(1, currentStep - 1);
    updateStepUI();
  });

  nextBtn.addEventListener('click', () => {
    const activeStep = steps.find(s => Number(s.dataset.step) === currentStep);
    if (!activeStep) return;

    // Solo se valida lo que está realmente visible (se ignoran los campos
    // dentro de un contenedor con [hidden], como "Otra marca" cuando no aplica).
    const inputs = Array.from(activeStep.querySelectorAll('input, select'))
      .filter(el => !el.closest('[hidden]'));

    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      updateStepUI();
      return;
    }

    // Último paso: arma el mensaje y abre WhatsApp
    const data = new FormData(wizardForm);
    const lines = [
      `Hola! Quiero cotizar un seguro de ${vehicleType === 'auto' ? 'AUTO' : 'MOTO'}.`,
      `Marca: ${getMarca()}`,
      `Año: ${data.get('anio')}${data.get('es0km') ? ' (0km)' : ''}`,
      `Modelo: ${getModelo()}`,
      `Uso: ${data.get('uso')}`,
      `Garage: ${data.get('garage') ? 'Sí' : 'No'}`,
      `GNC: ${data.get('gnc') ? 'Sí' : 'No'}`,
      `Rastreador satelital: ${data.get('rastreador') ? 'Sí' : 'No'}`,
      data.get('localidad') ? `Localidad de guarda: ${data.get('localidad')}` : null,
      `Nombre: ${data.get('nombre')}`,
      `Teléfono: ${data.get('telefono')}`,
      data.get('email') ? `Email: ${data.get('email')}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
    closeWizard();
  });
}
