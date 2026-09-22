/**
 * ECDAT Frontend API Client
 * Seamlessly interfaces with the FastAPI backend (/api/v1).
 * If the backend is unavailable (e.g. static preview or offline demo),
 * it gracefully returns null or falls back so that components can use local fixtures.
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1`
  : '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `API request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null on failure to allow caller to fall back gracefully
    console.debug(`[ECDAT API] Offline/Fallback mode for ${endpoint}:`, err.message);
    return null;
  }
}

export const api = {
  // Health
  async checkHealth() {
    return await request('/health');
  },

  // Dashboard
  async getDashboardSummary() {
    return await request('/dashboard/summary');
  },

  // Assets
  async getAssets(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.riskBand) query.set('riskBand', params.riskBand);
    if (params.quantum) query.set('quantum', params.quantum);
    if (params.application) query.set('application', params.application);
    if (params.purpose) query.set('purpose', params.purpose);
    if (params.page) query.set('page', params.page);
    if (params.pageSize) query.set('pageSize', params.pageSize);

    const qStr = query.toString();
    return await request(`/assets${qStr ? `?${qStr}` : ''}`);
  },

  async getAsset(id) {
    return await request(`/assets/${id}`);
  },

  async createAsset(assetData) {
    return await request('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData)
    });
  },

  async updateAsset(id, updates) {
    return await request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteAsset(id) {
    return await request(`/assets/${id}`, {
      method: 'DELETE'
    });
  },

  async exportCBOM() {
    return await request('/assets/export/cbom');
  },

  // Scans & Analysis
  async getScans() {
    return await request('/scans');
  },

  async createScan(scanData) {
    return await request('/scans', {
      method: 'POST',
      body: JSON.stringify(scanData)
    });
  },

  async analyzeCode(code, filename = 'snippet.py') {
    return await request('/scans/analyze', {
      method: 'POST',
      body: JSON.stringify({ code, filename })
    });
  },

  // Risks
  async getRiskSummary() {
    return await request('/risks/summary');
  },

  async getRiskMatrix() {
    return await request('/risks/matrix');
  },

  async getHndlAssets() {
    return await request('/risks/hndl');
  },

  // Mosca
  async calculateMosca(shelfLifeYears, migrationTimeYears, threatHorizonYears) {
    return await request('/mosca/assess', {
      method: 'POST',
      body: JSON.stringify({
        dataShelfLifeYears: Number(shelfLifeYears),
        migrationTimeYears: Number(migrationTimeYears),
        threatHorizonYears: Number(threatHorizonYears)
      })
    });
  },

  // Migration
  async getMigrationTasks() {
    return await request('/migration/tasks');
  },

  async createMigrationTask(taskData) {
    return await request('/migration/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateMigrationTask(id, updates) {
    return await request(`/migration/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async deleteMigrationTask(id) {
    return await request(`/migration/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  // Recommendations
  async getRecommendations() {
    return await request('/recommendations');
  },

  async evaluateRecommendation(purpose, algorithm) {
    return await request('/recommendations/evaluate', {
      method: 'POST',
      body: JSON.stringify({ purpose, algorithm })
    });
  },

  // Graph
  async getGraph() {
    return await request('/graph');
  }
};
