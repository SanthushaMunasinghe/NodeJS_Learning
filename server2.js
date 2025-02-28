import { Console } from 'console';
import http from 'http';

const PORT = process.env.PORT;

const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Jim Doe' }, ];

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
  
  // JSON middleware
const jsonMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
};
  
// Route handler for GET /api/users
const getUsersHandler = (req, res) => {
    res.write(JSON.stringify(users));
    res.end();
};

// Route handler for GET /api/users/:id
const getUserByIdHandler = (req, res) => {
    const id = req.url.split('/')[3];
    const user = users.find((user) => user.id === parseInt(id));
  
    if (user) {
      res.write(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.write(JSON.stringify({ message: 'User not found' }));
    }
    res.end();
  };

// Not found handler
const notFoundHandler = (req, res) => {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: 'Route not found' }));
    res.end();
};

// Route handler for POST /api/users
const createUserHandler = (req, res) => {
    let body = '';
    // Listen for data
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newUser = JSON.parse(body);
      users.push(newUser);
      res.statusCode = 201;
      res.write(JSON.stringify(newUser));
      res.end();
    });
  };
  
const server = http.createServer (async (req, res) => {
    logger(req, res, () => {
        try {
            if (req.method === 'GET') {
                jsonMiddleware(req, res, () => {
                    if (req.url === '/api/users') {
                        getUsersHandler(req, res);
                    } else if(req.url.match(/\/api\/users\/([0-9]+)/)) {
                        getUserByIdHandler(req, res);
                    } else {
                        notFoundHandler(req, res);
                    }
                });
            } else if (req.method === 'POST') {
                jsonMiddleware(req, res, () => {
                    if (req.url === '/api/users') {
                        createUserHandler(req, res);
                    } else {
                        console.log('Route Error');
                        res.end();
                    }
                })
            } else {
                throw new Error('Method Not Allowed');
            }
        }
        catch {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Server Error');
        }
    });
});

server.listen (PORT, () => {
    console.log(`server running in port ${PORT}`);
});