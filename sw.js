/* =====================================================
   My Learning World — Service Worker
   https://msleduc87474.github.io/my-learning-world/
   ===================================================== */

var CACHE = 'mlw-cache-v1';

var FILES = [
  '/my-learning-world/homepage.html',
  '/my-learning-world/index.html',
  '/my-learning-world/teacher_dashboard.html',
  '/my-learning-world/social_story_creator.html',
  '/my-learning-world/calm_down_corner.html',
  '/my-learning-world/visual_timer.html',
  '/my-learning-world/token_board.html',
  '/my-learning-world/math_leduc.html',
  '/my-learning-world/science_leduc.html',
  '/my-learning-world/literacy_leduc.html',
  '/my-learning-world/emotional_leduc.html',
  '/my-learning-world/social_leduc.html',
  '/my-learning-world/life_leduc.html',
  '/my-learning-world/counting_garden_printable.html',
  '/my-learning-world/plant_parts_printable.html',
  '/my-learning-world/short_a_words_printable.html',
  '/my-learning-world/emotional_regulation_printable.html',
  '/my-learning-world/social_skills_printable.html',
  '/my-learning-world/life_skills_printable.html',
  '/my-learning-world/hand_pointer.png',
  '/my-learning-world/manifest.json',
  '/my-learning-world/icons/icon-192.png',
  '/my-learning-world/icons/icon-512.png'
];

/* Install — cache everything */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(
        FILES.map(function(url) {
          return fetch(url).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {
            console.log('[SW] Could not cache: ' + url);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* Activate — remove old caches */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Fetch — serve from cache, fall back to network */
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function() {
        return caches.match('/my-learning-world/homepage.html');
      });
    })
  );
});
