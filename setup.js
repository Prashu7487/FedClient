const { execSync } = require("child_process");
const path = require("path");
const os = require("os");

function run(command, cwd) {
  execSync(command, { stdio: "inherit", cwd });
}

console.log("Setting up the project...");

// Install Node.js dependencies for the main project
console.log("Installing main project Node.js dependencies...");
run("npm install", __dirname);

// Install Node.js dependencies for the client
console.log("Installing client Node.js dependencies...");
run("npm install", path.join(__dirname, "Client"));

// Create a Python virtual environment for the server
console.log("Creating a Python virtual environment for the server...");
const serverPath = path.join(__dirname, "PrivateServer");
run("python -m venv venv", serverPath);

// Determine the correct path to the pip executable
const isWindows = os.platform() === "win32";
const venvPath = path.join(serverPath, "venv");
const pipPath = isWindows
  ? path.join(venvPath, "Scripts", "pip.exe")
  : path.join(venvPath, "bin", "pip");

// Install Python dependencies using pip from the virtual environment
console.log("Installing server Python dependencies in virtual environment...");
run(`${pipPath} install -r requirements.txt`, serverPath);

console.log("Setup complete!");

// // Start the project
// console.log("Starting the project...");
// run("npm run start:all", __dirname);
