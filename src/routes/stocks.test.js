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
const {
  setupMongoServer,
  tearDownMongoServer
} = require("../utils/testingmongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

jest.mock("jsonwebtoken");

describe("stocks", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await setupMongoServer();
  });

  afterAll(async () => {
    await tearDownMongoServer(mongoServer);
  });

  beforeEach(async () => {
    await Stocks.create(mockDatabase);
    await Users.create(mockUserData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Users.deleteMany();
    await Stocks.deleteMany();
  });
  it("GET /stocks should return stock info without forecast", async () => {
    const expectedStock = [
      {
        id: "573545fe-3736-59a6-3392-8e0f0589",
        quote: "AAPL"
      },
      {
        id: "9cc1492b-6e2e-5777-db10-bf3dd79f",
        quote: "MSFT"
      }
    ];
    const { body: actualStock } = await request(app)
      .get("/stocks")
      .expect(200);
    expect(actualStock).toMatchObject(expectedStock);
  });
  it("POST /stocks should add a new stock to the database", async () => {
    const expectedStock = {
      id: "9cc1492b-6e2e-5777-db10-bf3dd79f",
      quote: "TWTR",
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
  it("POST /stocks/:quote/forecast should add review to a company when user is logged in", async () => {
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
  it("POST /stocks/:quote/forecast should return 401 if not signed in", async () => {
    const quote = mockDatabase[0].quote;
    const newForecast = {
      position: "neutral",
      targetPrice: "380",
      timeFrame: "3 months",
      title: "AAPL to be rangebound due to COVID-19 uncertainty",
      rationale:
        "APPL announced that virus will have an impact on ongoing iPhone sales"
    };
    jwt.verify.mockReturnValueOnce({});
    const { body: message } = await request(app)
      .post(`/stocks/${quote}/forecast`)
      .set("Cookie", "invalid-token")
      .send(newForecast)
      .expect(401);
    expect(message).toEqual({ error: "You are not authorized!" });
    expect(jwt.verify).not.toHaveBeenCalled();
  });
  it("POST /stocks/:quote/forecast should return 400 if fields are missing", async () => {
    const quote = mockDatabase[0].quote;
    const newForecast = {
      position: "neutral",
      targetPrice: "380",
      title: "AAPL to be rangebound due to COVID-19 uncertainty"
    };
    jwt.verify.mockReturnValueOnce({
      userId: mockUserData[0].id,
      username: mockUserData[0].username
    });
    const { body: error } = await request(app)
      .post(`/stocks/${quote}/forecast`)
      .set("Cookie", "token=valid-token")
      .send(newForecast)
      .expect(400);
    expect(error).toEqual({
      error:
        "Validation failed: forecast: Validation failed: rationale: Path `rationale` is required., timeFrame: Path `timeFrame` is required."
    });

    expect(jwt.verify).toHaveBeenCalledTimes(1);
  });
  it("PATCH /stocks/:quote/forecast/:id should allow forecast to be edited", async () => {
    jwt.verify.mockReturnValueOnce({
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru"
    });
    const quote = mockDatabase[0].quote;
    const id = mockDatabase[0].forecast[0].id;
    const editField = { title: "Hahahaha", rationale: "HELLO" };
    const { body: editedForecast } = await request(app)
      .patch(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .send(editField)
      .expect(200);
    expect(editedForecast).toMatchObject(editField);
  });
  it("PATCH /stocks/:quote/forecast/:id should not allow forecast to be edited after x days", async () => {
    jwt.verify.mockReturnValueOnce({
      userId: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
      username: "stockshorter"
    });
    const quote = mockDatabase[1].quote;
    const id = mockDatabase[1].forecast[1].id;
    const editField = { title: "Hahahaha", rationale: "HELLO" };
    const { body: editedForecast } = await request(app)
      .patch(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .send(editField)
      .expect(423);
    expect(editedForecast).toEqual({
      error: "Unable to edit forecast after post is locked."
    });
  });
  it("PATCH /stocks/:quote/forecast/:id should not allow forecast to be edited if user is not original creator", async () => {
    jwt.verify.mockReturnValueOnce({
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru"
    });
    const quote = mockDatabase[1].quote;
    const id = mockDatabase[1].forecast[1].id;
    const editField = { title: "Hahahaha", rationale: "HELLO" };
    const { body: editedForecast } = await request(app)
      .patch(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .send(editField)
      .expect(403);
    expect(editedForecast).toEqual({
      error: "You do not have permission to edit this post."
    });
  });
  it("DELETE /stocks/:quote/forecast/:id should delete forecast with corresponding id", async () => {
    const expectedForecast = {
      id: "34298392-1ff3-0fb0-573f-72f44e15",
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      position: "long",
      targetPrice: 380,
      timeFrame: "1 year",
      title: "Apple: The New iPhone Opportunity",
      rationale:
        "One of the reasons that technology giant Apple (AAPL) has seen its shares soar to new all-time highs recently is the expected iPhone supercycle coming this year. With the company getting ready to launch new 5G compatible phones, investors are betting that iPhone upgrade rates will soar, leading to new revenue and profit records."
    };
    jwt.verify.mockReturnValueOnce({
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru"
    });
    const quote = mockDatabase[0].quote;
    const id = mockDatabase[0].forecast[0].id;
    const { body: deletedForecast } = await request(app)
      .delete(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .expect(200);
    expect(deletedForecast).toMatchObject(expectedForecast);
  });
  it("DELETE /stocks/:quote/forecast/:id should not delete forecast after x days", async () => {
    const expectedForecast = {
      id: "34298392-1ff3-0fb0-573f-72f44e15",
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      position: "long",
      targetPrice: 380,
      timeFrame: "1 year",
      title: "Apple: The New iPhone Opportunity",
      rationale:
        "One of the reasons that technology giant Apple (AAPL) has seen its shares soar to new all-time highs recently is the expected iPhone supercycle coming this year. With the company getting ready to launch new 5G compatible phones, investors are betting that iPhone upgrade rates will soar, leading to new revenue and profit records."
    };
    jwt.verify.mockReturnValueOnce({
      userId: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
      username: "stockshorter"
    });
    const quote = mockDatabase[1].quote;
    const id = mockDatabase[1].forecast[1].id;
    const { body: error } = await request(app)
      .delete(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .expect(423);
    expect(error).toEqual({
      error: "Unable to delete forecast after post is locked."
    });
  });
  it("DELETE /stocks/:quote/forecast/:id should not delete forecast if user is not original creator", async () => {
    const expectedForecast = {
      id: "34298392-1ff3-0fb0-573f-72f44e15",
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      position: "long",
      targetPrice: 380,
      timeFrame: "1 year",
      title: "Apple: The New iPhone Opportunity",
      rationale:
        "One of the reasons that technology giant Apple (AAPL) has seen its shares soar to new all-time highs recently is the expected iPhone supercycle coming this year. With the company getting ready to launch new 5G compatible phones, investors are betting that iPhone upgrade rates will soar, leading to new revenue and profit records."
    };
    jwt.verify.mockReturnValueOnce({
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru"
    });
    const quote = mockDatabase[1].quote;
    const id = mockDatabase[1].forecast[1].id;
    const { body: error } = await request(app)
      .delete(`/stocks/${quote}/forecast/${id}`)
      .set("Cookie", "token=valid-token")
      .expect(403);
    expect(error).toEqual({
      error: "You do not have permission to delete this post."
    });
  });
});
