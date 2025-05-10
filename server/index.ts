import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "./vite";
// Import config to ensure environment variables are loaded
import { config } from "./config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Setup data storage
    log("Initializing data storage...");
    const { seedData } = await import("./storage");
    await seedData();
    log("Data storage initialized");
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Try to serve the app on configured port or fallback to other ports
    // this serves both the API and the client.
    const configuredPort = config.port;
    const ports = [configuredPort, 5000, 3000, 8080, 8000, 9000, 4000];
    let serverStarted = false;
    
    // Try each port in sequence
    for (const port of ports) {
      try {
        await new Promise<void>((resolve, reject) => {
          const serverInstance = server.listen(port, () => {
            log(`Server running at http://localhost:${port}`);
            serverStarted = true;
            resolve();
          });
          
          serverInstance.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              log(`Port ${port} is already in use, trying next port...`);
            } else {
              log(`Error on port ${port}: ${err.message}`);
            }
            reject(err);
          });
        });
        
        // If we get here, the server started successfully
        if (serverStarted) break;
      } catch (err) {
        // Continue to the next port if this one failed
        continue;
      }
    }
    
    if (!serverStarted) {
      // Try a random port as last resort
      try {
        await new Promise<void>((resolve, reject) => {
          const serverInstance = server.listen(0, () => {
            const address = serverInstance.address();
            const port = typeof address === 'object' && address ? address.port : 0;
            log(`Server running on random port: http://localhost:${port}`);
            serverStarted = true;
            resolve();
          });
          
          serverInstance.on('error', (err) => {
            log(`Error starting server on random port: ${err.message}`);
            reject(err);
          });
        });
      } catch (err) {
        log("Failed to start server even on random port");
        throw new Error("Could not start server on any port");
      }
      
      if (!serverStarted) {
        throw new Error("Could not start server on any of the configured ports");
      }
    }
  } catch (error: any) {
    log(`Error starting server: ${error?.message || 'Unknown error'}`);
    console.error(error);
    process.exit(1);
  }
})();
