import Redis from 'ioredis';

export const redis = new Redis(/* we could put a default connection string here if we didn't want the default redis port.  However, the default will work fine for local development*/);
