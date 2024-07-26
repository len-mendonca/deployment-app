import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./utils/aws";
import dotenv from "dotenv";
import { buildProject } from "./utils/projectBuilder";
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

    const id = response?.element as string;

    await downloadS3Folder(`output/${id}`);
    await buildProject(id);
    copyFinalDist(id);
  }
}
main();
