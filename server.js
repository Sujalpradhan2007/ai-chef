const http = require("http");
const fs = require("fs");
const path = require("path");

// Resolve files relative to this script, so `node server.js` works from any folder.
const root = __dirname;
const frontendHost = "127.0.0.1";
const frontendPort = Number(process.env.FRONTEND_PORT || 5500);
const backendHost = "127.0.0.1";
const backendPort = Number(process.env.BACKEND_PORT || 5000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http
  .createServer((request, response) => {
    const requested = decodeURIComponent(request.url.split("?")[0]);

    // Proxy API calls through the frontend server so the browser can use
    // relative URLs such as /api/ai/chat without CORS or port problems.
    if (requested.startsWith("/api/")) {
      const proxyRequest = http.request(
        {
          hostname: backendHost,
          port: backendPort,
          path: request.url,
          method: request.method,
          headers: {
            ...request.headers,
            host: `${backendHost}:${backendPort}`
          }
        },
        proxyResponse => {
          response.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
          proxyResponse.pipe(response);
        }
      );

      proxyRequest.on("error", () => {
        if (!response.headersSent) {
          response.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
        }
        response.end(JSON.stringify({
          success: false,
          message: "Backend server is not running. Start backend/app.py first."
        }));
      });

      request.pipe(proxyRequest);
      return;
    }

    const relative = requested === "/" ? "/index.html" : requested;
    const filePath = path.resolve(root, `.${relative}`);

    if (!filePath.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        response.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filePath).toLowerCase()] ||
          "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(response);
    });
  })
function startServer(port) {
  server.once("error", error => {
    if (error.code === "EADDRINUSE" && port === frontendPort) {
      const fallbackPort = frontendPort + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead.`);
      startServer(fallbackPort);
      return;
    }

    console.error("Unable to start frontend server:", error.message);
    process.exitCode = 1;
  });

  server.listen(port, frontendHost, () => {
    console.log(`Frontend running on http://${frontendHost}:${port}`);
    console.log(`API proxy enabled: http://${backendHost}:${backendPort}`);
  });
}

startServer(frontendPort);
