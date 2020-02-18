const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Stocks = require("../models/stocks.model");
const Users = require("../models/users.model");
const {
  mockStockData,
  mockDatabase,
  mockUserData
} = require("../utils/mockData");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

jest.mock("jsonwebtoken");

describe("stocks", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Stocks.create(mockStockData);
    await Users.create(mockUserData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Users.deleteMany();
    await Stocks.deleteMany();
  });
  it("GET /stocks should return stock info without forecast", async () => {
    const expectedStock = {
      id: "573545fe-3736-59a6-3392-8e0f0589",
      quote: "AAPL"
    };
    const { body: actualStock } = await request(app)
      .get("/stocks")
      .expect(200);
    expect(actualStock).toMatchObject([expectedStock]);
  });
  it("POST /stocks should add a new stock to the database", async () => {
    const expectedStock = {
      id: "9cc1492b-6e2e-5777-db10-bf3dd79f",
      quote: "MSFT",
      forecast: []
    };
    const { body: addedStock } = await request(app)
      .post("/stocks")
      .send(expectedStock)
      .expect(201);
    expect(addedStock).toMatchObject(expectedStock);
  });
  it("GET /stocks/:quote should return company with the specific quote", async () => {
    const quote = mockDatabase[0].quote;
    const { body: selectedStock } = await request(app)
      .get(`/stocks/${quote}`)
      .expect(200);
    expect(selectedStock.quote).toEqual(mockDatabase[0].quote);
  });
  it("POST /stocks/:quote/forecast should add review to a company", async () => {
    const quote = mockDatabase[0].quote;
    const expectedForecast = {
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru",
      position: "neutral",
      targetPrice: "380",
      timeFrame: "3 months",
      title: "AAPL to be rangebound due to COVID-19 uncertainty",
      rationale:
        "APPL announced that virus will have an impact on ongoing iPhone sales"
    };
    const newForecast = {
      position: "neutral",
      targetPrice: "380",
      timeFrame: "3 months",
      title: "AAPL to be rangebound due to COVID-19 uncertainty",
      rationale:
        "APPL announced that virus will have an impact on ongoing iPhone sales"
    };
    jwt.verify.mockReturnValueOnce({
      userId: expectedForecast.userId,
      username: expectedForecast.username
    });
    const { body: actualForecast } = await request(app)
      .post(`/stocks/${quote}/forecast`)
      .set("Cookie", "token=valid-token")
      .send(newForecast)
      .expect(201);
    expect(actualForecast).toMatchObject(expectedForecast);
    expect(actualForecast).toHaveProperty("id");
    expect(actualForecast).not.toHaveProperty("_id");

    expect(jwt.verify).toHaveBeenCalledTimes(1);
  });
});
