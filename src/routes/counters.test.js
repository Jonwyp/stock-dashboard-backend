const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../app");
const LikeDislike = require("../models/likeDislike.model");
const {
  setupMongoServer,
  tearDownMongoServer,
} = require("../utils/testingmongoose");

describe("forecast counter", () => {
  let mongoServer;
  const expectedCounter = {
    forecastId: "573545fe-3736-59a6-3392-8e0f0589",
    likeCounter: 0,
    dislikeCounter: 0,
  };
  beforeAll(async () => {
    mongoServer = await setupMongoServer();
  });

  afterAll(async () => {
    await tearDownMongoServer(mongoServer);
  });

  beforeEach(async () => {
    await LikeDislike.create(expectedCounter);
  });
  afterEach(async () => {
    await LikeDislike.deleteMany();
  });
  it("GET /counters/:id should return the like and dislike counters of a forecast", async () => {
    const { body: counterObject } = await request(app)
      .get(`/counters/${expectedCounter.forecastId}`)
      .expect(200);
    expect(counterObject).toMatchObject(expectedCounter);
  });

  it("GET /counters/:id should return status 204 if id not found", async () => {
    const unexpectedCounter = {
      forecastId: "573545fe-3736-59a6-3392-8e0f0582",
    };
    const { body: counterObject } = await request(app)
      .get(`/counters/${unexpectedCounter.forecastId}`)
      .expect(204);
  });

  it("GET /counters/:id should return status 204 if id not found", async () => {
    const unexpectedCounter = {
      forecastId: "573545fe-3736-59a6-3392-8e0f0582",
    };
    const { body: counterObject } = await request(app)
      .get(`/counters/${unexpectedCounter.forecastId}`)
      .expect(204);
  });

  it("Patch /counters/:id should update database and return new counter", async () => {
    const updatedCounter = {
      forecastId: "573545fe-3736-59a6-3392-8e0f0589",
      likeCounter: 5,
      dislikeCounter: 1,
    };
    const { body: counterObject } = await request(app)
      .patch(`/counters/${updatedCounter.forecastId}`)
      .send(updatedCounter)
      .expect(200);
    expect(counterObject).toMatchObject(updatedCounter);
  });
});
