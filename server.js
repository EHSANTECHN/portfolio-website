cat > server.js << 'EOF'
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY",
  secretAccessKey: "YOUR_SECRET_KEY",
  region: "ap-south-1"
});

const s3 = new AWS.S3();

app.post("/upload", upload.single("file"), async (req, res) => {

  const params = {
    Bucket: "YOUR_BUCKET_NAME",
    Key: Date.now() + "-" + req.file.originalname,
    Body: req.file.buffer,
    ACL: "public-read"
  };

  try {
    const data = await s3.upload(params).promise();

    res.json({
      message: "Upload successful",
      url: data.Location
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
EOF
