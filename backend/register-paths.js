const path = require("path");
require("tsconfig-paths").register({
  baseUrl: path.join(__dirname, "dist"),
  paths: {
    "@/*": ["./*"],
  },
});
