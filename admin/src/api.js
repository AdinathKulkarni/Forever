const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '');

if (!BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL must be set in the admin environment');
}

export { BACKEND_URL };
