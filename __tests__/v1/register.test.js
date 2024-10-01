const supertest = require("supertest");
const request = supertest(require("../../app"));

const db = require("../../database/models");

describe("Feature - Register v1", () => {
  afterAll(async () => {
    await db.User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await db.sequelize.close();
  });

  it("Should register a user", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "test",
      email: "test@mail.com",
      password: "password",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created");
  });

  it("Should not register a registered user", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "test",
      email: "test@mail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Bad Request");
    expect(response.body.errors[0]).toHaveProperty("field", "username");
    expect(response.body.errors[0]).toHaveProperty(
      "message",
      "Username already exists"
    );
  });

  it("Should not register a user with an existing email", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "test",
      email: "test@mail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Bad Request");
  });

  it("Should not register a user with an invalid email", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "test",
      email: "testmail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Bad Request");
  });

  it("Should not register a user with an invalid password", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "test",
      email: "test@mail.com",
      password: "",
    });
  });

  it("Should not register a user with an invalid username", async () => {
    const response = await request.post("/v1/auth/register").send({
      username: "",
      email: "test@mail.com",
      password: "password",
    });
  });
});
