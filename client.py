import asyncio
import websockets


async def hello():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri, ping_interval=None) as websocket:
        await websocket.send("Hello, server!")
    response = await websocket.recv()
    print(f"Received: {response}")

asyncio.run(hello())
