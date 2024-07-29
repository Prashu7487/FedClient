const { execSync } = require("child_process");
const path = require("path");

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
run("python3 -m venv venv", serverPath);

// Activate the virtual environment and install Python dependencies for the server
console.log("Installing server Python dependencies in virtual environment...");
const venvPath = path.join(serverPath, "venv");
const pipPath = path.join(venvPath, "bin", "pip");
run(`${pipPath} install -r requirements.txt`, serverPath);

console.log("Setup complete!");

// // Start the project
// console.log("Starting the project...");
// run("npm run start:all", __dirname);
