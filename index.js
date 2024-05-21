const AWS = require("aws-sdk");
const multer = require("multer");
const express = require("express");

const app = express();

app.use(express.static("public"));

const s3 = new AWS.S3({
  accessKeyId: "xxxxxxxxxxxxxx",
  secretAccessKey: "xxxxxxxxxx",
  region: "us-east-1",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  const params = {
    Bucket: "test-multer",
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  console.log(params);
  try {
    await s3.upload(params).promise();
    res.status(200).send("File uploaded to S3 successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file to S3");
  }
});

app.get("/", (req, res) => {
  const params = {
    Bucket: "test-multer",
  };

  s3.listObjectsV2(params, (err, response) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error happening while fetch the data");
    } else {
      console.log(response);
      res.status(200).send(response);
    }
  });
});

app.listen(5000, (req, res) => {
  console.log("App is running");
});
