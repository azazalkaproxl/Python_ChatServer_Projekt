import asyncio
import websockets
import json
import os
from datetime import datetime

MESSAGES_FILE = "messages.json"
clients = set()

def load_messages():
    if not os.path.exists(MESSAGES_FILE):
        return []
    with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_message(message):
    messages = load_messages()
    messages.append(message)
    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

async def handler(websocket):
    clients.add(websocket)

    # send history
    for msg in load_messages():
        await websocket.send(
            f"{msg['username']}|{msg['text']}|{msg['time']}"
        )

    try:
        async for data in websocket:
            username, text = data.split("|", 1)
            time = datetime.now().strftime("%H:%M")

            message = {
                "username": username,
                "text": text,
                "time": time
            }

            save_message(message)

            for client in clients:
                await client.send(
                    f"{username}|{text}|{time}"
                )
    finally:
        clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8000):
        print("✅ WebSocket server running on ws://127.0.0.1:8000")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
