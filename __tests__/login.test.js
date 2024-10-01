const supertest = require("supertest");
const request = supertest(require("../app"));

const db = require("../database/models");
const HashHelper = require("../helpers/HashHelper");

const mockUser = {
  username: "test",
  email: "test@mail.com",
  password: "password",
};

describe("Feature - Login", () => {
  beforeAll(async () => {
    await db.User.create({
      username: mockUser.username,
      email: mockUser.email,
      password: HashHelper.bcrypt(mockUser.password),
    });
  });

  afterAll(async () => {
    await db.User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await db.sequelize.close();
  });

  it("Should authenticate with valid credentials", async () => {
    const response = await request.post("/auth/login").send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login success");
    expect(response.body.data).toHaveProperty("access_token");
    expect(response.body.data).toHaveProperty("user");
  });

  it("Should not authenticate wrong password", async () => {
    const response = await request.post("/auth/login").send({
      email: "test@mail.com",
      password: "12345678",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("Should not authenticate wrong email", async () => {
    const response = await request.post("/auth/login").send({
      email: "tes@mail.com",
      password: "password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("Should not authenticate a user with missing credentials", async () => {
    const response = await request.post("/auth/login").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Bad Request");
  });
});
