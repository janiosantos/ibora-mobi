import socket

host = "localhost"
port = 5672

try:
    with socket.create_connection((host, port), timeout=2):
        print("RabbitMQ is UP")
except Exception as e:
    print(f"RabbitMQ is DOWN: {e}")
