// Unit tests for the /education-goals GET endpoints. The model is mocked, so no database is needed.
jest.mock('../models/EducationGoal');
const request = require('supertest');
const EducationGoal = require('../models/EducationGoal');
const app = require('../app');

const validId = '665f1c2e8b3a4d0012345678';
const sample = { _id: validId, userId: '665f1c2e8b3a4d0012345679', title: 'Sample goal', status: 'Not Started' };

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

describe('GET /education-goals', () => {
  test('returns 200 and an array of goals', async () => {
    EducationGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([sample]) });
    const res = await request(app).get('/education-goals');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Sample goal');
  });

  test('returns 200 and an empty array when the collection is empty', async () => {
    EducationGoal.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    const res = await request(app).get('/education-goals');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 500 when the database fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    EducationGoal.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('db down')) });
    const res = await request(app).get('/education-goals');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});

describe('GET /education-goals/:id', () => {
  test('returns 200 and the matching goal', async () => {
    EducationGoal.findById.mockResolvedValue(sample);
    const res = await request(app).get('/education-goals/' + validId);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(validId);
  });

  test('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/education-goals/abc');
    expect(res.status).toBe(400);
    expect(EducationGoal.findById).not.toHaveBeenCalled();
  });

  test('returns 404 when no record has that id', async () => {
    EducationGoal.findById.mockResolvedValue(null);
    const res = await request(app).get('/education-goals/' + validId);
    expect(res.status).toBe(404);
  });
});

describe('Protected writes without login', () => {
  test('POST returns 401', async () => {
    const res = await request(app).post('/education-goals').send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('PUT returns 401', async () => {
    const res = await request(app).put('/education-goals/' + validId).send({ title: 'x' });
    expect(res.status).toBe(401);
  });
  test('DELETE returns 401', async () => {
    const res = await request(app).delete('/education-goals/' + validId);
    expect(res.status).toBe(401);
  });
});
