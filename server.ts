import express from "express";
const cors = require("cors");
const ogs = require("open-graph-scraper");
import { Request, Response } from "express";
import { nextTick } from "process";
const bodyParser = require("body-parser");
const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
  require("metascraper-media-provider")(),
  require("metascraper-audio")(),
  require("metascraper-iframe")(),
  require("metascraper-lang")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-uol"),
  require("metascraper-readability")(),
  require("metascraper-soundcloud")(),
  require("metascraper-spotify")(),
  require("metascraper-video")(),
  require("metascraper-youtube")(),
  //   require("./extended/metascraper-twitter")(),
]);

const got = require("got");

const app: any = express();
const port = 3000;
const allowedOrigins = ["http://localhost:4200"];

app.use(
  cors({
    origin: function (origin: any, callback: any) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req: any, res: any) => {
  res.send("heyo");
});

app.post("/url-processor", (req: Request, res: Response) => {
  if (req && req.body && req.body.urlStr) {
    ogs({ url: req.body.urlStr })
      .then((data: any) => {
        const { error, result, response } = data;
        if (!error && result && result.success) {
          res.json({ result });
        } else {
          res.status(500).send("Something broke!");
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }
});

app.post("/meta-processor", async (req: Request, res: Response) => {
  if (req && req.body && req.body.urlStr) {
    try {
      const { body: html, url } = await got(req.body.urlStr);
      const metadata = await metascraper({ html, url });
      res.json({ metadata });
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

async function gotter() {}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
