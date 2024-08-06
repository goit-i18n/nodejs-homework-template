const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000);

describe('Authentication Controller', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://cursarudamian:1234@cluster0.mo152rw.mongodb.net/contacts?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

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
