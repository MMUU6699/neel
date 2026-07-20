#!/usr/bin/env bash
# Run on leetbot to wire analytics.REPLACE_WITH_YOUR_DOMAIN.com → Umami (127.0.0.1:3001).
#
# Usage:
#   ./scripts/setup-analytics.sh bootstrap   # HTTP-only nginx + certbot
#   ./scripts/setup-analytics.sh finish      # HTTPS nginx after cert issued
#   ./scripts/setup-analytics.sh verify      # smoke tests
#   ./scripts/setup-analytics.sh website     # ensure Index website in Umami DB

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_AVAILABLE="/etc/nginx/sites-available/analytics-index"
NGINX_ENABLED="/etc/nginx/sites-enabled/analytics-index"
UMAMI_WEBSITE_ID="${UMAMI_WEBSITE_ID:-eb985e75-d6fe-42d3-8e24-0de58c4bf22c}"
UMAMI_DOMAIN="${UMAMI_DOMAIN:-REPLACE_WITH_YOUR_DOMAIN.com}"

cmd="${1:-bootstrap}"

ensure_umami_website() {
  local exists
  exists="$(sudo docker exec umami-db-1 psql -U umami -d umami -tAc \
    "SELECT 1 FROM website WHERE website_id = '${UMAMI_WEBSITE_ID}' LIMIT 1;" 2>/dev/null || true)"
  if [[ "$exists" == "1" ]]; then
    echo "umami website ${UMAMI_WEBSITE_ID} already exists"
    return 0
  fi

  local admin_id
  admin_id="$(sudo docker exec umami-db-1 psql -U umami -d umami -tAc \
    "SELECT user_id FROM \"user\" WHERE username = 'admin' LIMIT 1;")"
  if [[ -z "$admin_id" ]]; then
    echo "umami admin user not found" >&2
    exit 1
  fi

  sudo docker exec umami-db-1 psql -U umami -d umami -c \
    "INSERT INTO website (website_id, name, domain, user_id, created_by, replay_enabled)
     VALUES ('${UMAMI_WEBSITE_ID}', 'Index', '${UMAMI_DOMAIN}', '${admin_id}', '${admin_id}', true);"
  echo "created umami website Index (${UMAMI_WEBSITE_ID})"
}

bootstrap() {
  sudo cp "$ROOT/scripts/nginx-analytics-index-bootstrap.conf" "$NGINX_AVAILABLE"
  sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  sudo nginx -t
  sudo systemctl reload nginx
  echo "bootstrap nginx live for analytics.REPLACE_WITH_YOUR_DOMAIN.com"
}

issue_cert() {
  sudo certbot certonly --webroot \
    -w /var/www/certbot \
    -d analytics.REPLACE_WITH_YOUR_DOMAIN.com \
    --non-interactive --agree-tos -m admin@REPLACE_WITH_YOUR_DOMAIN.com \
    || sudo certbot certonly --nginx \
      -d analytics.REPLACE_WITH_YOUR_DOMAIN.com \
      --non-interactive --agree-tos -m admin@REPLACE_WITH_YOUR_DOMAIN.com
  echo "certificate issued for analytics.REPLACE_WITH_YOUR_DOMAIN.com"
}

finish() {
  sudo cp "$ROOT/scripts/nginx-analytics-index.conf" "$NGINX_AVAILABLE"
  sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  sudo nginx -t
  sudo systemctl reload nginx
  echo "HTTPS nginx live for analytics.REPLACE_WITH_YOUR_DOMAIN.com"
}

verify() {
  echo "== local umami heartbeat =="
  curl -fsS http://127.0.0.1:3001/api/heartbeat
  echo

  echo "== nginx host routing (HTTP) =="
  curl -fsS -H "Host: analytics.REPLACE_WITH_YOUR_DOMAIN.com" http://127.0.0.1/api/heartbeat
  echo

  if curl -fsS https://analytics.REPLACE_WITH_YOUR_DOMAIN.com/api/heartbeat 2>/dev/null; then
    echo
    echo "== public HTTPS heartbeat OK =="
    curl -fsSI https://analytics.REPLACE_WITH_YOUR_DOMAIN.com/login | head -5
    echo
    echo "== tracker script =="
    curl -fsSI "https://analytics.REPLACE_WITH_YOUR_DOMAIN.com/script.js" | head -3
  else
    echo "public HTTPS not ready yet (DNS or cert pending)" >&2
    exit 1
  fi
}

case "$cmd" in
  bootstrap) bootstrap ;;
  cert) issue_cert ;;
  finish) finish ;;
  verify) verify ;;
  website) ensure_umami_website ;;
  all)
    ensure_umami_website
    bootstrap
    issue_cert
    finish
    verify
    ;;
  *)
    echo "usage: $0 bootstrap|cert|finish|verify|website|all" >&2
    exit 1
    ;;
esac
