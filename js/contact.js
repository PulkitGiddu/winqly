export const initContactForm = () => {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;

  // ── Inline field validation ──
  const requiredFields = contactForm.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('field-error')) {
        validateField(field);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (!value) {
      isValid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
    }

    if (isValid) {
      field.classList.remove('field-error');
      field.classList.add('field-valid');
    } else {
      field.classList.add('field-error');
      field.classList.remove('field-valid');
    }

    return isValid;
  }

  // ── Form Submit ──
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let allValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }

    const submitButton = contactForm.querySelector('.form-submit');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.innerHTML = '<span class="btn-spinner"></span> Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    try {
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        service: formData.get('service'),
        message: formData.get('message')
      };
      
      // Use relative URL in production, localhost in development
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/contact'
        : '/api/contact';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage('Message sent successfully! We\'ll be in touch within 24 hours.', 'success');
        contactForm.reset();
        // Clear validation states
        requiredFields.forEach(field => {
          field.classList.remove('field-valid', 'field-error');
        });
      } else {
        showMessage('Failed to send message. Please try again or contact us directly.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again or call us at +91 8491041426.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
    }
  });
};

function showMessage(message, type) {
  // Remove any existing messages
  const existing = document.querySelector('.contact-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `contact-toast contact-toast--${type}`;
  
  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `
    <span class="contact-toast-icon">${icon}</span>
    <span class="contact-toast-text">${message}</span>
  `;

  // Inject styles once
  if (!document.getElementById('contact-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'contact-toast-styles';
    style.textContent = `
      .contact-toast {
        position: fixed;
        top: calc(var(--header-height) + 1rem);
        right: 1.5rem;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        font-family: var(--font-body);
        font-size: 0.9rem;
        z-index: 10001;
        max-width: 380px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: toastSlideIn 0.4s var(--ease-out);
        border: 1px solid transparent;
      }
      .contact-toast--success {
        background: var(--color-yellow);
        color: var(--color-bg);
        border-color: rgba(0,0,0,0.1);
      }
      .contact-toast--error {
        background: var(--color-bg-card);
        color: var(--color-text);
        border-color: rgba(196, 58, 58, 0.5);
      }
      .contact-toast-icon {
        font-weight: 800;
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      @keyframes toastSlideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
      }
      /* Field validation styles */
      .field-error {
        border-color: #c23a3a !important;
        box-shadow: 0 0 0 1px rgba(194, 58, 58, 0.3);
      }
      .field-valid {
        border-color: #25D366 !important;
      }
      .btn-spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(0,0,0,0.2);
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        vertical-align: middle;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.4s var(--ease-out) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}
