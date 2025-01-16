//! Importăm funcția login din AuthController și modulele necesare:
const { login } = require("../controllers/authController.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const dontenv = require("dotenv");
//! Mocking dependencies:
jest.mock("../models/user.js");
jest.mock("jsonwebtoken");

describe("AuthController - login", () => {
  const secretForToken = (process.env.TOKEN_SECRET);

  //! Setăm variabila de mediu pentru secretul token-ului înainte de a rula testele:
  beforeAll(() => {
    process.env.TOKEN_SECRET = secretForToken;
  });

  //! Curățăm toate mock-urile după fiecare test pentru a preveni interferențele între teste:
  afterEach(() => {
    jest.clearAllMocks();
  });

  //! Testăm dacă funcția returnează un token și un user pentru credențiale valide:
  it("should return status code 200 and a token for valid credentials", async () => {
    const email = "test@example.com";
    const password = "validPassword";
    const userId = "userId123";
    const token = "testToken";

    //! Creăm un mock pentru obiectul user:
    const userMock = {
      _id: userId,
      email: email,
      subscription: "starter",
      validPassword: jest.fn().mockReturnValue(true), //! Mock pentru validPassword.
      save: jest.fn(), //! Mock pentru metoda save.
    };

    //! Mock pentru User.findOne și jwt.sign:
    User.findOne.mockResolvedValue(userMock);
    jwt.sign.mockReturnValue(token);

    const data = { email, password };

    //! Apelăm funcția login și verificăm rezultatul:
    const result = await login(data);

    expect(result).toHaveProperty("token");
    expect(result.token).toBe(token);

    expect(result).toHaveProperty("user");
    expect(result.user.email).toBe(email);
    expect(result.user.subscription).toBe("starter");

    //! Verificăm dacă funcțiile mock au fost apelate cu parametrii corecți:
    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(userMock.validPassword).toHaveBeenCalledWith(password);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: userId }, secretForToken, {
      expiresIn: "1h",
    });
    expect(userMock.save).toHaveBeenCalled();
  });

  //! Testăm dacă funcția aruncă o eroare atunci când email-ul nu este furnizat:
  it("should throw an error if email is not provided", async () => {
    const data = { password: "validPassword" };

    await expect(login(data)).rejects.toThrow(
      "Email and password are required"
    );
  });

  //! Testăm dacă funcția aruncă o eroare atunci când parola nu este furnizată:
  it("should throw an error if password is not provided", async () => {
    const data = { email: "test@example.com" };

    await expect(login(data)).rejects.toThrow(
      "Email and password are required"
    );
  });

  //! Testăm dacă funcția aruncă o eroare atunci când utilizatorul nu este găsit:
  it("should throw an error if user is not found", async () => {
    const email = "test@example.com";
    const password = "validPassword";

    //! Mock pentru User.findOne care returnează null:
    User.findOne.mockResolvedValue(null);

    const data = { email, password };

    await expect(login(data)).rejects.toThrow("Email or password is wrong");

    expect(User.findOne).toHaveBeenCalledWith({ email });
  });

  //! Testăm dacă funcția aruncă o eroare atunci când parola este incorectă:
  it("should throw an error if password is incorrect", async () => {
    const email = "test@example.com";
    const password = "wrongPassword";

    //! Creăm un mock pentru obiectul user cu validPassword returnând false:
    const userMock = {
      validPassword: jest.fn().mockReturnValue(false),
    };

    //! Mock pentru User.findOne:
    User.findOne.mockResolvedValue(userMock);

    const data = { email, password };

    await expect(login(data)).rejects.toThrow("Email or password is wrong");

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(userMock.validPassword).toHaveBeenCalledWith(password);
  });
});