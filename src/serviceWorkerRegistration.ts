const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export type ServiceWorkerConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: ServiceWorkerConfig) {
  try {
    if (!(process.env.NODE_ENV === 'production')) throw new Error('yarn startのため、SWの登録は行いません');

    if (!('serviceWorker' in navigator)) throw new Error('ブラウザがSWに対応していないため、SWの登録は行いません');

    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) throw new Error('同一オリジンではないため、SWの登録は行いません');

    window.addEventListener('load', async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (!isLocalhost) return await registerValidSW(swUrl, config);

      checkValidServiceWorker(swUrl, config);

      await navigator.serviceWorker.ready;
      console.log('このWeb Appは、サービスワーカーによってcache-firstで提供されています。');
    });
  } catch (error) {
    if (error instanceof Error) return console.log(error.message);
    console.log(error);
  }
}

async function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);

    // 更新検知時の発火イベントを登録
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) return;

      installingWorker.onstatechange = () => {
        if (!(installingWorker.state === 'installed')) return;

        if (navigator.serviceWorker.controller && config && config.onUpdate) config.onUpdate(registration);
        if (!navigator.serviceWorker.controller && config && config.onSuccess) config.onSuccess(registration);
        
      };
    };
  } catch (error) {
    console.error('Error during service worker registration:', error);
  }
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}
