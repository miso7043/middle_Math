#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
conf=/etc/nginx/sites-available/rp-yoon-duckdns.conf
snippet=/etc/nginx/snippets/mid-math.conf
backup=$(mktemp -d /var/backups/mid-math.XXXXXXXX)
cp -a "$conf" "$backup/site.conf"
if [ -e "$snippet" ]; then cp -a "$snippet" "$backup/snippet.conf"; fi
rollback() {
    cp -a "$backup/site.conf" "$conf"
    if [ -e "$backup/snippet.conf" ]; then cp -a "$backup/snippet.conf" "$snippet"; else rm -f "$snippet"; fi
    nginx -t && systemctl reload nginx
}
trap rollback ERR
curl --fail --silent http://127.0.0.1:8040/healthz
install -m644 nginx-host.conf "$snippet"
python3 - "$conf" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
s = p.read_text()
include = '    include /etc/nginx/snippets/mid-math.conf;'
anchor = '    include /etc/nginx/snippets/hamonica-pi.conf;'
if include not in s:
    if s.count(anchor) != 1:
        raise SystemExit('Expected exactly one HTTPS harmonica include; no changes made')
    p.write_text(s.replace(anchor, anchor + '\n' + include))
PY
nginx -t
systemctl reload nginx
curl --retry 5 --retry-all-errors --retry-delay 1 --resolve rp-yoon.duckdns.org:443:127.0.0.1 --fail --silent --show-error -o /dev/null https://rp-yoon.duckdns.org/mid-math/
trap - ERR
printf 'Enabled https://rp-yoon.duckdns.org/mid-math/; backup: %s\n' "$backup"
