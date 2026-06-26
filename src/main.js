import './style.css';

function init() {
  // 1. App Loader Dismissal
  const loader = document.getElementById('app-loader');
  if (loader) {
    // Smoothly fade out the loader after load
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 150); // Small delay to guarantee visual feedback
  }

  // 2. Feature 1: Performance-Isolated Pricing Matrix
  const PRICING_MATRIX = {
    currencies: {
      USD: { symbol: '$', rate: 1.0, tariff: 1.0 },
      EUR: { symbol: '€', rate: 0.92, tariff: 0.95 },
      INR: { symbol: '₹', rate: 83.5, tariff: 0.85 }
    },
    tiers: {
      starter: { base: 19 },
      professional: { base: 49 },
      enterprise: { base: 149 }
    }
  };

  // State Variables
  let currentCurrency = 'USD';
  let currentBilling = 'monthly';

  // Cache Pricing Text Nodes for Direct Manipulation (State Isolation)
  const priceNodes = {
    starter: {
      symbol: document.getElementById('price-starter-symbol'),
      value: document.getElementById('price-starter-value'),
      period: document.getElementById('price-starter-period')
    },
    professional: {
      symbol: document.getElementById('price-professional-symbol'),
      value: document.getElementById('price-professional-value'),
      period: document.getElementById('price-professional-period')
    },
    enterprise: {
      symbol: document.getElementById('price-enterprise-symbol'),
      value: document.getElementById('price-enterprise-value'),
      period: document.getElementById('price-enterprise-period')
    }
  };

  const currencySelect = document.getElementById('currency-select');
  const billingToggleMonthly = document.getElementById('billing-toggle-monthly');
  const billingToggleAnnual = document.getElementById('billing-toggle-annual');

  // Perform-Isolated Price Computation
  function updatePrices() {
    const currencyConfig = PRICING_MATRIX.currencies[currentCurrency];
    const discountMultiplier = currentBilling === 'annual' ? 0.80 : 1.0;
    
    for (const [tier, elements] of Object.entries(priceNodes)) {
      if (!elements.symbol || !elements.value || !elements.period) continue;
      
      const basePrice = PRICING_MATRIX.tiers[tier].base;
      const calculatedVal = Math.round(
        basePrice * currencyConfig.rate * currencyConfig.tariff * discountMultiplier
      );
      
      // Strict direct DOM node update to prevent reflows/parent renders
      if (elements.symbol.textContent !== currencyConfig.symbol) {
        elements.symbol.textContent = currencyConfig.symbol;
      }
      
      const formattedValue = String(calculatedVal);
      if (elements.value.textContent !== formattedValue) {
        elements.value.textContent = formattedValue;
      }
      
      const periodText = currentBilling === 'annual' ? '/yr' : '/mo';
      if (elements.period.textContent !== periodText) {
        elements.period.textContent = periodText;
      }
    }
  }

  // Bind Switcher Toggles
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      updatePrices();
    });
  }

  if (billingToggleMonthly && billingToggleAnnual) {
    billingToggleMonthly.addEventListener('click', () => {
      if (currentBilling === 'monthly') return;
      currentBilling = 'monthly';
      billingToggleMonthly.classList.add('active');
      billingToggleAnnual.classList.remove('active');
      billingToggleMonthly.setAttribute('aria-checked', 'true');
      billingToggleAnnual.setAttribute('aria-checked', 'false');
      updatePrices();
    });

    billingToggleAnnual.addEventListener('click', () => {
      if (currentBilling === 'annual') return;
      currentBilling = 'annual';
      billingToggleAnnual.classList.add('active');
      billingToggleMonthly.classList.remove('active');
      billingToggleAnnual.setAttribute('aria-checked', 'true');
      billingToggleMonthly.setAttribute('aria-checked', 'false');
      updatePrices();
    });
  }

  // 3. Feature 2: Bento-to-Accordion Wrapper with State Persistence
  const bentoItems = document.querySelectorAll('.bento-item');
  const accordionItems = document.querySelectorAll('.accordion-item');

  let activeBentoIndex = 0; // Default active bento item

  // Synchronizes the layout item status between desktop and mobile accordion states
  function syncActiveState(index) {
    activeBentoIndex = index;

    // Sync Bento Grid highlights (Desktop)
    bentoItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-selected');
      }
    });

    // Sync Accordion panels (Mobile)
    accordionItems.forEach((item, idx) => {
      const header = item.querySelector('.accordion-header');
      if (idx === index) {
        item.classList.add('is-open');
        if (header) header.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('is-open');
        if (header) header.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Desktop Hover triggers
  bentoItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      if (!isNaN(index)) {
        syncActiveState(index);
      }
    });
  });

  // Mobile Accordion header click triggers
  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    
    header.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      if (isNaN(index)) return;

      if (item.classList.contains('is-open')) {
        // Toggle panel off
        item.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        // Toggle this panel on & sync index
        syncActiveState(index);
      }
    });
  });

  // 4. Context Lock Constraint on Viewport Breakpoint Resize
  let isMobileLayout = window.innerWidth <= 768;

  // Use ResizeObserver for responsive width detection
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      const nowMobile = width <= 768;
      
      // If layout crossed breakpoint, sync active context smoothly
      if (nowMobile !== isMobileLayout) {
        isMobileLayout = nowMobile;
        if (isMobileLayout) {
          // Cross desktop -> mobile: Open the currently active bento item smoothly in accordion
          syncActiveState(activeBentoIndex);
        }
      }
    }
  });

  resizeObserver.observe(document.body);

  // 5. Toast Notification System
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 16px; height: 16px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75l6 6 9-13.5"/>
        </svg>
      </span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 30);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }

  // Click listeners for CTA elements
  const ctaHeader = document.getElementById('cta-header');
  if (ctaHeader) {
    ctaHeader.addEventListener('click', () => {
      showToast('Launching Syntra Management Console...');
    });
  }

  const ctaHeroPrimary = document.getElementById('cta-hero-primary');
  if (ctaHeroPrimary) {
    ctaHeroPrimary.addEventListener('click', () => {
      showToast('Redirecting to 14-day free trial registration...');
    });
  }

  const ctaHeroSecondary = document.getElementById('cta-hero-secondary');
  if (ctaHeroSecondary) {
    ctaHeroSecondary.addEventListener('click', () => {
      showToast('Opening demo calendar scheduler...');
    });
  }

  const buyStarter = document.getElementById('buy-starter-btn');
  if (buyStarter) {
    buyStarter.addEventListener('click', () => {
      showToast('Starter Plan selected. Opening checkout portal...');
    });
  }

  const buyProfessional = document.getElementById('buy-professional-btn');
  if (buyProfessional) {
    buyProfessional.addEventListener('click', () => {
      showToast('Professional Plan selected. Opening checkout portal...');
    });
  }

  const buyEnterprise = document.getElementById('buy-enterprise-btn');
  if (buyEnterprise) {
    buyEnterprise.addEventListener('click', () => {
      showToast('Enterprise query received. Routing to designated Account Manager...');
    });
  }

  // Support Clicking on Bento items on Desktop to view details
  bentoItems.forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      const title = item.querySelector('h3')?.textContent || 'Feature';
      if (!isNaN(index)) {
        syncActiveState(index);
        showToast(`Displaying details for: ${title}`);
      }
    });
  });

  // Initialize view values
  updatePrices();
  syncActiveState(activeBentoIndex);
}

// Execute or defer initialization based on document readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
