import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkOnly, NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BASE_URL } from './config';
import { BackgroundSyncPlugin } from 'workbox-background-sync';


const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);
 

registerRoute(
  ({ url }) => {
    return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);
registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);
registerRoute(
  ({ url }) => {
    return url.origin === 'https://ui-avatars.com';
  },
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'citycare-api',
  }),
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new new(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'citycare-api-images',
  }),
);
registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);
const bgSyncPlugin = new BackgroundSyncPlugin('formQueue', {
  maxRetentionTime: 24 * 60, // simpan request hingga 24 jam
});
registerRoute(
  ({ url, request }) => {
    const baseUrl = new URL(BASE_URL);
    return request.method === 'POST' && url.origin === baseUrl.origin && url.pathname.startsWith('/reports');
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
self.addEventListener('push', (event) => {
  console.log('[Service worker] pushing...');

  async function showNotification() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(showNotification());
});
