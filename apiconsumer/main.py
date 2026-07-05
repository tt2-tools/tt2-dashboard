import json
import os
from typing import Any, cast

import redis
import requests
import socketio

API_APP_TOKEN = os.environ.get("API_APP_TOKEN")
redis_host = os.environ.get("REDIS_HOST", "redis")

TOKENS = os.environ.get("TOKENS", "").split(",")
BANNED_EVENT = ["connected"]
QUEUE_NAME = "api_event"

r = redis.Redis(host=redis_host, port=6379, decode_responses=True)
sio = socketio.Client(logger=False, engineio_logger=False)


@sio.event(namespace="/raid")
def connect():
    print("Connected")
    response = requests.post(
        url="https://tt2-public.gamehivegames.com/raid/subscribe",
        headers={
            "API-Authenticate": API_APP_TOKEN,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        json=cast(dict[str, Any], {"player_tokens": TOKENS}),
    )
    if not response.ok:
        print("Failled to subscribe")
        print(response.text)
    else:
        res = response.json()
        print(res)


@sio.on(event="*", namespace="/raid")
def log(event_name, data=None):
    if event_name in BANNED_EVENT:
        return

    task = json.dumps({"event_name": event_name, "data": data})
    r.lpush(QUEUE_NAME, task)


@sio.event(namespace="/raid")
def connect_error(data):
    print(f"❌ Connection failed! Reason: {data}")


@sio.event(namespace="/raid")
def disconnect(reason):
    print(f"🔌 Disconnected! Reason: {reason}")


try:
    sio.connect(
        url="https://tt2-public.gamehivegames.com",
        socketio_path="/api/socket.io",
        transports=["websocket"],
        headers={"API-Authenticate": API_APP_TOKEN},
        namespaces=["/raid"],
    )
    sio.wait()
except Exception as e:
    print(f"Error during runtime: {e}")
