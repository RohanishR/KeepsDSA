import { API_URL } from './config';

chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.action === 'syncToKeepsDSA') {
    handleSync(request.payload)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
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
