const staticCacheName = 'restaurant-local-001';

// list of assets to cache on install
// cache each restaurant detail page as well
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll([
          './',
          '/index.html',
          '/restaurant.html',
          '/css/styles.css',
          '/css/additionalCSS.css',
          '/js/dbhelper.js',
          '/js/sw.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/data/restaurants.json',
          'img/1.jpg',
          'img/2.jpg',
          'img/3.jpg',
          'img/4.jpg',
          'img/5.jpg',
          'img/6.jpg',
          'img/7.jpg',
          'img/8.jpg',
          'img/9.jpg',
          'img/10.jpg',
          'http://localhost:8000/restaurant.html?id=1',
          'http://localhost:8000/restaurant.html?id=2',
          'http://localhost:8000/restaurant.html?id=3',
          'http://localhost:8000/restaurant.html?id=4',
          'http://localhost:8000/restaurant.html?id=5',
          'http://localhost:8000/restaurant.html?id=6',
          'http://localhost:8000/restaurant.html?id=7',
          'http://localhost:8000/restaurant.html?id=8',
          'http://localhost:8000/restaurant.html?id=9',
          'http://localhost:8000/restaurant.html?id=10',
        ]).catch(error => {
          console.log('Caches open failed: ' + error);
        });
      })
  );
});

// intercept all requests
// either return cached asset or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(

    // Add cache.put to cache images on each fetch
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(error => {
       console.log(error, 'no cache entry for:', event.request.url);
      return new Response('Not connected to the internet', {
        status: 404,
        statusText: "Not connected to the internet"
      });
    })
  );
});

// delete old/unused static caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-local-') && cacheName !== staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
