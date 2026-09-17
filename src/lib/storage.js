const NAMESPACE = 'ecdat_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(NAMESPACE + key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn('Storage read error:', e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(NAMESPACE + key);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  },
  clearAll() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(NAMESPACE)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
  }
};
