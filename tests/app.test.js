import request from "supertest";
import app from "../src/app.js"; // Pastikan path ini sesuai dengan file app.js Anda

describe("GET /", () => {
  it("should return status 200 and welcome message", async () => {
    const response = await request(app).get("/");
    console.log("Response Body:", response.body); // Tambahkan log untuk debug
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to Retromailer API!" });
  });
});
