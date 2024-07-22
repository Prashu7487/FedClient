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

// Install Python dependencies for the server
console.log("Installing server Python dependencies...");
run("pip install -r requirements.txt", path.join(__dirname, "PrivateServer"));

console.log("Setup complete!");

// Start the project
console.log("Starting the project...");
run("npm run start:all", __dirname);

// working too************
// const { exec } = require("child_process");
// const path = require("path");

// const runCommand = (command, cwd) => {
//   return new Promise((resolve, reject) => {
//     exec(command, { cwd }, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         reject(error);
//         return;
//       }
//       if (stderr) {
//         console.error(`Stderr: ${stderr}`);
//         reject(new Error(stderr));
//         return;
//       }
//       console.log(`Stdout: ${stdout}`);
//       resolve(stdout);
//     });
//   });
// };

// const main = async () => {
//   try {
//     console.log("Setting up the project...");

//     // Install Node.js dependencies for the main project
//     console.log("Installing main project Node.js dependencies...");
//     await runCommand("npm install", process.cwd());

//     // Install Node.js dependencies for the client
//     console.log("Installing client Node.js dependencies...");
//     await runCommand("npm install", path.join(process.cwd(), "Client"));

//     // Install Python dependencies for the server
//     console.log("Installing server Python dependencies...");
//     await runCommand(
//       "pip install -r requirements.txt",
//       path.join(process.cwd(), "PrivateServer")
//     );

//     console.log("Setup complete!");

//     // // Start the project (uncomment if willing to start the application just after setup)
//     // console.log('Starting the project...');
//     // await runCommand('npm run start:all', process.cwd());
//   } catch (error) {
//     console.error(`Setup failed: ${error.message}`);
//   }
// };

// main();
