import os from 'os';


const server = Bun.serve({
  port: 3002,
  fetch(req) {
    console.info(`Received request: ${req.method} ${req.url}`);
    // console.info(`Headers:`, req.headers);
    console.info(`Body:`, req.body);

    return new Response("Bun!");
  },
});


function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1';
}

console.log(`Listening on http://${getLocalIP()}:${server.port} ...`);
