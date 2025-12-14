// // public/sw.js
// const CACHE_NAME = 'gallery-cache-v1'; // Версия кэша для обновлений
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/static/js/bundle.js', // Основной JS-бандл (проверьте путь в build)
//   '/static/css/main.css', // Основной CSS (проверьте путь)
//   // Добавьте критические изображения или аудио, если они статические
//   // '/sounds/sea.mp3', // Пример для аудио
//   // '/images/example.webp', // Пример для изображений
// ];

// // Установка SW и кэширование ресурсов
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing.');
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//       .catch((error) => {
//         console.error('Failed to cache resources:', error);
//       })
//   );
//   // Принудительная активация без ожидания закрытия вкладок
//   self.skipWaiting();
// });

// // Активация SW и очистка старого кэша
// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activating.');
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log('Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
//   // Захват контроля над клиентами
//   self.clients.claim();
// });

// // Обработка запросов: сначала кэш, затем сеть
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         // Возвращаем из кэша, если есть
//         if (response) {
//           return response;
//         }
//         // Иначе загружаем из сети
//         return fetch(event.request).then((response) => {
//           // Кэшируем новые ресурсы (опционально, только для GET-запросов)
//           if (!response || response.status !== 200 || response.type !== 'basic') {
//             return response;
//           }
//           const responseToCache = response.clone();
//           caches.open(CACHE_NAME)
//             .then((cache) => {
//               cache.put(event.request, responseToCache);
//             });
//           return response;
//         });
//       })
//       .catch(() => {
//         // Fallback для оффлайн (например, кэшированная страница)
//         if (event.request.destination === 'document') {
//           return caches.match('/index.html');
//         }
//       })
//   );
// });