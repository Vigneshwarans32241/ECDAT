import { useState, useEffect, useMemo } from 'react';
import { cryptoAssets as initialAssets } from '../mock/crypto-assets';
import { storage } from '../lib/storage';

export function useCryptoAssets(filters = {}) {
  const [assets, setAssets] = useState(() => storage.get('crypto_assets', initialAssets));
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  useEffect(() => {
    storage.set('crypto_assets', assets);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchId = item.id?.toLowerCase().includes(query);
        const matchAlgo = item.algorithm?.name?.toLowerCase().includes(query);
        const matchApp = item.context?.applicationName?.toLowerCase().includes(query);
        const matchPurpose = item.usage?.purpose?.toLowerCase().includes(query);
        if (!matchId && !matchAlgo && !matchApp && !matchPurpose) return false;
      }
      if (filters.riskBand && filters.riskBand !== 'all') {
        if (item.riskBand !== filters.riskBand) return false;
      }
      if (filters.quantum && filters.quantum !== 'all') {
        if (item.status?.quantum !== filters.quantum) return false;
      }
      if (filters.application && filters.application !== 'all') {
        if (item.context?.applicationId !== filters.application) return false;
      }
      return true;
    });
  }, [assets, filters]);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  return {
    assets: filteredAssets,
    rawAssets: assets,
    selectedAsset,
    selectedAssetId,
    setSelectedAssetId,
    setAssets
  };
}
