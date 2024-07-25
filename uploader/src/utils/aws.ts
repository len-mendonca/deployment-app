import { S3 } from "aws-sdk";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
});

export const uploadFile = async (
  fileToUpload: string,
  localFilePath: string
) => {
  const fileContent = readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: fileToUpload,
    })
    .promise();
  console.log(response);
};
