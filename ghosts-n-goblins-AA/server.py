import http.server
import socketserver
import os

PORT = 8004

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="./", **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

print(f"Iniciando servidor en http://localhost:{PORT}")
print(f"Abre http://localhost:{PORT}/ghosts-n-goblins/ en tu navegador")
print("Presiona Ctrl+C para detener el servidor")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido") 