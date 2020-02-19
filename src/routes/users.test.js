const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Users = require("../models/users.model");
const { mockUser, mockUserData } = require("../utils/mockData");
const {
  setupMongoServer,
  tearDownMongoServer
} = require("../utils/testingmongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

jest.mock("jsonwebtoken");

describe("users", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await setupMongoServer();
  });

  afterAll(async () => {
    await tearDownMongoServer(mongoServer);
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
  it("POST /users/register should throw 500 error if user is a duplicate", async () => {
    const duplicateUser = mockUserData[0];
    const { body: error } = await request(app)
      .post("/users/register")
      .send(duplicateUser)
      .expect(500);
    expect(error).toEqual({ error: "Internal server error." });
  });
  it("POST /users/register should throw 400 error if firstname is missing", async () => {
    const duplicateUser = {
      id: "d5a6dcd6-ee26-04f9-9ec7-85834271f082",
      username: "stocknoob",
      password: "123456789",
      lastName: "Wong",
      email: "jonwong@expressmail.com"
    };
    const { body: error } = await request(app)
      .post("/users/register")
      .send(duplicateUser)
      .expect(400);
    expect(error).toEqual({
      error: "Users validation failed: firstName: Path `firstName` is required."
    });
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
