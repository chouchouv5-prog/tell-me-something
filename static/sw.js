const CACHE_NAME = 'tms-v1';
const ASSETS = [
  '/',
  '/app/',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/tms-logo.png',
  '/og-image.png',
  '/manifest.json'
];

// Install - mise en cache des fichiers statiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate - supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - stratégie Network First (toujours essayer le réseau d'abord)
// pour que les messages soient toujours à jour
self.addEventListener('fetch', e => {
  // Ne pas cacher les requêtes Supabase ou API
  if (e.request.url.includes('supabase') ||
      e.request.url.includes('resend') ||
      e.request.url.includes('pagead')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Si réseau OK, mettre en cache et retourner
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Si pas de réseau, utiliser le cache
        return caches.match(e.request);
      })
  );
});

// Push notifications (pour les futures notifications push)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Tell Me Something 🐱‍👤';
  const options = {
    body: data.body || 'You received a new anonymous message!',
    icon: '/tms-logo.png',
    badge: '/tms-logo.png',
    vibrate: [200, 100, 200],
    data: { url: '/app/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Clic sur notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || '/app/')
  );
});
