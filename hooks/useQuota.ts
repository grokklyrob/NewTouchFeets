import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const ANONYMOUS_QUOTA_KEY = 'touchfeets_anonymous_quota';
const USER_QUOTA_KEY = 'touchfeets_user_quota';
const LAST_RESET_KEY = 'touchfeets_last_reset';

const INITIAL_ANONYMOUS_QUOTA = 3;
const INITIAL_USER_QUOTA = 5;

export const useQuota = (user: User | null) => {
  const [quota, setQuota] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  
  const userTier = user ? user.tier : 'anonymous';

  useEffect(() => {
    setIsReady(false);
    if (userTier === 'paid') {
      setQuota(Infinity);
      setIsReady(true);
      return;
    }

    if (userTier === 'anonymous') {
      const storedQuota = localStorage.getItem(ANONYMOUS_QUOTA_KEY);
      setQuota(storedQuota ? parseInt(storedQuota, 10) : INITIAL_ANONYMOUS_QUOTA);
    } else { // 'free' tier
      const lastResetStr = localStorage.getItem(LAST_RESET_KEY);
      const now = new Date();
      const currentMonth = `${now.getUTCFullYear()}-${now.getUTCMonth()}`;

      if (lastResetStr !== currentMonth) {
        localStorage.setItem(USER_QUOTA_KEY, String(INITIAL_USER_QUOTA));
        localStorage.setItem(LAST_RESET_KEY, currentMonth);
        setQuota(INITIAL_USER_QUOTA);
      } else {
        const storedQuota = localStorage.getItem(USER_QUOTA_KEY);
        setQuota(storedQuota ? parseInt(storedQuota, 10) : INITIAL_USER_QUOTA);
      }
    }
    setIsReady(true);
  }, [userTier]);

  const decrementQuota = useCallback(() => {
    if (userTier === 'paid') return;

    setQuota(prevQuota => {
      const newQuota = Math.max(0, prevQuota - 1);
      const key = userTier === 'anonymous' ? ANONYMOUS_QUOTA_KEY : USER_QUOTA_KEY;
      localStorage.setItem(key, String(newQuota));
      return newQuota;
    });
  }, [userTier]);

  return { quota, decrementQuota, isReady };
};
