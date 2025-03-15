// Custom Next.js server to handle lottie-web issue
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Define whether we're in development mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Mock document and window for server-side rendering
if (typeof window === 'undefined') {
  global.window = {};
  global.document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      getElementsByTagName: () => [],
      appendChild: () => {},
    }),
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: { style: {} },
    location: { protocol: 'https:' },
    body: { appendChild: () => {} },
  };
  global.navigator = { userAgent: 'node.js' };
}

app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true);
    
    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 