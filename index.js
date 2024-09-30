const app = require("./app");
const config = require("./config/config");

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
