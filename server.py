import http.server
import ssl
import os
import webbrowser
from urllib.parse import urlparse, parse_qs

# HTTPS用の証明書を作成
import OpenSSL
from OpenSSL import crypto, SSL

def create_self_signed_cert():
    # 証明書の作成
    key = crypto.PKey()
    key.generate_key(crypto.TYPE_RSA, 2048)
    
    cert = crypto.X509()
    cert.get_subject().C = "JP"  # 国
    cert.get_subject().ST = "Tokyo"  # 都道府県
    cert.get_subject().L = "Tokyo"  # 市区町村
    cert.get_subject().O = "My Organization"  # 組織名
    cert.get_subject().OU = "My Unit"  # 組織単位
    cert.get_subject().CN = "localhost"  # 共通名
    
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(10*365*24*60*60)  # 10年有効
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(key)
    cert.sign(key, 'sha256')
    
    # ファイルに保存
    with open("server.key", "wb") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, key))
    with open("server.crt", "wb") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))

# 証明書の作成
cert_file = "server.crt"
key_file = "server.key"

if not os.path.exists(cert_file) or not os.path.exists(key_file):
    create_self_signed_cert()

# HTTPSサーバーの設定
class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # パスの解析
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        # タイマーコントロールの処理
        if parsed_path.path == '/control':
            action = query_params.get('action', [''])[0]
            if action in ['start', 'stop', 'reset']:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(f"{{'status': 'success', 'action': '{action}'}}".encode())
                return
        
        # その他のリクエストは通常の処理
        super().do_GET()

# サーバーの起動
PORT = 4443
with http.server.HTTPServer(('localhost', PORT), MyHandler) as httpd:
    httpd.socket = ssl.wrap_socket(httpd.socket,
                                 server_side=True,
                                 certfile=cert_file,
                                 keyfile=key_file,
                                 ssl_version=ssl.PROTOCOL_TLS)
    print(f"Starting HTTPS server on https://localhost:{PORT}")
    
    # ブラウザで開く
    webbrowser.open(f'https://localhost:{PORT}')
    
    # サーバーを実行
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
