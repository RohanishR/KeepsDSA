// Configuration for the Chrome Extension
// You can override this by creating a .env file in the extension folder and setting VITE_WEB_URL
const isDev = import.meta.env.DEV;
export const WEB_URL = import.meta.env.VITE_WEB_URL || (isDev ? 'http://localhost:3000' : 'https://keeps-dsa.vercel.app');
export const API_URL = import.meta.env.VITE_API_URL || `${WEB_URL}/api/extension`;
