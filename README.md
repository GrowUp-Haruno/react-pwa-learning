# react-pwa-learning
serviceWorkerRegistrationの動きを理解する

## chapter1
GitHub Pagesとlocalhost(buildしてserve -s build)からページ読み込んだ際の
serviceWorkerRegistration.tsの変数の内容を確認する

### GitHub Pagesの場合
- process.env.NODE_ENV: production
- navigator.serviceWorker:  [object ServiceWorkerContainer]
- publicUrl.origin:         https://growup-haruno.github.io
- window.location.origin:   https://growup-haruno.github.io
- window.location.hostname: growup-haruno.github.io
- isLocalhost:              false
- swUrl:                    /react-pwa-learning/service-worker.js

### localhostの場合
- process.env.NODE_ENV: production
- navigator.serviceWorker: [object ServiceWorkerContainer]
- publicUrl.origin: http://localhost:3000
- window.location.origin: http://localhost:3000
- window.location.hostname: localhost
- isLocalhost: true
- swUrl: /service-worker.js

## chapter2
serviceWorkerRegistration.registerを理解できる形に修正する

### 修正前
```typescript
export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}
```

#### if(process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator){...}
- ```process.env.NODE_ENV```はyarn startした状態で'debelop'、buildした状態で'production'となり、前者の場合はSWの登録は行わない
- 'serviceWorker' in navigator はブラウザがService Workerに対応しているかの確認で、対応していない場合はSWの登録は行わない

#### if(publicUrl.origin !== window.location.origin){...}
- 同一オリジンのチェック、CDN経由で利用している場合はSWの登録は行わない

#### isLocalhost
- Localhostで接続判定
  - 後のaddEventListenerで接続先によって処理を変える際に使用する

### 修正後
```typescript
export function register(config?: Config) {
  try {
    if (!(process.env.NODE_ENV === 'production')) throw new Error('yarn startのため、SWの登録は行いません');
    if (!('serviceWorker' in navigator)) throw new Error('ブラウザがSWに対応していないため、SWの登録は行いません');

    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) throw new Error('同一オリジンではないため、SWの登録は行いません');

    window.addEventListener('load', async() => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (!isLocalhost) return registerValidSW(swUrl, config);

      checkValidServiceWorker(swUrl, config);

      await navigator.serviceWorker.ready;
      console.log('このWeb Appは、サービスワーカーによってcache-firstで提供されています。');
    });
  } catch (error) {
    if (error instanceof Error) return console.log(error.message);
    console.log(error);
  }
}
```