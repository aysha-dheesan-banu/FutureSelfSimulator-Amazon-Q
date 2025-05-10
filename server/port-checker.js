const net = require('net');

/**
 * Check if a port is in use
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if the port is available, false if it's in use
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use
        console.log(`Port ${port} is already in use`);
        resolve(false);
      } else {
        // Other error
        console.log(`Error checking port ${port}: ${err.message}`);
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      // Port is available, close the server
      server.close(() => {
        console.log(`Port ${port} is available`);
        resolve(true);
      });
    });
    
    // Try to listen on the port
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Find an available port starting from the given port
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - The first available port
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  let maxAttempts = 20; // Try up to 20 ports
  
  while (maxAttempts > 0) {
    const isAvailable = await isPortAvailable(port);
    if (isAvailable) {
      return port;
    }
    port++;
    maxAttempts--;
  }
  
  // If no port is available, return 0 to let the OS assign a random port
  return 0;
}

// Check specific ports
const portsToCheck = [5000, 3000, 8080, 4000];

async function checkPorts() {
  console.log('Checking port availability:');
  
  for (const port of portsToCheck) {
    const available = await isPortAvailable(port);
    console.log(`Port ${port}: ${available ? 'Available' : 'In use'}`);
  }
  
  const availablePort = await findAvailablePort(3000);
  console.log(`First available port: ${availablePort}`);
}

checkPorts().catch(console.error);

module.exports = { isPortAvailable, findAvailablePort };