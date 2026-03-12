#!/bin/bash
offset=0
while true; do
  echo "Syncing offset=$offset..."
  result=$(curl -s -X POST "https://artdeone.com/api/sync-newsletter?offset=$offset")
  echo "$result"
  echo ""
  if echo "$result" | grep -q '"has_more":false'; then
    echo "All done!"
    break
  fi
  if echo "$result" | grep -q '"has_more":true'; then
    offset=$(echo "$result" | grep -o '"next_offset":[0-9]*' | grep -o '[0-9]*')
    echo "Waiting 3 seconds..."
    sleep 3
  else
    echo "Error or unexpected response. Stopping."
    break
  fi
done
