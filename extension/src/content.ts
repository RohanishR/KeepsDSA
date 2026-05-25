// LeetCode Content Script

let buttonInjected = false;

function injectFloatingButton() {
  if (document.getElementById('keepsdsa-sync-btn') || buttonInjected) return;
  
  const btn = document.createElement('button');
  btn.id = 'keepsdsa-sync-btn';
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/20event0/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    <span>Save to KeepsDSA</span>
  `;
  
  // Basic inline styling to avoid injecting a full CSS file for one button
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#2563eb', // blue-600
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: '999999',
    transition: 'all 0.2s ease',
  });

  btn.onmouseover = () => {
    btn.style.backgroundColor = '#1d4ed8'; // blue-700
    btn.style.transform = 'translateY(-2px)';
  };
  btn.onmouseout = () => {
    btn.style.backgroundColor = '#2563eb';
    btn.style.transform = 'translateY(0)';
  };

  btn.addEventListener('click', handleSyncClick);
  document.body.appendChild(btn);
  buttonInjected = true;
}

function extractProblemData() {
  const url = window.location.href;
  const slugMatch = url.match(/problems\/([^\/]+)/);
  const slug = slugMatch ? slugMatch[1] : null;

  if (!slug) throw new Error('Could not extract problem slug from URL');

  // Safest title fallback: format the slug
  const formattedSlug = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  // Try to find actual h1 title first
  const titleEl = document.querySelector('h1') || document.querySelector('[data-cy="question-title"]');
  const title = titleEl?.textContent ? titleEl.textContent.replace(/^\d+\.\s*/, '') : formattedSlug;

  // Description
  const descEl = document.querySelector('[data-track-load="description_content"]');
  const description = descEl ? descEl.innerHTML : '';

  // Try to find difficulty
  const difficultyEl = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
  const difficulty = difficultyEl ? difficultyEl.textContent : 'Medium';

  // Try to find tags
  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  const tags: string[] = [];
  tagEls.forEach(el => {
    if (el.textContent) tags.push(el.textContent);
  });

  // Extract Code
  let code = '';
  // 1. Try Monaco editor (Problem page)
  const lines = document.querySelectorAll('.view-lines .view-line');
  if (lines.length > 0) {
    // Monaco preserves spaces inside spans. textContent works reasonably well.
    // Replace non-breaking spaces with regular spaces
    code = Array.from(lines).map(line => (line.textContent || '').replace(/\u00a0/g, ' ')).join('\n');
  } else {
    // 2. Submission page or other code blocks (avoiding test cases which are usually <code> inside the description)
    // Submissions usually use a <pre> block
    const preEls = document.querySelectorAll('pre');
    // Find the pre block that looks like code (not a short test case)
    for (let i = preEls.length - 1; i >= 0; i--) {
      if (preEls[i].textContent && preEls[i].textContent!.length > 20) {
        code = preEls[i].textContent || '';
        break;
      }
    }
  }

  // Extract Language
  let language = 'javascript';
  const knownLanguages = ['c++', 'java', 'python', 'python3', 'c', 'c#', 'javascript', 'typescript', 'php', 'swift', 'kotlin', 'dart', 'go', 'ruby', 'scala', 'rust'];
  
  // 1. Try to find the specific headlessui button first
  const langEl = document.querySelector('[id^="headlessui-listbox-button-"]');
  let foundLang = langEl?.textContent?.trim().toLowerCase();

  // 2. If it's not a known language, scan all buttons and small text elements
  if (!foundLang || !knownLanguages.includes(foundLang)) {
    const candidateElements = document.querySelectorAll('button, .text-xs, .text-sm');
    for (let i = 0; i < candidateElements.length; i++) {
      const text = (candidateElements[i].textContent || '').trim().toLowerCase();
      if (knownLanguages.includes(text)) {
        foundLang = text;
        break;
      }
    }
  }

  if (foundLang && knownLanguages.includes(foundLang)) {
    language = foundLang;
    // Normalize for KeepsDSA syntax highlighter
    if (language === 'c++') language = 'cpp';
    if (language === 'python3') language = 'python';
    if (language === 'c#') language = 'csharp';
  }

  return {
    title,
    slug,
    difficulty,
    tags: Array.from(new Set(tags)), // unique
    url,
    code,
    language,
    description // added description!
  };
}

async function handleSyncClick() {
  const btn = document.getElementById('keepsdsa-sync-btn');
  if (!btn) return;

  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span>Syncing...</span>';
  btn.style.opacity = '0.8';
  btn.style.pointerEvents = 'none';

  try {
    const payload = extractProblemData();
    
    // Send to background script
    const response = await new Promise<any>((resolve) => {
      chrome.runtime.sendMessage({ action: 'syncToKeepsDSA', payload }, resolve);
    });

    if (response && response.success) {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Saved Successfully!</span>
      `;
      btn.style.backgroundColor = '#16a34a'; // green-600
    } else {
      throw new Error(response?.error || 'Unknown error');
    }
  } catch (error: any) {
    console.error('KeepsDSA Sync Error:', error);
    if (error.message && error.message.includes('Extension context invalidated')) {
      btn.innerHTML = `<span>Refresh page to sync!</span>`;
    } else {
      btn.innerHTML = `<span>Error: ${error.message}</span>`;
    }
    btn.style.backgroundColor = '#dc2626'; // red-600
  } finally {
    // Reset button after 3 seconds
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = originalHtml;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.backgroundColor = '#2563eb';
      }
    }, 3000);
  }
}

// Observe URL changes to re-inject button in SPAs
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Delay injection to allow DOM to render
    setTimeout(injectFloatingButton, 2000);
  }
}).observe(document, {subtree: true, childList: true});

// Initial injection
setTimeout(injectFloatingButton, 2000);
