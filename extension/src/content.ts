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

// Helper to get full code from editor instances in page context
function getEditorCode(): Promise<string> {
  return new Promise((resolve) => {
    const eventId = 'KeepsDSACode_' + Date.now();
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        let code = '';
        try {
          // Try Monaco
          if (window.monaco && window.monaco.editor) {
            const models = window.monaco.editor.getModels();
            if (models.length > 0) code = models[0].getValue();
          } 
          // Try CodeMirror 6
          else {
            const cmContent = document.querySelector('.cm-content');
            if (cmContent && cmContent.cmView && cmContent.cmView.view) {
              code = cmContent.cmView.view.state.doc.toString();
            } else if (document.querySelector('.view-lines')) {
              // Fallback for monaco if window.monaco is hidden but we can access editor instance
              const editorNode = document.querySelector('.monaco-editor');
              // Not easily accessible without window.monaco
            }
          }
        } catch(e) {}
        document.dispatchEvent(new CustomEvent('${eventId}', { detail: code }));
      })();
    `;

    const listener = (e: any) => {
      document.removeEventListener(eventId, listener);
      script.remove();
      resolve(e.detail || '');
    };

    document.addEventListener(eventId, listener);
    document.documentElement.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      document.removeEventListener(eventId, listener);
      if (script.parentNode) script.remove();
      resolve('');
    }, 1500);
  });
}

async function extractProblemData() {
  const url = window.location.href;
  const slugMatch = url.match(/problems\/([^\/]+)/);
  const slug = slugMatch ? slugMatch[1] : null;

  if (!slug) throw new Error('Could not extract problem slug from URL');

  const formattedSlug = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const titleEl = document.querySelector('h1') || document.querySelector('[data-cy="question-title"]');
  const title = titleEl?.textContent ? titleEl.textContent.replace(/^\d+\.\s*/, '') : formattedSlug;

  const descEl = document.querySelector('[data-track-load="description_content"]');
  const description = descEl ? descEl.innerHTML : '';

  const difficultyEl = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
  const difficulty = difficultyEl ? difficultyEl.textContent : 'Medium';

  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  const tags: string[] = [];
  tagEls.forEach(el => {
    if (el.textContent) tags.push(el.textContent);
  });

  // Extract Code
  let code = await getEditorCode();
  
  if (!code) {
    // Fallback DOM extraction
    const cmLines = document.querySelectorAll('.cm-line');
    if (cmLines.length > 0) {
      code = Array.from(cmLines).map(line => (line.textContent || '').replace(/\u00a0/g, ' ')).join('\n');
    } else {
      const lines = document.querySelectorAll('.view-lines .view-line');
      if (lines.length > 0) {
        const sortedLines = Array.from(lines).sort((a, b) => {
          const topA = parseInt((a as HTMLElement).style.top || '0', 10);
          const topB = parseInt((b as HTMLElement).style.top || '0', 10);
          return topA - topB;
        });
        code = sortedLines.map(line => (line.textContent || '').replace(/\u00a0/g, ' ')).join('\n');
      } else {
        const preEls = document.querySelectorAll('pre');
        for (let i = preEls.length - 1; i >= 0; i--) {
          if (preEls[i].textContent && preEls[i].textContent!.length > 20) {
            code = preEls[i].textContent || '';
            break;
          }
        }
      }
    }
  }

  // Extract Language
  let language = 'JavaScript';
  const knownLanguages: Record<string, string> = {
    'c++': 'C++', 'cpp': 'C++',
    'java': 'Java',
    'python': 'Python', 'python3': 'Python',
    'c': 'C',
    'c#': 'C#', 'csharp': 'C#',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'go': 'Go',
    'ruby': 'Ruby',
    'rust': 'Rust'
  };
  
  let foundLang = '';
  const langEls = document.querySelectorAll('[id^="headlessui-listbox-button-"], [id^="headlessui-popover-button-"]');
  for (let i = 0; i < langEls.length; i++) {
    const text = langEls[i]?.textContent?.trim().toLowerCase();
    if (text && Object.keys(knownLanguages).includes(text)) {
      foundLang = text;
      break;
    }
  }

  if (!foundLang) {
    const editorArea = document.querySelector('[data-track-load="editor_content"]') || document.body;
    const candidateElements = editorArea.querySelectorAll('button, .text-xs, .text-sm, [data-mode-id]');
    for (let i = 0; i < candidateElements.length; i++) {
      const el = candidateElements[i];
      let text = (el.getAttribute('data-mode-id') || el.textContent || '').trim().toLowerCase();
      if (text === 'cpp') text = 'c++';
      if (Object.keys(knownLanguages).includes(text)) {
        foundLang = text;
        break;
      }
    }
  }

  if (foundLang && knownLanguages[foundLang]) {
    language = knownLanguages[foundLang];
  }

  return {
    title,
    slug,
    difficulty,
    tags: Array.from(new Set(tags)),
    url,
    code,
    language,
    description
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
