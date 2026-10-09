# localspot

## Docker

Build and run the frontend container:

```sh
docker compose up --build
```

The app will be available at http://localhost:1010.

By default, Nginx serves the Vite build and proxies `/api` requests to `http://host.docker.internal:8000`. Override the backend target when needed:

```sh
API_PROXY_PASS=http://backend:8000 docker compose up --build
```
