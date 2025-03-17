// Exemplo de uso do Workbox (se quiser utilizar as estratégias do Workbox, você pode configurar aqui)
// Se não for usar Workbox, pode remover a linha de import.
// Mas não esqueça de remover também qualquer chamada do Workbox no restante do código.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "todo-list-cache-v1";
const OFFLINE_PAGE = "/offline.html";

// Inclua o OFFLINE_PAGE dentro do array principal
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png"
];

// Instalação: abre (ou cria) o cache e adiciona todos os assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: remove caches antigos se o nome do cache for diferente
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta requisições para fornecer resposta do cache ou da rede
self.addEventListener("fetch", (event) => {
  // Se for navegação (HTML), tentamos buscar online; se falhar, usamos offline.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a resposta for válida, retornamos, senão tentamos a página offline
          return response || fetch(OFFLINE_PAGE);
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(OFFLINE_PAGE);
        })
    );
  } else {
    // Se não for navegação, tentamos buscar no cache primeiro
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

// Permitir que este SW seja atualizado imediatamente quando baixado
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
