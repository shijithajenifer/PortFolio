/**
 * interactive.js - Interactive features, clipboard copy, resume modal & pipeline tooltips
 * Shijitha Jenifer J - Personal Portfolio
 */

(function () {
  'use strict';

  // --- 1. TOAST NOTIFICATION ---
  const toast = document.getElementById('toast');
  let toastTimer;

  window.showToast = function (message, duration = 3200) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-message') || toast;
    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // --- 2. COPY EMAIL TO CLIPBOARD ---
  window.copyEmail = function () {
    const email = 'shijithajenifer2005@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        window.showToast('Copied email to clipboard: ' + email);
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  };

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      window.showToast('Copied email to clipboard: ' + text);
    } catch (err) {
      window.showToast('Email: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // --- 3. RESUME HANDLER & MODAL ---
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');

  window.handleResumeDownload = function (e) {
    if (e) e.preventDefault();
    const resumePath = 'assets/resume.pdf';
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Shijitha_Jenifer_J_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast('Downloading Shijitha Jenifer J Resume (PDF)...');
  };

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  });

  // --- 4. INTERACTIVE ARCHITECTURE PIPELINE EXPLANATIONS ---
  const pipelineExplanations = {
    // IT Helpdesk Chatbot
    'rag-1': 'PDF Documents: Technical user guides, manuals, and documentation ingested in standard PDF format.',
    'rag-2': 'Text Processing: Extracted text is cleaned, tokenized, and split into semantically coherent chunk segments.',
    'rag-3': 'Embeddings: Text chunks are converted into dense mathematical vector representations.',
    'rag-4': 'Vector Search: Embeddings are indexed to enable rapid cosine / L2 distance similarity queries.',
    'rag-5': 'Retrieval: The top relevant context passages matching the user question are retrieved in milliseconds.',
    'rag-6': 'Response Generation: Context is assembled and served through a clean, responsive Streamlit conversational interface.',

    // Stock ETL Pipeline
    'etl-1': 'Market Feed: Real-time stock market pricing and volume time-series incoming data stream.',
    'etl-2': 'Extraction Layer: Automated ingestion scripts pull raw quotes periodically with error handling.',
    'etl-3': 'Pandas Transform: Cleaning missing fields, type coercion, timestamp alignment, and metric calculations.',
    'etl-4': 'Load Pipeline: Clean structured tables are loaded transactionally into relational tables.',
    'etl-5': 'SQLite Relational Storage: Compact, self-contained SQL database storing historical and recent stock states.',
    'etl-6': 'Streamlit Analytics: Interactive dashboard rendering charts, price trends, and summary metrics.'
  };

  const pipelineSteps = document.querySelectorAll('.pipeline-step[data-step]');
  pipelineSteps.forEach((step) => {
    step.addEventListener('click', function () {
      const stepId = this.getAttribute('data-step');
      const container = this.closest('.arch-visual-container');
      const tooltip = container ? container.querySelector('.pipeline-tooltip') : null;

      // Deselect sibling steps in this diagram
      const siblings = container.querySelectorAll('.pipeline-step');
      siblings.forEach(s => s.classList.remove('active'));
      this.classList.add('active');

      if (tooltip && pipelineExplanations[stepId]) {
        tooltip.textContent = pipelineExplanations[stepId];
        tooltip.classList.add('show');
      }
    });
  });

  // --- 5. CONTACT FORM TO MAILTO ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim() || '';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      const message = document.getElementById('contactMessage')?.value.trim() || '';

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Shijitha,\n\n${message}\n\nFrom:\n${name}\nEmail: ${email}`);
      
      const mailtoUrl = `mailto:shijithajenifer2005@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
      window.showToast('Opening your email client to send message...');
    });
  }
})();
