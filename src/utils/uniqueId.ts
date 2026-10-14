let fallbackCounter = 0;

type CryptoWithRandomUUID = {
  randomUUID?: () => string;
};

export const createUniqueId = (): string => {
  const cryptoApi = (globalThis as typeof globalThis & {
    crypto?: CryptoWithRandomUUID;
  }).crypto;

  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }

  fallbackCounter += 1;
  return `${Date.now().toString(36)}-${fallbackCounter.toString(36)}-${Math.random().toString(36).slice(2)}`;
};
