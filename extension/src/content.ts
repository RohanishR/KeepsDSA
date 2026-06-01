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

// Use the background script to run code in the page's JS context via chrome.scripting.executeScript
// This bypasses CSP restrictions that block inline script injection
function getEditorCodeViaBackground(): Promise<string> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'extractCode' }, (response) => {
      resolve(response?.code || '');
    });
    // Timeout fallback
    setTimeout(() => resolve(''), 3000);
  });
}

// Fallback: use keyboard shortcut to select all + copy from Monaco/CodeMirror
async function getEditorCodeViaClipboard(): Promise<string> {
  try {
    // Find the editor's focusable area
    const editorArea = document.querySelector('.monaco-editor textarea.inputarea') 
      || document.querySelector('.cm-content')
      || document.querySelector('.view-lines');
    
    if (!editorArea) return '';
    
    // Focus the editor
    (editorArea as HTMLElement).focus();
    
    // Save current clipboard
    let savedClipboard = '';
    try { savedClipboard = await navigator.clipboard.readText(); } catch {}
    
    // Select All + Copy
    document.execCommand('selectAll');
    await new Promise(r => setTimeout(r, 50));
    document.execCommand('copy');
    await new Promise(r => setTimeout(r, 100));
    
    // Read copied code
    const code = await navigator.clipboard.readText();
    
    // Restore previous clipboard if we had something
    if (savedClipboard && savedClipboard !== code) {
      try { await navigator.clipboard.writeText(savedClipboard); } catch {}
    }
    
    // Deselect
    window.getSelection()?.removeAllRanges();
    
    return code || '';
  } catch {
    return '';
  }
}

// DOM-based extraction with scrolling to capture all virtualized lines
function getEditorCodeFromDOM(): string {
  // Strategy 1: CodeMirror 6 (.cm-line) — these are NOT virtualized, all lines exist in DOM
  const cmLines = document.querySelectorAll('.cm-line');
  if (cmLines.length > 0) {
    return Array.from(cmLines)
      .map(line => (line.textContent || '').replace(/\u00a0/g, ' '))
      .join('\n');
  }
  
  // Strategy 2: Monaco view-lines — these ARE virtualized, only visible lines exist
  // We sort by their top position to maintain order
  const viewLines = document.querySelectorAll('.view-lines .view-line');
  if (viewLines.length > 0) {
    const sortedLines = Array.from(viewLines).sort((a, b) => {
      const topA = parseInt((a as HTMLElement).style.top || '0', 10);
      const topB = parseInt((b as HTMLElement).style.top || '0', 10);
      return topA - topB;
    });
    return sortedLines
      .map(line => (line.textContent || '').replace(/\u00a0/g, ' '))
      .join('\n');
  }
  
  // Strategy 3: any <pre> code block
  const preEls = document.querySelectorAll('pre');
  for (let i = preEls.length - 1; i >= 0; i--) {
    if (preEls[i].textContent && preEls[i].textContent!.length > 20) {
      return preEls[i].textContent || '';
    }
  }
  
  return '';
}

async function extractProblemData() {
  const url = window.location.href;
  const slugMatch = url.match(/problems\/([^\/\?]+)/);
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

  // === Extract Code (try multiple strategies) ===
  
  // Strategy 1: Use background script to access monaco/codemirror in page context
  let code = await getEditorCodeViaBackground();
  
  // Strategy 2: Try clipboard approach (Ctrl+A, Ctrl+C)
  if (!code) {
    code = await getEditorCodeViaClipboard();
  }
  
  // Strategy 3: DOM fallback
  if (!code) {
    code = getEditorCodeFromDOM();
  }

  // === Extract Language ===
  let language = 'Python';
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
    'go': 'Go', 'golang': 'Go',
    'ruby': 'Ruby',
    'rust': 'Rust'
  };
  
  let foundLang = '';
  
  // Method 1: Check the language selector button text on LeetCode's new UI
  const langButton = document.querySelector('button[id*="headlessui-listbox-button"]') 
    || document.querySelector('button[id*="headlessui-popover-button"]');
  if (langButton) {
    const text = langButton.textContent?.trim().toLowerCase();
    if (text && knownLanguages[text]) {
      foundLang = text;
    }
  }
  
  // Method 2: Look at all buttons near the code area for language text
  if (!foundLang) {
    const codeSection = document.querySelector('[data-track-load="editor_content"]') || document.querySelector('.flex.items-center') || document.body;
    const allButtons = codeSection.querySelectorAll('button, [role="button"]');
    for (let i = 0; i < allButtons.length; i++) {
      const el = allButtons[i];
      let text = (el.textContent || '').trim().toLowerCase();
      // Skip if too long — probably not a language label
      if (text.length > 15) continue;
      if (text === 'cpp') text = 'c++';
      if (knownLanguages[text]) {
        foundLang = text;
        break;
      }
    }
  }

  // Method 3: Check data-mode-id attribute (older Monaco editors)
  if (!foundLang) {
    const modeEl = document.querySelector('[data-mode-id]');
    if (modeEl) {
      let mode = modeEl.getAttribute('data-mode-id')?.toLowerCase() || '';
      if (mode === 'cpp') mode = 'c++';
      if (knownLanguages[mode]) foundLang = mode;
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
    const payload = await extractProblemData();
    
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
