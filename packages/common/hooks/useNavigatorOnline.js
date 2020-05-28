import { useState, useEffect } from 'react';
import { isClient } from '@caesar/common/utils/isEnvironment';

export const useNavigatorOnline = () => {
  const [isOnline, setIsOnline] = useState(isClient ? navigator.onLine : true);

  const handleOnlineEvent = () => setIsOnline(true);
  const handleOfflineEvent = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  return isOnline;
};
