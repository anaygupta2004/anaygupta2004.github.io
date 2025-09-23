/**
 * Loading Spinner Module
 * Provides a reusable loading spinner with overlay for better UX
 */

class LoadingSpinner {
  constructor() {
    this.spinnerElement = null;
    this.activeCount = 0;
    this.init();
  }

  init() {
    // Create spinner HTML structure
    const spinnerHTML = `
      <div id="loading-spinner" class="spinner-overlay" role="status" aria-live="polite" aria-label="Loading">
        <div class="spinner-container">
          <div class="spinner">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle class="spinner-circle" cx="25" cy="25" r="20"></circle>
            </svg>
          </div>
          <div class="spinner-text" id="spinner-message">Loading...</div>
        </div>
      </div>
    `;

    // Add spinner to body
    document.body.insertAdjacentHTML('beforeend', spinnerHTML);
    this.spinnerElement = document.getElementById('loading-spinner');
  }

  /**
   * Show the loading spinner
   * @param {string} message - Optional custom loading message
   */
  show(message = 'Loading...') {
    if (!this.spinnerElement) {
      this.init();
    }

    this.activeCount++;

    // Update message
    const messageElement = document.getElementById('spinner-message');
    if (messageElement) {
      messageElement.textContent = message;
    }

    // Show spinner
    this.spinnerElement.classList.add('active');

    // Prevent body scroll when spinner is active
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide the loading spinner
   */
  hide() {
    if (!this.spinnerElement) return;

    this.activeCount = Math.max(0, this.activeCount - 1);

    // Only hide if no other processes are using the spinner
    if (this.activeCount === 0) {
      this.spinnerElement.classList.remove('active');

      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }

  /**
   * Force hide the spinner regardless of active count
   */
  forceHide() {
    if (!this.spinnerElement) return;

    this.activeCount = 0;
    this.spinnerElement.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Show spinner with auto-hide after specified duration
   * @param {number} duration - Duration in milliseconds
   * @param {string} message - Optional loading message
   */
  showWithTimeout(duration = 3000, message = 'Loading...') {
    this.show(message);
    setTimeout(() => this.hide(), duration);
  }

  /**
   * Utility method to wrap async operations with spinner
   * @param {Function} asyncFunc - Async function to execute
   * @param {string} message - Loading message
   * @returns {Promise} - Result of the async function
   */
  async withSpinner(asyncFunc, message = 'Loading...') {
    try {
      this.show(message);
      const result = await asyncFunc();
      return result;
    } finally {
      this.hide();
    }
  }
}

// Create global spinner instance
const spinner = new LoadingSpinner();

// Global functions for backward compatibility
function showSpinner(message) {
  spinner.show(message);
}

function hideSpinner() {
  spinner.hide();
}

// Auto-hide spinner on page load complete
window.addEventListener('load', () => {
  // Small delay to ensure smooth transition
  setTimeout(() => {
    spinner.forceHide();
  }, 300);
});

// Show spinner during page unload (navigation)
window.addEventListener('beforeunload', () => {
  spinner.show('Loading...');
});

// Handle dynamic content loading
document.addEventListener('DOMContentLoaded', () => {
  // Intercept anchor links with external URLs
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(link => {
    link.addEventListener('click', () => {
      spinner.showWithTimeout(1000, 'Opening link...');
    });
  });

  // Handle form submissions if any forms are added in future
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Don't show spinner if form has data-no-spinner attribute
      if (!form.hasAttribute('data-no-spinner')) {
        spinner.show('Submitting...');
      }
    });
  });

  // Example: Wrap the email copy function with spinner
  const originalCopyEmail = window.copyEmail;
  if (originalCopyEmail) {
    window.copyEmail = async function(e) {
      await spinner.withSpinner(
        () => originalCopyEmail.call(this, e),
        'Copying email...'
      );
    };
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LoadingSpinner, spinner, showSpinner, hideSpinner };
}