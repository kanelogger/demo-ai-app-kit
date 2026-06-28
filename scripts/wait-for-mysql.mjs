import { execSync, spawn } from "node:child_process";
import { setInterval } from "node:timers";

const CONTAINER_NAME = "kit-test-mysql";
const MAX_WAIT_MS = 60_000;
const INTERVAL_MS = 1_500;

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: "pipe", ...opts }).trim();
  } catch (err) {
    return null;
  }
}

function isDockerRunning() {
  return run("docker info") !== null;
}

function containerStatus() {
  return run(`docker inspect -f '{{.State.Status}}' ${CONTAINER_NAME} 2>/dev/null`);
}

function healthStatus() {
  return run(`docker inspect -f '{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null`);
}

function composeUp() {
  console.log("🐳  MySQL 容器未运行，正在启动 docker compose...");
  return new Promise((resolve, reject) => {
    const child = spawn("docker", ["compose", "up", "-d"], {
      cwd: process.cwd(),
      stdio: "inherit"
    });
    child.on("close", code => {
      code === 0 ? resolve() : reject(new Error(`docker compose up 退出码 ${code}`));
    });
  });
}

function waitForHealthy() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const status = containerStatus();
      if (status !== "running") {
        if (Date.now() - start > MAX_WAIT_MS) {
          clearInterval(timer);
          reject(new Error(`MySQL 容器状态异常: ${status || "不存在"}`));
        }
        return;
      }
      const health = healthStatus();
      if (!health || health === "healthy") {
        clearInterval(timer);
        resolve();
        return;
      }
      if (Date.now() - start > MAX_WAIT_MS) {
        clearInterval(timer);
        reject(new Error("等待 MySQL 健康检查超时"));
      }
    }, INTERVAL_MS);
  });
}

async function main() {
  if (!isDockerRunning()) {
    console.error("❌ Docker 守护进程未运行，请先启动 Docker / OrbStack");
    process.exit(1);
  }

  const status = containerStatus();
  if (status !== "running") {
    await composeUp();
  }

  process.stdout.write("⏳ 等待 MySQL 就绪");
  const start = Date.now();
  try {
    await waitForHealthy();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n✅ MySQL 已就绪（${elapsed}s）`);
  } catch (err) {
    console.error("\n❌", err.message);
    process.exit(1);
  }
}

main();
