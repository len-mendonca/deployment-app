import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./utils/aws";
import dotenv from "dotenv";
dotenv.config();

const deployer = createClient();
deployer.connect();

async function main() {
  while (true) {
    const response = await deployer.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );

    await downloadS3Folder(`output/${response?.element}`);
  }
}
main();
