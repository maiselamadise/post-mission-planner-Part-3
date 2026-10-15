// Unit tests for the /career-goals GET endpoints. The model is mocked, so no database is needed.
jest.mock('../models/CareerGoal');
const request = require('supertest');
const CareerGoal = require('../models/CareerGoal');
const app = require('../app');

const validId = '665f1c2e8b3a4d0012345678';
const sample = { _id: validId, userId: '665f1c2e8b3a4d0012345679', title: 'Sample goal', status: 'Not Started' };

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

describe('GET /career-goals', () => {
  test('returns 200 and an array of goals', async () => {
    CareerGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([sample]) });
    const res = await request(app).get('/career-goals');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Sample goal');
  });

  test('returns 200 and an empty array when the collection is empty', async () => {
    CareerGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    const res = await request(app).get('/career-goals');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 500 when the database fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    CareerGoal.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('db down')) });
    const res = await request(app).get('/career-goals');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});

describe('GET /career-goals/:id', () => {
  test('returns 200 and the matching goal', async () => {
    CareerGoal.findById.mockResolvedValue(sample);
    const res = await request(app).get('/career-goals/' + validId);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(validId);
  });

  test('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/career-goals/abc');
    expect(res.status).toBe(400);
    expect(CareerGoal.findById).not.toHaveBeenCalled();
  });

  test('returns 404 when no record has that id', async () => {
    CareerGoal.findById.mockResolvedValue(null);
    const res = await request(app).get('/career-goals/' + validId);
    expect(res.status).toBe(404);
  });
});

describe('Protected writes without login', () => {
  test('POST returns 401', async () => {
    const res = await request(app).post('/career-goals').send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('PUT returns 401', async () => {
    const res = await request(app).put('/career-goals/' + validId).send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('DELETE returns 401', async () => {
    const res = await request(app).delete('/career-goals/' + validId);
    expect(res.status).toBe(401);
  });
});
