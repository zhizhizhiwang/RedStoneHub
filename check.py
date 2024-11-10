#应该被部署在其他地方, 反正不在cloudflare

import asyncio
import http.client
import urllib.parse
import time
import mcstatus

def extract_uuid(request):
    lines = request.splitlines()
    for line in lines:
        if line.startswith("GET"):
            parts = line.split(" ")
            query = parts[1]
            uuid = query.split("=")[1]
            return uuid

async def tcp_server():
    server = await asyncio.start_server(handle_tcp_connection, '127.0.0.1', 3000)
    async with server:
        await server.serve_forever()

async def handle_tcp_connection(reader, writer):
    data = await reader.read(1024)
    received_data = data.decode('utf-8',errors='replace')
    uuid_value = extract_uuid(received_data)
    print(f'接收到的数据: {received_data}')

    http_response = await send_http_request(uuid_value)
    http_response = await send_http_request(uuid_value)
    response = f'HTTP/1.1 200 OK\r\n' \
            f'Content-Type: application/json\r\n' \
            f'Access-Control-Allow-Origin: *\r\n' \
            f'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n' \
            f'Access-Control-Allow-Headers: Content-Type, X-Requested-With\r\n\r\n' \
            f'{http_response}'
    writer.write(response.encode())
    await writer.drain()
    writer.close()

async def send_http_request(uuid_value):
    conn = http.client.HTTPConnection('localhost:23333')
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest'
    }
    query_string = f'?uuid={uuid_value}&remote_uuid=8ebd4105ff1e4a548f5d7e0f05714ca2&apikey=dcb2e8aaa74e4738bb5176515db3e78f'
    conn.request('GET', '/api/instance/' + query_string, headers=headers)
    response = conn.getresponse()
    response_data = response.read()
    print(f'HTTP 请求状态码: {response.status}')
    print(time.time())
    print(response_data.decode())
    return response_data.decode()

async def main():
    await tcp_server()

if __name__ == '__main__':
    print("进程已启动")
    asyncio.run(main())


