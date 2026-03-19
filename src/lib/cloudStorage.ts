function getCloudStorage() {
  try {
    return window.Telegram?.WebApp?.CloudStorage ?? null;
  } catch {
    return null;
  }
}

export function cloudGet(key: string): Promise<string | null> {
  const cloud = getCloudStorage();
  if (!cloud) {
    return Promise.resolve(localStorage.getItem(key));
  }
  return new Promise((resolve) => {
    cloud.getItem(key, (error, value) => {
      if (error || value === undefined || value === '') {
        resolve(null);
      } else {
        resolve(value);
      }
    });
  });
}

export function cloudSet(key: string, value: string): Promise<void> {
  const cloud = getCloudStorage();
  if (!cloud) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    cloud.setItem(key, value, () => {
      resolve();
    });
  });
}

export function cloudRemove(key: string): Promise<void> {
  const cloud = getCloudStorage();
  if (!cloud) {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    cloud.removeItem(key, () => {
      resolve();
    });
  });
}
