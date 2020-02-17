require("dotenv").config();
require("./utils/db");

const app = require("./app");
const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on http://localhost:${PORT}...`);
});
