const supertest = require("supertest");
const request = supertest(require("../../app"));

const db = require("../../database/models");

const HashHelper = require("../../helpers/HashHelper");
const AuthHelper = require("../../helpers/AuthHelper");

const mockUsers = [
  {
    username: "bob",
    email: "bob@mail.com",
    password: "password",
    token: AuthHelper.generateAccessToken({
      id: 1,
      email: "bob@mail.com",
    }),
  },
  {
    username: "alice",
    email: "alice@mail.com",
    password: "password",
    token: AuthHelper.generateAccessToken({
      id: 2,
      email: "alice@mail.com",
    }),
  },
];

const mockNotes = [
  {
    UserId: 1,
    title: "Note 1",
    content: "# Content 1",
  },
  {
    UserId: 1,
    title: "Note 2",
    content: "# Content 2",
  },
  {
    UserId: 1,
    title: "Note 3",
    content: "# Content 3",
  },
  {
    UserId: 2,
    title: "Note 4",
    content: "# Content 4",
  },
];

describe("Feature - Note v1", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await db.User.bulkCreate(
      mockUsers.map((user) => ({
        username: user.username,
        email: user.email,
        password: HashHelper.bcrypt(user.password),
      }))
    );

    await db.Note.bulkCreate(mockNotes);
  });
  afterAll(async () => {
    await db.Note.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await db.User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await db.sequelize.close();
  });

  describe("Read Note", () => {
    it("Should return notes that are belong to user", async () => {
      const response = await request
        .get("/v1/notes")
        .set("Authorization", `Bearer ${mockUsers[0].token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.notes).toHaveLength(3);
    });

    it("Should not able to get note that is not owned", async () => {
      const response = await request
        .get("/v1/notes/4")
        .set("Authorization", `Bearer ${mockUsers[0].token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  });

  describe("Create Note", () => {
    it("Should create a note", async () => {
      const response = await request
        .post("/v1/notes")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "Note 5",
          content: "# Content 5",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Note created");
      expect(response.body.data.note.title).toBe("Note 5");
      expect(response.body.data.note.content).toBe("# Content 5");
    });

    it("Should not create a note without title", async () => {
      const response = await request
        .post("/v1/notes")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          content: "# Content 6",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request");
    });
    it("Should not create a note without content", async () => {
      const response = await request
        .post("/v1/notes")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "Note 6",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request");
    });
    it("Should not create a note without user", async () => {
      const response = await request.post("/v1/notes").send({
        title: "Note 7",
        content: "# Content 7",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("access token is required");
    });
  });

  describe("Update Note", () => {
    it("Should update a note", async () => {
      const response = await request
        .put("/v1/notes/1")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "Note 1 Updated",
          content: "# Content 1 Updated",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("success");
      expect(response.body.data.note.title).toBe("Note 1 Updated");
      expect(response.body.data.note.content).toBe("# Content 1 Updated");
    });
    it("Should not update a note that is not belong to user", async () => {
      const response = await request
        .put("/v1/notes/4")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "Note 4 Updated",
          content: "# Content 4 Updated",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
    it("Should not update a note with empty title", async () => {
      const response = await request
        .put("/v1/notes/1")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "",
          content: "# Content 1 Updated",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request");
    });
    it("Should not update a note without content", async () => {
      const response = await request
        .put("/v1/notes/1")
        .set("Authorization", `Bearer ${mockUsers[0].token}`)
        .send({
          title: "Note 1 Updated",
          content: "",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request");
    });
  });

  describe("Delete Note", () => {
    it("Should delete a note", async () => {
      const response = await request
        .delete("/v1/notes/1")
        .set("Authorization", `Bearer ${mockUsers[0].token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("success");
    });

    it("Should not delete a note that is not belong to user", async () => {
      const response = await request
        .delete("/v1/notes/4")
        .set("Authorization", `Bearer ${mockUsers[0].token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  });
});
