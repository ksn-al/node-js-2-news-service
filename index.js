import { createServer } from 'node:http';

let requestCount = 0;




const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
    requestCount++
      res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ "message": "Request handled successfully",
  "requestCount": requestCount }));
} else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ "message": "Not Found" }));
}

}

);

const portArg = process.argv.find(arg => arg.startsWith('--port='));
const port = portArg ? Number(portArg.split('=')[1]) : 3000;


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});