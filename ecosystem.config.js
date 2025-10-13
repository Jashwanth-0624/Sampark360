module.exports = {
  apps: [
    {
      name: "sampark",
      cwd: "C:/Users/manmi/OneDrive/Desktop/Sampark",
      script: "npm",
      args: "run dev -- --host 127.0.0.1 --port 5173 --strictPort",
      interpreter: "cmd.exe",
      interpreterArgs: "/c",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
