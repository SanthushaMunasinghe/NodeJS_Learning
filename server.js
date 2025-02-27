import http from 'http';
const PORT = process.env.PORT;

const server = http.createServer ((req, res) => {
    try {
        if (req.method === 'GET') {
            if (req.url === '/') {
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1> Home Page </h1>');
            } else if (req.url === '/about') {
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1> About Page </h1>');
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not Found');
            }
        } else {
            throw new Error('Method Not Allowed');
        }
    }
    catch {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server Error');
    }

    // res.writeHead(500, {'Content-Type': 'application/json'})
    // res.end(JSON.stringify({message: 'Serve Error'}));
});

server.listen (PORT, () => {
    console.log(`server running in port ${PORT}`);
});