/**
 * AI Resume Builder - Frontend Application
 * Modern SaaS UI & Real-Time Sync Engine
 */

// Global State
let expCounter = 0;
let projCounter = 0;
let eduCounter = 0;
let currentAiResult = null;
let currentTemplate = 'template-modern';

// DOM Elements Cache
let nameInput, targetRoleInput, emailInput, phoneInput, rawSummaryInput, skillsInput;
let experienceList, projectsList, educationList, resumePaperTarget;
let generateBtn, downloadBtn, aiStatusBox, aiStatusText, skillsTagsWrapper;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initElementReferences();
  initEventListeners();
  initDefaultEntries();
  updateLivePreview();
});

function initElementReferences() {
  nameInput = document.getElementById('name');
  targetRoleInput = document.getElementById('targetRole');
  emailInput = document.getElementById('email');
  phoneInput = document.getElementById('phone');
  rawSummaryInput = document.getElementById('rawSummary');
  skillsInput = document.getElementById('skills');

  experienceList = document.getElementById('experience-list');
  projectsList = document.getElementById('projects-list');
  educationList = document.getElementById('education-list');
  resumePaperTarget = document.getElementById('resume-paper-target');
  skillsTagsWrapper = document.getElementById('skills-tags-wrapper');

  generateBtn = document.getElementById('generateBtn');
  downloadBtn = document.getElementById('downloadBtn');
  aiStatusBox = document.getElementById('ai-status-box');
  aiStatusText = document.getElementById('ai-status-text');
}

function initEventListeners() {
  // Real-time input synchronization
  const textInputs = [nameInput, targetRoleInput, emailInput, phoneInput, rawSummaryInput];
  textInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        // If user is editing raw inputs, reset AI result only if drastically changed, or keep live draft
        updateLivePreview();
      });
    }
  });

  // Skills input sync
  if (skillsInput) {
    skillsInput.addEventListener('input', () => {
      renderSkillTags();
      updateLivePreview();
    });
  }

  // Template switch
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      setTemplate(e.target.value);
    });
  }
}

function initDefaultEntries() {
  // Seed 1 of each section so the form is welcoming
  addExperience();
  addProject();
  addEducation();
  renderSkillTags();
}

/* ==========================================================================
   Dynamic Form Entries: Experience, Project, Education
   ========================================================================== */

function addExperience(data = null) {
  expCounter++;
  const id = `exp-${expCounter}`;
  const card = document.createElement('div');
  card.className = 'dynamic-item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-badge-count">Experience Entry</span>
      <button type="button" class="btn-remove-item" title="Remove Experience" onclick="removeEntry('${id}')">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label">Job Title</label>
        <input type="text" class="form-control exp-title" placeholder="e.g. Software Engineer" value="${data?.title || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Company / Organization</label>
        <input type="text" class="form-control exp-company" placeholder="e.g. Acme Corp" value="${data?.company || ''}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Duration / Dates</label>
      <input type="text" class="form-control exp-duration" placeholder="e.g. Jun 2023 - Present" value="${data?.duration || ''}" />
    </div>
    <div class="form-group">
      <label class="form-label">
        <span>What did you do? <span class="input-hint">(Raw bullet points / notes)</span></span>
      </label>
      <textarea class="form-control exp-notes" rows="2" placeholder="e.g. Built microservices, optimized SQL queries by 35%, collaborated with team of 5">${data?.notes || ''}</textarea>
    </div>
  `;

  experienceList.appendChild(card);

  // Attach live sync listeners to inputs
  card.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updateLivePreview);
  });

  updateLivePreview();
}

function addProject(data = null) {
  projCounter++;
  const id = `proj-${projCounter}`;
  const card = document.createElement('div');
  card.className = 'dynamic-item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-badge-count">Project Entry</span>
      <button type="button" class="btn-remove-item" title="Remove Project" onclick="removeEntry('${id}')">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    <div class="form-group">
      <label class="form-label">Project Name</label>
      <input type="text" class="form-control proj-name" placeholder="e.g. E-Commerce Platform" value="${data?.name || ''}" />
    </div>
    <div class="form-group">
      <label class="form-label">
        <span>Project Details / Tech Stack <span class="input-hint">(Raw notes)</span></span>
      </label>
      <textarea class="form-control proj-notes" rows="2" placeholder="e.g. Full-stack store built with React, Node.js, and PostgreSQL with Stripe checkout">${data?.notes || ''}</textarea>
    </div>
  `;

  projectsList.appendChild(card);

  card.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updateLivePreview);
  });

  updateLivePreview();
}

function addEducation(data = null) {
  eduCounter++;
  const id = `edu-${eduCounter}`;
  const card = document.createElement('div');
  card.className = 'dynamic-item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-badge-count">Education Entry</span>
      <button type="button" class="btn-remove-item" title="Remove Education" onclick="removeEntry('${id}')">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label">Institution / University</label>
        <input type="text" class="form-control edu-institution" placeholder="e.g. University of California, Berkeley" value="${data?.institution || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Degree / Major</label>
        <input type="text" class="form-control edu-degree" placeholder="e.g. B.S. in Computer Science" value="${data?.degree || ''}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Duration / Graduation Year</label>
      <input type="text" class="form-control edu-duration" placeholder="e.g. 2020 - 2024" value="${data?.duration || ''}" />
    </div>
  `;

  educationList.appendChild(card);

  card.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updateLivePreview);
  });

  updateLivePreview();
}

function removeEntry(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      el.remove();
      updateLivePreview();
    }, 150);
  }
}

/* ==========================================================================
   Skills Chips & Suggestions
   ========================================================================== */

function renderSkillTags() {
  if (!skillsTagsWrapper || !skillsInput) return;
  const rawSkills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  
  skillsTagsWrapper.innerHTML = '';
  rawSkills.forEach((skill, idx) => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.innerHTML = `
      ${escapeHtml(skill)}
      <span class="skill-pill-remove" onclick="removeSkillTag(${idx})" title="Remove skill">✕</span>
    `;
    skillsTagsWrapper.appendChild(pill);
  });
}

function addSkillSuggestion(skillName) {
  if (!skillsInput) return;
  const currentSkills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  if (!currentSkills.includes(skillName)) {
    currentSkills.push(skillName);
    skillsInput.value = currentSkills.join(', ');
    renderSkillTags();
    updateLivePreview();
  }
}

function removeSkillTag(index) {
  if (!skillsInput) return;
  const currentSkills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  if (index >= 0 && index < currentSkills.length) {
    currentSkills.splice(index, 1);
    skillsInput.value = currentSkills.join(', ');
    renderSkillTags();
    updateLivePreview();
  }
}

/* ==========================================================================
   Data Collection & Backend API Contract
   ========================================================================== */

function collectFormData() {
  const experience = [...document.querySelectorAll('#experience-list .dynamic-item-card')].map(row => ({
    title: row.querySelector('.exp-title')?.value.trim() || '',
    company: row.querySelector('.exp-company')?.value.trim() || '',
    duration: row.querySelector('.exp-duration')?.value.trim() || '',
    notes: row.querySelector('.exp-notes')?.value.trim() || '',
  })).filter(e => e.title || e.company || e.notes);

  const projects = [...document.querySelectorAll('#projects-list .dynamic-item-card')].map(row => ({
    name: row.querySelector('.proj-name')?.value.trim() || '',
    notes: row.querySelector('.proj-notes')?.value.trim() || '',
  })).filter(p => p.name || p.notes);

  const education = [...document.querySelectorAll('#education-list .dynamic-item-card')].map(row => ({
    institution: row.querySelector('.edu-institution')?.value.trim() || '',
    degree: row.querySelector('.edu-degree')?.value.trim() || '',
    duration: row.querySelector('.edu-duration')?.value.trim() || '',
  })).filter(e => e.institution || e.degree);

  const skills = skillsInput?.value.split(',').map(s => s.trim()).filter(Boolean) || [];

  return {
    personal: {
      name: nameInput?.value.trim() || '',
      targetRole: targetRoleInput?.value.trim() || '',
      email: emailInput?.value.trim() || '',
      phone: phoneInput?.value.trim() || '',
    },
    rawSummary: rawSummaryInput?.value.trim() || '',
    experience,
    projects,
    education,
    skills,
  };
}

/* ==========================================================================
   Live Resume Preview Rendering Engine
   ========================================================================== */

function updateLivePreview() {
  const data = collectFormData();
  const hasContent = data.personal.name || data.personal.targetRole || data.personal.email || 
                     data.personal.phone || data.rawSummary || data.experience.length || 
                     data.projects.length || data.education.length || data.skills.length;

  if (!hasContent && !currentAiResult) {
    renderEmptyState();
    if (downloadBtn) downloadBtn.disabled = true;
    return;
  }

  if (downloadBtn) downloadBtn.disabled = false;
  renderResume(data.personal, data.education, data.skills, currentAiResult, data);
}

function renderEmptyState() {
  resumePaperTarget.innerHTML = `
    <div class="resume-empty-state">
      <div class="empty-state-icon-wrapper">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h4 class="empty-state-title">Your Live Resume Preview</h4>
      <p class="empty-state-desc">Fill in your information on the left panel or click <strong>"Load Sample"</strong> above to see a fully styled resume.</p>
    </div>
  `;
}

function renderResume(personal, education, skills, aiResult, rawData) {
  const summaryText = aiResult?.summary || rawData?.rawSummary || '';
  const experienceList = aiResult?.experience && aiResult.experience.length ? aiResult.experience : (rawData?.experience || []);
  const projectsList = aiResult?.projects && aiResult.projects.length ? aiResult.projects : (rawData?.projects || []);

  const contactItems = [];
  if (personal.email) {
    contactItems.push(`
      <span class="resume-contact-item">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        ${escapeHtml(personal.email)}
      </span>
    `);
  }
  if (personal.phone) {
    contactItems.push(`
      <span class="resume-contact-item">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        ${escapeHtml(personal.phone)}
      </span>
    `);
  }

  resumePaperTarget.innerHTML = `
    <!-- Header -->
    <header class="resume-header">
      <h1 class="resume-name">${escapeHtml(personal.name || 'Your Full Name')}</h1>
      ${personal.targetRole ? `<div class="resume-target-role">${escapeHtml(personal.targetRole)}</div>` : ''}
      ${contactItems.length ? `<div class="resume-contact-bar">${contactItems.join('<span class="contact-separator">•</span>')}</div>` : ''}
    </header>

    <!-- Professional Summary -->
    ${summaryText ? `
      <section class="resume-section">
        <h2 class="resume-section-title">Professional Summary</h2>
        <div class="resume-section-content">
          <p>${escapeHtml(summaryText)}</p>
        </div>
      </section>
    ` : ''}

    <!-- Experience -->
    ${experienceList.length ? `
      <section class="resume-section">
        <h2 class="resume-section-title">Experience</h2>
        <div class="resume-section-content">
          ${experienceList.map(exp => {
            const hasAiBullets = Array.isArray(exp.bullets) && exp.bullets.length;
            return `
              <div class="resume-entry">
                <div class="resume-entry-header">
                  <span class="resume-entry-title">${escapeHtml(exp.title || 'Role / Position')} ${exp.company ? `<span class="resume-entry-company">— ${escapeHtml(exp.company)}</span>` : ''}</span>
                  ${exp.duration ? `<span class="resume-entry-duration">${escapeHtml(exp.duration)}</span>` : ''}
                </div>
                ${hasAiBullets ? `
                  <ul class="resume-bullets">
                    ${exp.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}
                  </ul>
                ` : (exp.notes ? `<p style="margin-top: 4px; font-size: 0.86rem; color: #475569;">${escapeHtml(exp.notes)}</p>` : '')}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Projects -->
    ${projectsList.length ? `
      <section class="resume-section">
        <h2 class="resume-section-title">Projects</h2>
        <div class="resume-section-content">
          ${projectsList.map(proj => {
            const hasAiBullets = Array.isArray(proj.bullets) && proj.bullets.length;
            return `
              <div class="resume-entry">
                <div class="resume-entry-header">
                  <span class="resume-entry-title">${escapeHtml(proj.name || 'Project Title')}</span>
                </div>
                ${hasAiBullets ? `
                  <ul class="resume-bullets">
                    ${proj.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}
                  </ul>
                ` : (proj.notes ? `<p style="margin-top: 4px; font-size: 0.86rem; color: #475569;">${escapeHtml(proj.notes)}</p>` : '')}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Education -->
    ${education.length ? `
      <section class="resume-section">
        <h2 class="resume-section-title">Education</h2>
        <div class="resume-section-content">
          ${education.map(edu => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${escapeHtml(edu.degree || 'Degree Program')}</span>
                ${edu.duration ? `<span class="resume-entry-duration">${escapeHtml(edu.duration)}</span>` : ''}
              </div>
              ${edu.institution ? `<div class="resume-entry-meta">${escapeHtml(edu.institution)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Skills -->
    ${skills.length ? `
      <section class="resume-section">
        <h2 class="resume-section-title">Skills & Technologies</h2>
        <div class="resume-section-content">
          <div class="resume-skills-inline">
            ${skills.map(s => `<span class="resume-skill-item">${escapeHtml(s)}</span>`).join('<span class="contact-separator">•</span>')}
          </div>
        </div>
      </section>
    ` : ''}
  `;
}

/* ==========================================================================
   AI Generation Workflow
   ========================================================================== */

async function generateResume() {
  const data = collectFormData();

  if (!data.personal.name) {
    showToast('Please enter your Full Name before generating with AI.', 'error');
    if (nameInput) nameInput.focus();
    return;
  }

  // Set Loading State
  setGeneratingState(true);
  showToast('Gemini AI is analyzing your details and polishing resume bullets...', 'info', 5000);

  try {
    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const aiResult = await response.json();

    if (!response.ok) {
      let errMsg = 'Server error occurred while generating content.';
      if (aiResult.error) {
        try {
          const parsed = typeof aiResult.error === 'string' ? JSON.parse(aiResult.error) : aiResult.error;
          if (parsed?.error?.message) {
            errMsg = parsed.error.message;
          } else if (parsed?.message) {
            errMsg = parsed.message;
          } else {
            errMsg = aiResult.error;
          }
        } catch {
          errMsg = aiResult.error;
        }
      }
      showToast(errMsg, 'error', 6000);
      setGeneratingState(false);
      return;
    }

    // Success: Store and Render
    currentAiResult = aiResult;
    renderResume(data.personal, data.education, data.skills, currentAiResult, data);

    // Apply flash highlight to newly polished resume
    resumePaperTarget.classList.add('ai-highlight-fresh');
    setTimeout(() => {
      resumePaperTarget.classList.remove('ai-highlight-fresh');
    }, 1800);

    showToast('✨ Resume polished successfully with Gemini AI!', 'success', 5000);
  } catch (err) {
    console.error('Network / API generation error:', err);
    showToast('Network error: ' + (err.message || 'Unable to connect to backend'), 'error', 6000);
  } finally {
    setGeneratingState(false);
  }
}

function setGeneratingState(isGenerating) {
  if (!generateBtn) return;
  generateBtn.disabled = isGenerating;

  if (isGenerating) {
    generateBtn.innerHTML = `
      <div class="spinner"></div>
      <span>Polishing with AI...</span>
    `;
    if (aiStatusBox) {
      aiStatusBox.style.display = 'flex';
      aiStatusText.textContent = 'Gemini AI is optimizing ATS keywords and bullet points...';
    }
  } else {
    generateBtn.innerHTML = `
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>✨ Generate Resume with AI</span>
    `;
    if (aiStatusBox) {
      aiStatusBox.style.display = 'none';
    }
  }
}

/* ==========================================================================
   PDF Download Functionality
   ========================================================================== */

async function downloadPDF() {
  // Prevent simultaneous downloads
  if (window._isGeneratingPdf) return;

  const data = collectFormData();
  const hasContent = data.personal.name || data.personal.targetRole || data.personal.email || 
                     data.personal.phone || data.rawSummary || data.experience.length || 
                     data.projects.length || data.education.length || data.skills.length;

  if (!hasContent && !currentAiResult) {
    showToast('Please enter your resume details or click "Load Sample" before downloading.', 'error', 4000);
    return;
  }

  const sourceEl = document.getElementById('resume-paper-target');
  if (!sourceEl) {
    showToast('Resume preview element not found.', 'error', 4000);
    return;
  }

  // Set loading state on all download buttons
  window._isGeneratingPdf = true;
  setPdfLoadingState(true);
  showToast('Preparing your high-resolution A4 PDF...', 'info', 4000);

  let pdfContainer = null;

  try {
    // 1. Ensure fonts are fully loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 100));

    // 2. Prepare filename
    const userName = data.personal.name || 'Professional';
    const cleanFilename = `${userName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume.pdf`;

    // 3. Create Dedicated A4 PDF Container (794px width = standard 210mm A4 at 96 DPI)
    pdfContainer = document.createElement('div');
    pdfContainer.id = 'a4-pdf-render-target';
    pdfContainer.className = 'resume-paper-sheet ' + (currentTemplate || 'template-modern');
    
    // Apply strict A4 document styles (not inheriting responsive layout)
    pdfContainer.style.width = '794px';
    pdfContainer.style.minHeight = '1123px';
    pdfContainer.style.boxSizing = 'border-box';
    pdfContainer.style.margin = '0';
    pdfContainer.style.padding = '44px 48px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#1e293b';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.top = '0';
    pdfContainer.style.left = '0';
    pdfContainer.style.zIndex = '-99999';
    pdfContainer.style.visibility = 'visible';
    pdfContainer.style.opacity = '1';
    pdfContainer.style.boxShadow = 'none';
    pdfContainer.style.border = 'none';
    pdfContainer.style.borderRadius = '0';
    pdfContainer.style.transform = 'none';

    // Copy rendered resume content
    pdfContainer.innerHTML = sourceEl.innerHTML;
    
    // Remove screen highlights
    const highlights = pdfContainer.querySelectorAll('.ai-highlight-fresh');
    highlights.forEach(el => el.classList.remove('ai-highlight-fresh'));

    document.body.appendChild(pdfContainer);

    // Allow DOM to settle
    await new Promise(resolve => setTimeout(resolve, 150));

    const containerWidth = pdfContainer.offsetWidth || 794;
    const containerHeight = pdfContainer.offsetHeight;

    // Element bounds for smart multi-page slicing
    const elements = Array.from(pdfContainer.querySelectorAll('.resume-section-title, .resume-entry, .resume-header'));
    const parentRect = pdfContainer.getBoundingClientRect();
    const elementBounds = elements.map(el => {
      const rect = el.getBoundingClientRect();
      return {
        top: (rect.top - parentRect.top) * 2, // Scale factor = 2
        bottom: (rect.bottom - parentRect.top) * 2,
        isSectionHeader: el.classList.contains('resume-section-title')
      };
    });

    // 4. Capture with html2canvas starting from x=0, y=0
    const html2canvasFn = window.html2canvas || (typeof html2pdf !== 'undefined' && html2pdf.Worker ? null : null);
    if (!html2canvasFn) {
      throw new Error('html2canvas library is not available.');
    }

    const canvas = await html2canvasFn(pdfContainer, {
      scale: 2, // High resolution (1588px width)
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: containerWidth,
      windowWidth: containerWidth,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true
    });

    // Clean up DOM container
    if (pdfContainer && pdfContainer.parentNode) {
      pdfContainer.parentNode.removeChild(pdfContainer);
      pdfContainer = null;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 5. A4 Geometry & Page Break Calculations
    const pdfWidthMm = 210;
    const pdfHeightMm = 297;
    const pageCanvasHeight = Math.round(canvasWidth * (pdfHeightMm / pdfWidthMm));
    const topMarginPx = 44 * 2; // 88px top margin on subsequent pages

    // Debugging diagnostics log
    console.log('--- PDF Export Diagnostics ---');
    console.log('PDF container width:', containerWidth + 'px');
    console.log('PDF container height:', containerHeight + 'px');
    console.log('canvas width:', canvasWidth + 'px');
    console.log('canvas height:', canvasHeight + 'px');
    console.log('calculated PDF page width:', pdfWidthMm + 'mm');
    console.log('calculated PDF page height:', pdfHeightMm + 'mm');

    // Smart slice boundaries
    const pageSlices = [];
    let currentY = 0;

    if (canvasHeight <= pageCanvasHeight + 20) {
      // Natural single page
      pageSlices.push({ startY: 0, endY: canvasHeight });
    } else {
      // Multi-page slicing
      while (currentY < canvasHeight) {
        const remaining = canvasHeight - currentY;
        if (remaining <= 40) break; // Avoid tiny empty fragment

        const maxUsableHeight = pageSlices.length === 0 ? pageCanvasHeight : (pageCanvasHeight - topMarginPx);
        let targetY = currentY + maxUsableHeight;

        if (targetY >= canvasHeight) {
          pageSlices.push({ startY: currentY, endY: canvasHeight });
          break;
        }

        let bestCut = targetY;
        for (const b of elementBounds) {
          if (b.top < targetY && b.bottom > targetY) {
            if (b.top - currentY > maxUsableHeight * 0.55) {
              bestCut = b.top;
            }
            break;
          }
          if (b.isSectionHeader && b.top > currentY + maxUsableHeight - 140 && b.top < targetY) {
            if (b.top - currentY > maxUsableHeight * 0.50) {
              bestCut = b.top;
              break;
            }
          }
        }

        pageSlices.push({ startY: currentY, endY: bestCut });
        currentY = bestCut;
      }
    }

    console.log('number of generated pages:', pageSlices.length);

    // 6. Build PDF with jsPDF
    const jsPdfClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPdfClass) {
      throw new Error('jsPDF library is not available.');
    }

    const pdf = new jsPdfClass('p', 'mm', 'a4');

    pageSlices.forEach((slice, idx) => {
      if (idx > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const sliceHeight = slice.endY - slice.startY;
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      // Pristine white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, pageCanvasHeight);

      // Draw slice
      const drawY = idx === 0 ? 0 : topMarginPx;
      ctx.drawImage(canvas, 0, slice.startY, canvasWidth, sliceHeight, 0, drawY, canvasWidth, sliceHeight);

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm);
    });

    // 7. Save PDF
    pdf.save(cleanFilename);
    showToast('✅ PDF downloaded successfully!', 'success', 3500);

  } catch (err) {
    console.error('PDF export failed:', err);
    if (pdfContainer && pdfContainer.parentNode) {
      pdfContainer.parentNode.removeChild(pdfContainer);
    }

    showToast('PDF export error: ' + (err.message || 'Unable to generate PDF'), 'error', 5000);
    
    // Friendly fallback
    setTimeout(() => {
      window.print();
    }, 500);
  } finally {
    window._isGeneratingPdf = false;
    setPdfLoadingState(false);
  }
}

function setPdfLoadingState(isLoading) {
  const btns = document.querySelectorAll('.btn-download-pdf');
  btns.forEach(btn => {
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = `
        <div class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>
        <span>Preparing PDF...</span>
      `;
    } else {
      btn.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download PDF</span>
      `;
    }
  });
}

/* ==========================================================================
   Template Switcher & Helpers
   ========================================================================== */

function setTemplate(templateClass) {
  if (!resumePaperTarget) return;
  resumePaperTarget.classList.remove('template-modern', 'template-executive', 'template-minimal', 'template-slate');
  resumePaperTarget.classList.add(templateClass);
  currentTemplate = templateClass;
  showToast(`Applied ${getTemplateDisplayName(templateClass)} style`, 'info', 2000);
}

function getTemplateDisplayName(templateClass) {
  switch (templateClass) {
    case 'template-executive': return 'Executive Serif';
    case 'template-minimal': return 'Minimalist Tech';
    case 'template-slate': return 'Slate Accent';
    default: return 'Modern Clean';
  }
}

/* ==========================================================================
   Sample Data Populator & Reset
   ========================================================================== */

function loadSampleData() {
  if (nameInput) nameInput.value = 'Alex Morgan';
  if (targetRoleInput) targetRoleInput.value = 'Senior Full Stack Software Engineer';
  if (emailInput) emailInput.value = 'alex.morgan@example.com';
  if (phoneInput) phoneInput.value = '+1 (555) 234-5678';
  if (rawSummaryInput) rawSummaryInput.value = 'Full-stack software engineer with 4+ years of experience designing high-throughput web applications, distributed cloud services, and interactive user experiences. Passionate about clean code, developer tooling, and modern frontend architectures.';

  // Clear existing dynamic rows
  experienceList.innerHTML = '';
  projectsList.innerHTML = '';
  educationList.innerHTML = '';

  // Seed sample dynamic entries
  addExperience({
    title: 'Senior Software Engineer',
    company: 'Vanguard Systems',
    duration: '2022 - Present',
    notes: 'Led frontend refactor to Next.js resulting in 40% faster LCP. Built automated pipeline scaling 2M daily events. Mentored 5 junior engineers.',
  });

  addExperience({
    title: 'Software Developer',
    company: 'Apex Data Labs',
    duration: '2020 - 2022',
    notes: 'Developed microservices in Node.js and Go. Optimized PostgreSQL database queries reducing API latency by 65%. Implemented Docker CI/CD workflows.',
  });

  addProject({
    name: 'CloudMetrics - Real-Time Telemetry Dashboard',
    notes: 'Open-source distributed dashboard tracking server metrics with WebSockets, React, and TimescaleDB. Reached 1.2k GitHub stars.',
  });

  addProject({
    name: 'AI Document Summarizer CLI',
    notes: 'Command-line tool utilizing LLMs for automated technical documentation generation and pull request summaries.',
  });

  addEducation({
    institution: 'University of California, Berkeley',
    degree: 'B.S. in Computer Science',
    duration: '2016 - 2020',
  });

  if (skillsInput) {
    skillsInput.value = 'TypeScript, React, Node.js, Next.js, Python, PostgreSQL, Redis, Docker, AWS, GraphQL, CI/CD, Tailwind CSS';
  }

  renderSkillTags();
  currentAiResult = null;
  updateLivePreview();
  showToast('Loaded sample data! Click "Generate with AI" to polish it.', 'success', 3500);
}

function clearAllData() {
  if (!confirm('Are you sure you want to clear all form fields and start fresh?')) {
    return;
  }

  if (nameInput) nameInput.value = '';
  if (targetRoleInput) targetRoleInput.value = '';
  if (emailInput) emailInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (rawSummaryInput) rawSummaryInput.value = '';
  if (skillsInput) skillsInput.value = '';

  experienceList.innerHTML = '';
  projectsList.innerHTML = '';
  educationList.innerHTML = '';

  addExperience();
  addProject();
  addEducation();

  renderSkillTags();
  currentAiResult = null;
  updateLivePreview();
  showToast('Form cleared.', 'info', 2000);
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */

function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  } else {
    iconSvg = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  }

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${iconSvg}</span>
      <span>${escapeHtml(message)}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px) scale(0.96)';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

/* ==========================================================================
   Modal Dialogs & Info
   ========================================================================== */

function openTipsModal() {
  const modal = document.getElementById('tipsModal');
  if (modal) modal.style.display = 'flex';
}

function closeTipsModal() {
  const modal = document.getElementById('tipsModal');
  if (modal) modal.style.display = 'none';
}

// Utility: HTML Escaper
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
