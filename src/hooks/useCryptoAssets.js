import { useState, useEffect, useMemo, useCallback } from 'react';
import { cryptoAssets as initialAssets } from '../mock/crypto-assets';
import { storage } from '../lib/storage';

export function useCryptoAssets(filters = {}) {
  const [assets, setAssets] = useState(() => storage.get('crypto_assets', initialAssets));
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  useEffect(() => {
    storage.set('crypto_assets', assets);
  }, [assets]);

  const addAsset = useCallback((newAsset) => {
    setAssets((prev) => {
      const exists = prev.some((a) => a.id === newAsset.id);
      if (exists) return prev;
      return [newAsset, ...prev];
    });
  }, []);

  const updateAsset = useCallback((id, updates) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteAsset = useCallback((id) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchId = item.id?.toLowerCase().includes(q);
        const matchAlgo = item.algorithm?.name?.toLowerCase().includes(q);
        const matchFamily = item.algorithm?.family?.toLowerCase().includes(q);
        const matchApp = item.context?.applicationName?.toLowerCase().includes(q);
        const matchService = item.context?.serviceName?.toLowerCase().includes(q);
        const matchPurpose = item.usage?.purpose?.toLowerCase().includes(q);
        if (!matchId && !matchAlgo && !matchFamily && !matchApp && !matchService && !matchPurpose) {
          return false;
        }
      }
      if (filters.riskBand && filters.riskBand !== 'all') {
        if (item.riskBand !== filters.riskBand) return false;
      }
      if (filters.quantum && filters.quantum !== 'all') {
        if (item.status?.quantum !== filters.quantum) return false;
      }
      if (filters.application && filters.application !== 'all') {
        if (item.context?.applicationId !== filters.application && item.context?.applicationName !== filters.application) {
          return false;
        }
      }
      if (filters.purpose && filters.purpose !== 'all') {
        if (item.usage?.purpose !== filters.purpose) return false;
      }
      return true;
    });
  }, [assets, filters]);

  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  return {
    assets: filteredAssets,
    rawAssets: assets,
    selectedAsset,
    selectedAssetId,
    setSelectedAssetId,
    setAssets,
    addAsset,
    updateAsset,
    deleteAsset
  };
}
