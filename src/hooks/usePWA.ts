import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWA() {
  const {
    offlineReady,
    needUpdate,
    updateServiceWorker,
  } = useRegisterSW() || {};

  const [isOfflineReady, setOfflineReady] = offlineReady || [false, () => {}];
  const [isNeedUpdate, setNeedUpdate] = needUpdate || [false, () => {}];

  const close = () => {
    if (typeof setOfflineReady === 'function') setOfflineReady(false);
    if (typeof setNeedUpdate === 'function') setNeedUpdate(false);
  };

  return {
    offlineReady: isOfflineReady,
    needUpdate: isNeedUpdate,
    updateServiceWorker: updateServiceWorker || (() => Promise.resolve()),
    close,
  };
}
