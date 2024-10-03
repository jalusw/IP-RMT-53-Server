const supertest = require("supertest");
const request = supertest(require("../../app"));

const db = require("../../database/models");
const AuthHelper = require("../../helpers/AuthHelper");
const HashHelper = require("../../helpers/HashHelper");

const mockUser = {
  username: "test",
  email: "test@mail.com",
  password: "password",
  token: AuthHelper.generateAccessToken({
    id: 1,
    email: "test@mail.com",
  }),
};

describe("Feature - Auth v1", () => {
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

  describe("Login", () => {
    it("Should authenticate with valid credentials", async () => {
      const response = await request.post("/v1/auth/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login success");
      expect(response.body.data).toHaveProperty("access_token");
      expect(response.body.data).toHaveProperty("user");
    });

    it("Should not authenticate wrong password", async () => {
      const response = await request.post("/v1/auth/login").send({
        email: "test@mail.com",
        password: "12345678",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("Should not authenticate wrong email", async () => {
      const response = await request.post("/v1/auth/login").send({
        email: "tes@mail.com",
        password: "password",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("Should not authenticate a user with missing credentials", async () => {
      const response = await request.post("/v1/auth/login").send({
        email: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Bad Request");
    });
  });

  describe("Register", () => {
    it("Should register a user", async () => {
      const response = await request.post("/v1/auth/register").send({
        username: "testa",
        email: "testa@mail.com",
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

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Bad Request");
    });

    it("Should not register a user with an invalid username", async () => {
      const response = await request.post("/v1/auth/register").send({
        username: "",
        email: "test@mail.com",
        password: "password",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Bad Request");
    });
  });

  // describe("Refresh Token", () => {});

  describe("Profile", () => {
    describe("Get Profile", () => {
      it("Should return user profile", async () => {
        const response = await request
          .get("/v1/auth/profile")
          .set("Authorization", `Bearer ${mockUser.token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("user");
      });

      it("Should not return user profile if not authenticated", async () => {
        const response = await request.get("/v1/auth/profile");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
          "message",
          "access token is required"
        );
      });
    });

    describe("Update Profile", () => {
      it("Should update user profile", async () => {
        const response = await request
          .put("/v1/auth/profile")
          .set("Authorization", `Bearer ${mockUser.token}`)
          .send({
            username: "test2",
            email: "test2@gmail.com",
          });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("user");
      });
    });
  });
});
