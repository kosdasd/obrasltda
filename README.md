<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1NJvgpJj8-FH2HVEIXHTZOiYSFma6zjBR

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Local storage (dados)

- This project includes a lightweight Express server at `server/index.js` that accepts uploads and saves files under the `dados/` folder (organized into `photos/`, `videos/`, and `others/`).
- Upload endpoints used by the frontend (when available):
   - POST /api/upload/media  (field name: files) -> saves multiple files
   - POST /api/upload/story  (field name: file) -> saves a story file
   - POST /api/upload/music  (field name: file) -> saves a music file
- Files are served statically under `/uploads/...`, for example: `http://localhost:4000/uploads/photos/12345.jpg`.
- The frontend `services/api.ts` will attempt to upload to `http://localhost:4000` and fall back to the in-memory mock behavior if the server is not running.

How to run locally

- In one terminal run the backend: `npm run server`
- In another terminal run the frontend: `npm run dev`

Deploying to a VPS (example: domain https://obrasltda.com.br)

This repository already contains example configs to run the app on a VPS and expose it at `https://obrasltda.com.br`.

Files added for deploy:
- `deploy/nginx/obrasltda.com.br.conf` — example Nginx site config (serves `dist/`, proxies `/api` to the Node server and serves `/uploads/` from the DATA_DIR).
- `deploy/systemd/obras.service` — example systemd unit to run `node server/index.js` with `DATA_DIR=/var/lib/obras/dados`.

Quick deploy steps (Ubuntu example):

1. Prepare the server:
   ```bash
   sudo apt update
   sudo apt install -y nginx nodejs npm git
   sudo npm install -g pm2   # optional
   ```

2. Clone and install dependencies:
   ```bash
   sudo mkdir -p /srv/obras
   sudo chown $USER /srv/obras
   git clone https://github.com/asfdffdfd/obrasltda01.git /srv/obras
   cd /srv/obras
   npm ci
   npm run build
   ```

3. Create a persistent data directory and set ownership (matches `DATA_DIR` used in the systemd unit):
   ```bash
   sudo mkdir -p /var/lib/obras/dados/{photos,videos,others}
   sudo chown -R www-data:www-data /var/lib/obras/dados
   ```

4. Copy the systemd unit and enable the service (adjust paths if necessary):
   ```bash
   sudo cp deploy/systemd/obras.service /etc/systemd/system/obras.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now obras
   sudo journalctl -u obras -f
   ```

5. Install the Nginx site and reload Nginx:
   ```bash
   sudo cp deploy/nginx/obrasltda.com.br.conf /etc/nginx/sites-available/obrasltda.com.br
   sudo ln -s /etc/nginx/sites-available/obrasltda.com.br /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. (Optional) Enable HTTPS with Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d obrasltda.com.br -d www.obrasltda.com.br
   ```

Notes about uploads and availability
- The server stores files under the `DATA_DIR` (default `/var/lib/obras/dados` in the systemd unit). Make sure you have a persistent disk/volume for that path on the VPS.
- You asked to keep the current behavior where uploads are originated from your PC; in that setup uploads will only be received by the VPS when your PC syncs them (if you use rclone) or if the backend runs on the VPS. If you want uploads to work while your PC is off you must run the backend on the VPS (steps above). For now I left the app logic unchanged so uploads will behave as before.

If you want, I can also:
- update the frontend to use relative `/api` paths so the site works out-of-the-box behind the Nginx proxy, and
- add a Dockerfile/docker-compose instead of systemd if you prefer container-based deploys.


