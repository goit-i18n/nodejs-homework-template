const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const mongoose = require('mongoose');

describe('Authentication Controller', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should login user and return token', async () => {
        const userData = { email: 'test@example.com', password: 'password123' };
        await request(app).post('/auth/register').send(userData);

        const response = await request(app).post('/auth/login').send(userData);
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toEqual({
            email: userData.email,
            subscription: 'free',
        });
    });
});