const supertest = require("supertest");
const request = supertest(require("../app"));

describe("App", () => {
  it("Should return a 404 status code on unresolved route", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(404);
  });
});
