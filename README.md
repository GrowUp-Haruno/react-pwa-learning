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