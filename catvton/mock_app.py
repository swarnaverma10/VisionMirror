import json, sys, io
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# Use a realistic AI generated image from the assets directory
try:
    MOCK_IMG = Path(r'c:\Users\OMEN\Desktop\VisionMirror\frontend\public\assets\models\model_women_01.jpg').read_bytes()
except Exception:
    MOCK_IMG = Path(r'c:\Users\OMEN\Desktop\VisionMirror\frontend\public\assets\products\women\gowns\gowns_01.jpg').read_bytes()

UPLOADS = {}

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f'[MOCK] {fmt % args}', flush=True)

    def send_json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = self.path
        if p == '/' or p == '':
            self.send_json(200, {'message': 'Gradio mock'})
        elif p == '/info':
            self.send_json(200, {'named_endpoints': {'predict': {}}})
        elif p.startswith('/call/predict/'):
            eid = p.split('/')[-1]
            img_path = f'/tmp/mock_result_{eid}.jpg'
            UPLOADS[img_path] = MOCK_IMG
            body = f'event: complete\ndata: [{{"path": "{img_path}"}}]\n\n'.encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.end_headers()
            self.wfile.write(body)
        elif p.startswith('/file='):
            fp = p[6:]
            img = UPLOADS.get(fp, MOCK_IMG)
            self.send_response(200)
            self.send_header('Content-Type', 'image/jpeg')
            self.send_header('Content-Length', str(len(img)))
            self.end_headers()
            self.wfile.write(img)
        else:
            self.send_json(404, {'error': 'not found'})

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        if length > 0:
            body = self.rfile.read(length)
        p = self.path
        if p == '/upload':
            self.send_json(200, ['/tmp/mock_upload.jpg'])
        elif p.startswith('/call/predict'):
            self.send_json(200, {'event_id': 'mock-event-456'})
        else:
            self.send_json(404, {'error': 'not found'})

print('Running on local URL:  http://0.0.0.0:7860', flush=True)
HTTPServer(('0.0.0.0', 7860), Handler).serve_forever()
