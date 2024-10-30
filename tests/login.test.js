import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import request from "supertest"; //pentru a testa cererile HTTP
import app from "../app.js"; // Serverul Express

// Mock pentru utilizator
const mockUser = {
  _id: "mockUserId",
  email: "testuser@example.com",
  password: "hashedPassword",
  subscription: "starter",
  token: null,
};

describe("Login Controller Tests", () => {
  beforeEach(() => {
    //  reseta starea mock-ului sau baza de date de testare inainte de fiecare test
    jest.clearAllMocks();
  });

  it("should return status 200 and a token on successful login", async () => {
    // Mock pentru găsirea utilizatorului și verificarea parolei
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      ...mockUser,
      comparePassword: jest.fn().mockResolvedValueOnce(true),
    });

    jest.spyOn(jwt, "sign").mockReturnValue("mockToken");

    const res = await request(app).post("/api/users/login").send({
      email: mockUser.email,
      password: "mockPassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "mockToken");
    expect(res.body.user).toEqual({
      email: mockUser.email,
      subscription: mockUser.subscription,
    });
  });

  it("should return status 401 for invalid password", async () => {
    // Mock pentru găsirea utilizatorului, dar parola este invalidă
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      ...mockUser,
      comparePassword: jest.fn().mockResolvedValueOnce(false),
    });

    const res = await request(app).post("/api/users/login").send({
      email: mockUser.email,
      password: "wrongPassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Email or password is wrong");
  });

  it("should return status 401 if user is not found", async () => {
    // Mock pentru situația în care utilizatorul nu există
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

    const res = await request(app).post("/api/users/login").send({
      email: mockUser.email,
      password: "mockPassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Email or password is wrong");
  });
});
