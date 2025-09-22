import http.server
import socketserver
import subprocess
import urllib.parse

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/run"):            
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            name = params.get("name", [""])[0]
            
            process = subprocess.Popen(["python3", "hello.py", name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(stdout)
        else:
            super().do_GET()

PORT = 8000

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
