import React from 'react';

export const encodeHash = (data: { id: string; password: string }): string =>
  btoa(JSON.stringify(data));

const decodeHash = (hash: string): { id: string; password: string } | null => {
  try {
    const decoded = JSON.parse(atob(hash));
    if (
      typeof decoded.id === 'string' &&
      typeof decoded.password === 'string'
    ) {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// React Hook
const useHashPath = () => {
  const [currentPage, setCurrentPage] = React.useState<{
    id: string;
    password: string;
  } | null>(() => {
    const hash = window.location.hash.slice(1); // Remove the '#' character
    return decodeHash(hash);
  });

  const updateHash = React.useCallback((id: string, password: string) => {
    window.location.hash = encodeHash({ id, password });
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPage(decodeHash(hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return { currentPage, updateHash };
};

export default useHashPath;
