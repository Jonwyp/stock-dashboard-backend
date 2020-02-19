const json = require("./stockQuote.json");
const uuidv4 = require("uuid/v4");
var fs = require("fs");

const symbols = json.map(e => e.symbol);
const result = [];
for (q of symbols) {
  result.push({ id: uuidv4(), quote: q, forecast: [] });
}

fs.writeFile("filteredStockQuote.json", JSON.stringify(result), function(err) {
  if (err) throw err;
  console.log("Saved!");
});
