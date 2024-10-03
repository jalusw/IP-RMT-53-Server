const supertest = require("supertest");
const request = supertest(require("../../app"));
const db = require("../../database/models");
const AuthHelper = require("../../helpers/AuthHelper");

const mockUser = {
  username: "test",
  email: "test@mail.com",
  password: "password",
  token: AuthHelper.generateAccessToken({
    id: 1,
    email: "test@mail.com",
  }),
};

describe("Feature - User v1", () => {
  beforeAll(async () => {
    await db.User.create(mockUser);
  });

  afterAll(async () => {
    await db.User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await db.sequelize.close();
  });

  describe("Read User Profile", () => {
    it("Should return a user profile", async () => {
      const response = await request.get("/v1/users/test");
      expect(response.status).toBe(200);
    });

    it("Should return not found if user is not exist", async () => {
      const response = await request.get("/v1/users/2");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("Update User Profile", () => {
    it("Should update user profile", async () => {
      const response = await request
        .put("/v1/users/1")
        .set("Authorization", `Bearer ${mockUser.token}`)
        .send({
          username: "testa",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.username).toBe("testa");
    });

    it("Should update user avatar", async () => {
      const response = await request
        .patch("/v1/users/1/avatar")
        .set("Authorization", `Bearer ${mockUser.token}`)
        .send({
          avatar: "avatar.jpg",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.avatar).toBe("avatar.jpg");
    });
  });
});
