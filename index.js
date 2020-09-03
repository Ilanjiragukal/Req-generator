require("dotenv").config();
const express = require("express");
const router = express();
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const path = require("path");

const app = express();

router.get("/generate", async function (req, res) {
  const {
    query: {
      group,
      units,
      reason,
      place,
      name,
      attenderName,
      attenderNo,
      verifiedBy,
      verifiedByNo,
      reqId,
      date,
      time,
      notes,
      district,
    },
  } = req;
  const html = fs
    .readFileSync(path.join(__dirname, "public/template.html"))
    .toString();
  const image = await nodeHtmlToImage({
    puppeteerArgs: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    html,
    content: {
      group,
      units,
      reason,
      place,
      name,
      attenderName,
      attenderNo,
      verifiedBy,
      verifiedByNo,
      reqId,
      date,
      time,
      notes,
      district,
    },
  });

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Disposition": `attachment; filename="${name}_${group}"`,
  });
  res.end(image, "binary");
});

app.use(router);
app.use(express.static(path.join(__dirname, "public")));

const environment = process.env.NODE_ENV;
app.listen(process.env.PORT, () => {
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "testing"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }

  console.log(`Server listening in ${process.env.PORT}`);
});
