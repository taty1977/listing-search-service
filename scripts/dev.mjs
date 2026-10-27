import { spawn } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run the dev server with `npm run dev`.");
}

const server = spawn(
  process.execPath,
  [npmCli, "run", "dev:next", "--", ...process.argv.slice(2)],
  { env: process.env, stdio: ["inherit", "pipe", "pipe"] },
);

let browserOpened = false;
let outputBuffer = "";

function openBrowser(url) {
  const platformCommand = process.platform === "win32"
    ? ["cmd.exe", ["/c", "start", "", url]]
    : process.platform === "darwin"
      ? ["open", [url]]
      : ["xdg-open", [url]];
  const browser = spawn(platformCommand[0], platformCommand[1], {
    detached: true,
    stdio: "ignore",
  });

  browser.on("error", (error) => {
    console.error(`Could not open the browser: ${error.message}`);
  });
  browser.unref();
}

function forwardOutput(stream, destination) {
  stream.on("data", (chunk) => {
    destination.write(chunk);
    if (browserOpened) return;

    // Output chunks can split the URL; keep a bounded tail and use Next's selected port.
    outputBuffer = (outputBuffer + chunk.toString()).slice(-4000);
    const localUrl = outputBuffer.match(/Local:\s+(https?:\/\/\S+)/)?.[1];
    if (localUrl) {
      browserOpened = true;
      openBrowser(localUrl);
    }
  });
}

forwardOutput(server.stdout, process.stdout);
forwardOutput(server.stderr, process.stderr);

server.on("error", (error) => {
  console.error(`Could not start the Next.js dev server: ${error.message}`);
  process.exitCode = 1;
});

server.on("close", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}
