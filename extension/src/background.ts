import { API_URL } from './config';

chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.action === 'syncToKeepsDSA') {
    handleSync(request.payload)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === 'extractCode') {
    // Use chrome.scripting.executeScript to run in the MAIN world (page's JS context)
    // This gives us access to window.monaco and CodeMirror instances
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ code: '' });
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN', // Run in the page's JS context, not the isolated content script world
      func: () => {
        try {
          // Try Monaco editor first
          if ((window as any).monaco && (window as any).monaco.editor) {
            const models = (window as any).monaco.editor.getModels();
            if (models && models.length > 0) {
              return models[0].getValue();
            }
          }

          // Try CodeMirror 6
          const cmContent = document.querySelector('.cm-content') as any;
          if (cmContent?.cmView?.view) {
            return cmContent.cmView.view.state.doc.toString();
          }

          // Try CodeMirror 5
          const cmEl = document.querySelector('.CodeMirror') as any;
          if (cmEl?.CodeMirror) {
            return cmEl.CodeMirror.getValue();
          }
        } catch (e) {}
        return '';
      }
    })
    .then((results) => {
      const code = results?.[0]?.result || '';
      sendResponse({ code });
    })
    .catch(() => {
      sendResponse({ code: '' });
    });

    return true; // Keep message channel open for async response
  }
});

async function handleSync(payload: any) {
  const result = await chrome.storage.local.get(['keepsDsaToken']);
  const token = result.keepsDsaToken;
  
  if (!token) {
    throw new Error('Not authenticated. Please connect your account in the extension popup.');
  }

  const response = await fetch(`${API_URL}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sync with KeepsDSA');
  }

  return data;
}
