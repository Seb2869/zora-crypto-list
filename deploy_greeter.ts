import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

async function main() {
  const initial = process.env.GREETER_INITIAL || "Hello from Base";
  const Greeter = await ethers.getContractFactory("GreeterBase");
  const greeter = await Greeter.deploy(initial);
  await greeter.waitForDeployment();
  const address = await greeter.getAddress();

  console.log("GreeterBase deployed to:", address);

  const chainId = (await ethers.provider.getNetwork()).chainId.toString();
  const outDir = path.join(__dirname, "..", "addresses");
  fs.mkdirSync(outDir, { recursive: true });

  const file =
    chainId === "84532" ? "base-sepolia.json" :
    chainId === "8453"  ? "base-mainnet.json" : `chain-${chainId}.json`;

  const p = path.join(outDir, file);
  let json: any = {};
  if (fs.existsSync(p)) json = JSON.parse(fs.readFileSync(p, "utf8"));

  json.GreeterBase = address;
  fs.writeFileSync(p, JSON.stringify(json, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
