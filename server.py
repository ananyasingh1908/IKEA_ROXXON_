import http.server
import os
import urllib.parse

PORT = 8080
DIRECTORY = os.path.abspath(os.path.dirname(__file__))

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent aggressive browser caching of static scripts during dev
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        try:
            # Parse path
            parsed_url = urllib.parse.urlparse(self.path)
            path = parsed_url.path.rstrip('/')

            # Clean route rewrites
            route_map = {
                '/marketplace': '/marketplace.html',
                '/secondhand': '/secondhand.html',
                '/product': '/product.html',
                '/checkout': '/checkout.html',
                '/shopping-bag': '/shopping-bag.html',
                '/cart': '/shopping-bag.html',
                '/bag': '/shopping-bag.html',
                '/planner': '/planner.html',
                '/intro': '/intro.html',
                '/spylt': '/spylt.html',
                '/login': '/login.html',
                '/auth': '/login.html',
                '/signin': '/login.html',
                '/join': '/login.html',
                '/register': '/login.html',
            }

            if path.startswith('/product/'):
                prod_id = path.replace('/product/', '')
                query = f"?id={prod_id}&{parsed_url.query}" if parsed_url.query else f"?id={prod_id}"
                self.path = '/product.html' + query
            elif path.startswith('/marketplace/product/'):
                prod_id = path.replace('/marketplace/product/', '')
                query = f"?id={prod_id}&{parsed_url.query}" if parsed_url.query else f"?id={prod_id}"
                self.path = '/product.html' + query
            elif path in route_map:
                query = f"?{parsed_url.query}" if parsed_url.query else ""
                self.path = route_map[path] + query
            elif path and not os.path.exists(os.path.join(DIRECTORY, path.lstrip('/'))):
                # Check if adding .html matches a file
                html_candidate = os.path.join(DIRECTORY, path.lstrip('/') + '.html')
                if os.path.exists(html_candidate):
                    query = f"?{parsed_url.query}" if parsed_url.query else ""
                    self.path = path + '.html' + query

            return super().do_GET()
        except (ConnectionResetError, BrokenPipeError):
            pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            pass

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, SPARequestHandler)
    print(f"IKEA & SPYLT Multi-Threaded Server running at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
