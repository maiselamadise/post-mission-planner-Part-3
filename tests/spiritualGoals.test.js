// Unit tests for the /spiritual-goals GET endpoints. The model is mocked, so no database is needed.
jest.mock('../models/SpiritualGoal');
const request = require('supertest');
const SpiritualGoal = require('../models/SpiritualGoal');
const app = require('../app');

const validId = '665f1c2e8b3a4d0012345678';
const sample = { _id: validId, userId: '665f1c2e8b3a4d0012345679', title: 'Sample goal', status: 'Not Started' };

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

describe('GET /spiritual-goals', () => {
  test('returns 200 and an array of goals', async () => {
    SpiritualGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([sample]) });
    const res = await request(app).get('/spiritual-goals');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Sample goal');
  });

  test('returns 200 and an empty array when the collection is empty', async () => {
    SpiritualGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    const res = await request(app).get('/spiritual-goals');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 500 when the database fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    SpiritualGoal.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('db down')) });
    const res = await request(app).get('/spiritual-goals');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});

describe('GET /spiritual-goals/:id', () => {
  test('returns 200 and the matching goal', async () => {
    SpiritualGoal.findById.mockResolvedValue(sample);
    const res = await request(app).get('/spiritual-goals/' + validId);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(validId);
  });

  test('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/spiritual-goals/abc');
    expect(res.status).toBe(400);
    expect(SpiritualGoal.findById).not.toHaveBeenCalled();
  });

  test('returns 404 when no record has that id', async () => {
    SpiritualGoal.findById.mockResolvedValue(null);
    const res = await request(app).get('/spiritual-goals/' + validId);
    expect(res.status).toBe(404);
  });
});

describe('Protected writes without login', () => {
  test('POST returns 401', async () => {
    const res = await request(app).post('/spiritual-goals').send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('PUT returns 401', async () => {
    const res = await request(app).put('/spiritual-goals/' + validId).send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('DELETE returns 401', async () => {
    const res = await request(app).delete('/spiritual-goals/' + validId);
    expect(res.status).toBe(401);
  });
});
