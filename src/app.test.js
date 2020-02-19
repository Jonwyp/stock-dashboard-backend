const app = require("./app.js");
const request = require("supertest");

const { endpoints } = require("./utils/mockData");

describe("app.js", () => {
  it("GET / should return JSON object with list of all endpoints", async () => {
    const { body: expectedEndpoints } = await request(app)
      .get("/")
      .expect(200);
    expect(expectedEndpoints).toEqual(endpoints);
  });
  it("GET /* should return a 404 page not found", async () => {
    const { body: error } = await request(app)
      .get("/*")
      .expect(404);
    expect(error).toEqual({error: "Page not found."})
  });
});
