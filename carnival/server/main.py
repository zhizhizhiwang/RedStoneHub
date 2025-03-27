# ws_server.py
import asyncio
import websockets
import threading
from aioconsole import ainput

class WSServer:
    def __init__(self):
        self.clients = set()
        self.current_data = "0"
        self.running = True

    async def handler(self, websocket):
        self.clients.add(websocket)
        try:
            await websocket.send(self.current_data)
            async for message in websocket:
                print(f"收到客户端消息: {message}")
        finally:
            self.clients.remove(websocket)

    async def update_data(self):
        while self.running:
            new_data = await ainput("输入新数据 (输入 'exit' 退出): ")
            if new_data.lower() == 'exit':
                self.running = False
                await self.shutdown()
                break
            self.current_data = new_data
            await self.broadcast(new_data)

    async def broadcast(self, message):
        if self.clients:
            await asyncio.gather(
                *[client.send(message) for client in self.clients]
            )

    async def shutdown(self):
        for ws in self.clients:
            await ws.close()
        print("服务已关闭")

async def main():
    server = WSServer()
    async with websockets.serve(server.handler, "localhost", 8765):
        # 启动控制台输入协程
        asyncio.create_task(server.update_data())
        print("WebSocket 服务已启动 ws://localhost:8765")
        while server.running:
            await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
