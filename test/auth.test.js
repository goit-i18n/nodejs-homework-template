const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Verifică dacă utilizatorul există deja și șterge-l
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      await User.deleteOne({ email: 'test@example.com' });
    }

    // Crează un utilizator de test pentru autentificare
    const hashedPassword = bcrypt.hashSync('password123', 10);
    await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      subscription: 'starter',
    });
  });

  afterAll(async () => {
    // Șterge utilizatorul de test
    await User.deleteOne({ email: 'test@example.com' });
  });

  it('should authenticate user and return token and user info', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    // Verifică statusul răspunsului
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
    expect(response.body.user).toHaveProperty('subscription', 'starter');
  });
});
