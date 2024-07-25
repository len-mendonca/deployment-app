import express from "express";
import cors from "cors";
import { generateUniqueId } from "./utils/idGenerate";
import simpleGit from "simple-git";
import { getAllFiles } from "./utils/file";
import path from "path";
import dotenv from "dotenv";
import { uploadFile } from "./utils/aws";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  try {
    const id = await generateUniqueId();
    await simpleGit().clone(repoUrl, path.join(__dirname, `./output/${id}`));
    const allFiles = getAllFiles(path.join(__dirname, `./output/${id}`));
    allFiles.forEach(async (file) => {
      await uploadFile(file.slice(__dirname.length + 1), file);
    });
    return res.status(200).json({ id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to clone repository" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
