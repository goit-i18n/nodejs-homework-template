const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

jest.setTimeout(30000);

describe('User Controller', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://cursarudamian:1234@cluster0.mo152rw.mongodb.net/contacts?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await User.deleteMany({});

        const userData = { email: 'test@example.com', password: 'password123' };
        const response = await request(app).post('/auth/register').send(userData);
        userId = response.body._id;
        token = jwt.sign({ id: userId }, 'your_jwt_secret', { expiresIn: '1h' });

        const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
        if (!await fs.stat(avatarsDir).then(() => true).catch(() => false)) {
            await fs.mkdir(avatarsDir, { recursive: true });
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
        const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
        if (await fs.stat(avatarsDir).then(() => true).catch(() => false)) {
            await fs.rm(avatarsDir, { recursive: true, force: true });
        }
    });

    test('should update user avatar', async () => {
        const response = await request(app)
            .patch('/users/avatars')
            .set('Authorization', `Bearer ${token}`)
            .attach('avatar', path.join(__dirname, 'avatar.jpg')); 

        expect(response.status).toBe(200);
        expect(response.body.avatarURL).toMatch(/^\/public\/avatars\/.+\.jpg$/);
    });

    test('should return 401 if not authorized', async () => {
        const response = await request(app)
            .patch('/users/avatars')
            .attach('avatar', path.join(__dirname, 'avatar.jpg'));

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized');
    });
});
