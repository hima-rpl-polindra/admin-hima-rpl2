const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 40124;
const dev = process.env.NODE_ENV || "production";
const app = next({ dev });
const handle = app.get.RequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running at http http://localhost:${port}`);
  });
});
