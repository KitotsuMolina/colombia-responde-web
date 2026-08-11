# Colombia Responde Web

Frontend público React + TypeScript y PWA de Colombia Responde. Este repositorio se despliega independientemente en Cloudflare Pages y no contiene backend ni infraestructura global.

## Desarrollo

```bash
npm ci
cp .env.example .env
npm run dev
```

`VITE_API_BASE_URL` define la API. En producción debe apuntar al dominio HTTPS de la API; el proxy `/api` de Vite existe únicamente para desarrollo local.

## Verificación

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `24`
- Variables públicas: las documentadas en `.env.example`

Nunca deben almacenarse secretos en variables `VITE_*`, porque quedan incorporadas al JavaScript público.
