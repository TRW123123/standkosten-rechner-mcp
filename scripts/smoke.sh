#!/usr/bin/env bash
# Lokaler MCP-Smoke: initialize, tools/list, tools/call positiv und negativ.
set -euo pipefail
base="${1:-http://127.0.0.1:8789}"
call() {
  curl --fail-with-body --silent --show-error --max-time 10 "$base/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data "$1"
  echo
}
curl --fail --silent --show-error --max-time 10 "$base/health"; echo
call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}'
call '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"berechne_standkosten","arguments":{"bestand":100,"durchschnittliche_standtage":81,"antrieb":"verbrenner"}}}'
call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_standtage_kennzahlen","arguments":{}}}'
echo '# negativ (erwartet isError=true):'
call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"berechne_standkosten","arguments":{"bestand":0,"durchschnittliche_standtage":81}}}'
