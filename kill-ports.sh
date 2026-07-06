#!/bin/bash
PORTS=(3001 5173)

for port in "${PORTS[@]}"; do
  pids=$(lsof -ti:"$port")
  if [ -n "$pids" ]; then
    echo "Killing port $port (PID $pids)"
    echo "$pids" | xargs kill -9
  else
    echo "Port $port is free"
  fi
done
