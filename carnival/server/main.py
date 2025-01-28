import asyncio
import websockets
import json
import networkx
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

graph = networkx.DiGraph()
father = "start"


def opt(message: str):
    try:
        message_json = json.loads(message)
        current_scene_json = message_json["currentScene"]
        current_scene_name = current_scene_json['sceneName'].replace('.txt', '')
        logging.debug(f"now scene is {current_scene_name}, stack is {message_json['sceneStack']}")
    except Exception as e:
        logging.debug("收到" + message)

async def echo(websocket):
    try:
        # 打印握手信息用于调试

        async for message in websocket:
            opt(message)
            status_code = 200
            send_code = "pong" if message == "ping" else json.dumps({"status": status_code, "now_node": 0})
            await websocket.send(send_code)
    except websockets.exceptions.ConnectionClosed as e:
        logging.info(f"Connection closed: {e}")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")


async def main():
    # 正确配置服务器参数
    server = await websockets.serve(
        echo,
        "0.0.0.0",
        8765,
        origins=None,  # 允许所有 Origin
        process_request=None  # 完全禁用 Host 验证
    )

    # 设置全局异常处理
    loop = asyncio.get_event_loop()

    def exception_handler(loop, context):
        msg = context.get("exception", context["message"])
        logging.error(f"Caught global exception: {msg}")

    loop.set_exception_handler(exception_handler)

    logging.info("WebSocket server is running on ws://localhost:8765")
    await asyncio.Future()  # 运行直到手动停止


if __name__ == "__main__":
    asyncio.run(main())
