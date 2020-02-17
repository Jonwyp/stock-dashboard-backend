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
});
