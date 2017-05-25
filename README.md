# Unicycle
Unicycle is a Cycle.js boilerplate for universal (aka isomorphic) progressive web-apps, preconfigured with HMR and ServiceWorker via Webpack.

## Features
- Ready-to-go Webpack config with HMR, ServiceWorker functionality is provided using the `offline-plugin` for webpack.
- Self-contained Koa.js HTTP server that can both serve static builds for a staging/production environment or serve a live build of your application for a development environment via Webpack dev-server & HMR middlewares
- A basic scaffold for a universal application. Includes:
  - A HTML Boilerplate that wraps your client-side app's DOM with necessary `<script>` and `<link>` tags to serve your UI via SSR
  - A basic API example endpoint
  - A basic page configured to make a request to the API endpoint mentioned above and display the result in the DOM, a good example to show your application behaving isomorphically and rendering the same result whether on the Server or Client, even if it needs to await data asynchronously.
  - A basic page with a timer component utilizing `@cycle/time`, a good example to show `cycle-restart` doing it's thing and persisting your application state across HMR updates.
- Some sample routes that are passed to `switch-path`, including blacklisting of paths that shouldn't be handled by the Client.

# Limitations
- HMR is currently client-only. It would be awesome to have the server use HMR too but implementation of this needs to be ironed out. Just whacking the entire server in HMR breaks it for the client-side because changes to the client code will also be detected as changes to the server code (since the server imports the client for SSR), so if you change the client the server will restart causing the client running in your browser to disconnect from HMR and not get the seamless update.

## Getting Started
To make a static build and serve it via Koa:
```
npm run start
```

To start a Koa server serving a live build of your app via HMR:
```
npm run start:dev
```
