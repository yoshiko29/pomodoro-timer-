const https = require('https');
const fs = require('fs');
const path = require('path');

// セルフサイン証明書の作成
const { spawn } = require('child_process');

function createSelfSignedCert() {
    const certPath = path.join(__dirname, 'cert');
    if (!fs.existsSync(certPath)) {
        fs.mkdirSync(certPath);
    }

    // OpenSSLを使用して証明書を作成
    const openssl = spawn('openssl', [
        'req',
        '-x509',
        '-newkey', 'rsa:2048',
        '-keyout', path.join(certPath, 'key.pem'),
        '-out', path.join(certPath, 'cert.pem'),
        '-days', '365',
        '-nodes',
        '-subj', '/C=JP/ST=Tokyo/L=Tokyo/O=MyOrg/CN=localhost'
    ]);

    openssl.on('close', (code) => {
        if (code === 0) {
            console.log('証明書の作成が完了しました');
            startServer();
        } else {
            console.error('証明書の作成に失敗しました');
        }
    });
}

function startServer() {
    const certPath = path.join(__dirname, 'cert');
    const options = {
        key: fs.readFileSync(path.join(certPath, 'key.pem')),
        cert: fs.readFileSync(path.join(certPath, 'cert.pem'))
    };

    const server = https.createServer(options, (req, res) => {
        const filePath = path.join(__dirname, req.url === '/' ? 'index_https.html' : req.url);
        
        if (req.url === '/control') {
            const params = new URLSearchParams(req.url.split('?')[1]);
            const action = params.get('action');
            
            if (['start', 'stop', 'reset'].includes(action)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', action }));
                return;
            }
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });

    const PORT = 4443;
    server.listen(PORT, () => {
        console.log(`HTTPSサーバーが起動しました: https://localhost:${PORT}`);
        require('open')(`https://localhost:${PORT}`);
    });
}

// サーバーの起動
createSelfSignedCert();
