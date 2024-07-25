import { S3 } from "aws-sdk";
import fs from "fs";
import { dot } from "node:test/reporters";
import path from "path";
import dotenv from "dotenv";
import { cwd } from "process";
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
});

// output/asdasd
export async function downloadS3Folder(prefix: string) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Prefix: prefix,
    })
    .promise();

  //
  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(path.resolve(__dirname, "../"), Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        s3.getObject({
          Bucket: process.env.AWS_BUCKET_NAME as string,
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];

  await Promise.all(allPromises?.filter((x) => x !== undefined));
}
