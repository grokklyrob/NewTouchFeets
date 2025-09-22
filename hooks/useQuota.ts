
import { useState, useEffect, useCallback } from 'react';

const QUOTA_KEY = 'touchfeets_quota';
const LAST_RESET_KEY = 'touchfeets_last_reset';
const INITIAL_QUOTA = 5;

export const useQuota = () => {
  const [quota, setQuota] = useState<number>(INITIAL_QUOTA);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const lastResetStr = localStorage.getItem(LAST_RESET_KEY);
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${now.getUTCMonth()}`;

    if (lastResetStr !== currentMonth) {
      localStorage.setItem(QUOTA_KEY, String(INITIAL_QUOTA));
      localStorage.setItem(LAST_RESET_KEY, currentMonth);
      setQuota(INITIAL_QUOTA);
    } else {
      const storedQuota = localStorage.getItem(QUOTA_KEY);
      setQuota(storedQuota ? parseInt(storedQuota, 10) : INITIAL_QUOTA);
    }
    setIsReady(true);
  }, []);

  const decrementQuota = useCallback(() => {
    setQuota(prevQuota => {
      const newQuota = Math.max(0, prevQuota - 1);
      localStorage.setItem(QUOTA_KEY, String(newQuota));
      return newQuota;
    });
  }, []);

  return { quota, decrementQuota, isReady };
};
