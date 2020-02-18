const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Users = require("../models/users.model");
const { mockUser, mockUserData } = require("../utils/mockData");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

jest.mock("jsonwebtoken");

describe("users", () => {
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
    await Users.create(mockUserData[0]);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Users.deleteMany();
  });
  it("GET /users/:username should return details of correct user", async () => {
    const username = mockUserData[0].username;
    const expectedInfo = {
      id: "efda0939-3101-f362-83fd-f3936fa3",
      username: "stockguru",
      firstName: "Jane",
      lastName: "Doe"
    };
    const { body: userInfo } = await request(app)
      .get(`/users/${username}`)
      .expect(200);
    expect(userInfo).toMatchObject(expectedInfo);
  });
  it("POST /users/register should create a new user", async () => {
    const { body: userInfo } = await request(app)
      .post("/users/register")
      .send(mockUser)
      .expect(201);
    expect(userInfo.username).toEqual(mockUser.username);
    expect(userInfo.password).not.toEqual(mockUser.password);
  });
  it("POST /users/logout should log a user out", async () => {
    const { text: message } = await request(app)
      .post("/users/logout")
      .expect(200);
    expect(message).toBe("You are now logged out!");
  });
  it("POST /users/login should log a user in when password is correct", async () => {
    const rightUser = {
      username: "stockguru",
      password: "123456789"
    };
    const { text: message } = await request(app)
      .post("/users/login")
      .send(rightUser)
      .expect(200);
    expect(message).toBe("You are now logged in!");
  });
  it("POST /users/login should not log in when password is incorrect", async () => {
    const wrongUser = {
      username: "stockguru",
      password: "1234567890"
    };
    const { body: error } = await request(app)
      .post("/users/login")
      .send(wrongUser)
      .expect(401);
    expect(error).toEqual({ error: "Login failed." });
  });
});
