// tests/api.test.js
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const boards = new Map();
const getBoard = jest.fn();
const saveBoard = jest.fn();
const isValidUserId = (userId) => typeof userId === 'string' && /^\d{1,20}$/.test(userId);

jest.unstable_mockModule('../src/core/boardStore.js', () => ({
  getBoard,
  saveBoard,
  isValidUserId
}));

const { router } = await import('../src/api/index.js');
const { Board, Task } = await import('../src/core/models.js');

const app = express();
app.use(express.json());
app.use('/api', router);

const USER_ID = '123';
const OTHER_USER_ID = '456';

function boardFor(userId) {
  const key = String(userId);

  if (!boards.has(key)) {
    boards.set(key, new Board());
  }

  return boards.get(key);
}

describe('API Endpoints', () => {
  beforeEach(() => {
    boards.clear();
    getBoard.mockReset();
    getBoard.mockImplementation(async (userId) => {
      return boardFor(userId);
    });
    saveBoard.mockReset();
    saveBoard.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('проверка пользователя', () => {
    it('отклоняет запрос без X-User-Id', async () => {
      const response = await request(app).get('/api/board').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('X-User-Id');
    });

    it('отклоняет нечисловой X-User-Id', async () => {
      await request(app).get('/api/board').set('X-User-Id', 'abc').expect(400);
    });
  });

  describe('GET /api/board', () => {
    it('должен возвращать состояние доски', async () => {
      const response = await request(app)
          .get('/api/board')
          .set('X-User-Id', USER_ID)
          .expect('Content-Type', /json/)
          .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toContain('To Do');
    });

    it('должен возвращать 500 при ошибке загрузки', async () => {
      getBoard.mockRejectedValueOnce(new Error('load fail'));

      const response = await request(app)
          .get('/api/board')
          .set('X-User-Id', USER_ID)
          .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('должен возвращать 500 при внутренней ошибке', async () => {
      jest.spyOn(boardFor(USER_ID), 'getBoardState').mockImplementation(() => {
        throw new Error('boom');
      });

      const response = await request(app)
          .get('/api/board')
          .set('X-User-Id', USER_ID)
          .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('должен возвращать пустой список задач', async () => {
      const response = await request(app)
          .get('/api/tasks')
          .set('X-User-Id', USER_ID)
          .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('должен возвращать список задач с шагами', async () => {
      const task = new Task('001', 'Первая');
      task.moveTo('In Progress');
      boardFor(USER_ID).addTask(task);

      const response = await request(app)
          .get('/api/tasks')
          .set('X-User-Id', USER_ID)
          .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: '001',
        title: 'Первая',
        status: 'In Progress',
        steps: 1
      });
    });

    it('должен возвращать 500 при ошибке загрузки', async () => {
      getBoard.mockRejectedValueOnce(new Error('load fail'));

      await request(app).get('/api/tasks').set('X-User-Id', USER_ID).expect(500);
    });

    it('должен возвращать 500 при внутренней ошибке', async () => {
      boardFor(USER_ID).addTask({
        id: 'bad',
        getSteps: () => {
          throw new Error('boom');
        }
      });

      const response = await request(app)
          .get('/api/tasks')
          .set('X-User-Id', USER_ID)
          .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/task', () => {
    it('должен создавать задачу', async () => {
      const response = await request(app)
          .post('/api/task')
          .set('X-User-Id', USER_ID)
          .send({ title: '  Новая задача  ' })
          .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
      expect(response.body.data.title).toBe('Новая задача');
      expect(response.body.data.status).toBe('To Do');
      expect(boardFor(USER_ID).tasks).toHaveLength(1);
      expect(saveBoard).toHaveBeenCalledWith(USER_ID, boardFor(USER_ID));
    });

    it('должен выдавать возрастающие ID', async () => {
      await request(app).post('/api/task').set('X-User-Id', USER_ID).send({ title: 'Первая' }).expect(201);
      const response = await request(app)
          .post('/api/task')
          .set('X-User-Id', USER_ID)
          .send({ title: 'Вторая' })
          .expect(201);

      expect(response.body.data.id).toBe('2');
    });

    it('должен отклонять запрос без title', async () => {
      const response = await request(app)
          .post('/api/task')
          .set('X-User-Id', USER_ID)
          .send({})
          .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('title');
    });

    it('должен отклонять нестроковый title', async () => {
      await request(app).post('/api/task').set('X-User-Id', USER_ID).send({ title: 42 }).expect(400);
    });

    it('должен отклонять пустой title', async () => {
      await request(app).post('/api/task').set('X-User-Id', USER_ID).send({ title: '   ' }).expect(400);
    });

    it('должен возвращать 500 при ошибке загрузки', async () => {
      getBoard.mockRejectedValueOnce(new Error('load fail'));

      await request(app).post('/api/task').set('X-User-Id', USER_ID).send({ title: 'Задача' }).expect(500);
    });

    it('должен возвращать 500 при ошибке сохранения', async () => {
      saveBoard.mockRejectedValueOnce(new Error('disk'));

      const response = await request(app)
          .post('/api/task')
          .set('X-User-Id', USER_ID)
          .send({ title: 'Задача' })
          .expect(500);

      expect(response.body.error).toContain('сохранить');
    });
  });

  describe('POST /api/move', () => {
    it('должен перемещать задачу', async () => {
      boardFor(USER_ID).addTask(new Task('001', 'Первая'));

      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001', targetStatus: 'In Progress' })
          .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('In Progress');
      expect(response.body.data.steps).toBe(1);
      expect(saveBoard).toHaveBeenCalledWith(USER_ID, boardFor(USER_ID));
    });

    it('должен отклонять запрос без taskId', async () => {
      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ targetStatus: 'Done' })
          .expect(400);

      expect(response.body.error).toContain('taskId');
    });

    it('должен отклонять нестроковый taskId', async () => {
      await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: 1, targetStatus: 'Done' })
          .expect(400);
    });

    it('должен отклонять запрос без targetStatus', async () => {
      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001' })
          .expect(400);

      expect(response.body.error).toContain('targetStatus');
    });

    it('должен отклонять недопустимый targetStatus', async () => {
      await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001', targetStatus: 'To Do' })
          .expect(400);
    });

    it('должен возвращать ошибку для несуществующей задачи', async () => {
      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '999', targetStatus: 'Done' })
          .expect(400);

      expect(response.body.error).toBe('Задача не найдена');
    });

    it('должен возвращать ошибку при перемещении в ту же колонку', async () => {
      const task = new Task('001', 'Первая');
      task.moveTo('In Progress');
      boardFor(USER_ID).addTask(task);

      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001', targetStatus: 'In Progress' })
          .expect(400);

      expect(response.body.error).toBe('Задача уже в этой колонке');
    });

    it('должен возвращать ошибку при превышении WIP', async () => {
      for (let i = 0; i < 3; i++) {
        const task = new Task(`00${i}`, `Задача ${i}`);
        task.moveTo('In Progress');
        boardFor(USER_ID).addTask(task);
      }
      boardFor(USER_ID).addTask(new Task('004', 'Новая'));

      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '004', targetStatus: 'In Progress' })
          .expect(400);

      expect(response.body.error).toContain('Превышен лимит WIP');
    });

    it('должен возвращать 500 при ошибке загрузки', async () => {
      getBoard.mockRejectedValueOnce(new Error('load fail'));

      await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001', targetStatus: 'Done' })
          .expect(500);
    });

    it('должен возвращать 500 при ошибке сохранения', async () => {
      boardFor(USER_ID).addTask(new Task('001', 'Первая'));
      saveBoard.mockRejectedValueOnce(new Error('disk'));

      const response = await request(app)
          .post('/api/move')
          .set('X-User-Id', USER_ID)
          .send({ taskId: '001', targetStatus: 'Done' })
          .expect(500);

      expect(response.body.error).toContain('сохранить');
    });
  });

  it('держит доски разных пользователей раздельно', async () => {
    await request(app).post('/api/task').set('X-User-Id', USER_ID).send({ title: 'Только моя' }).expect(201);

    const response = await request(app)
        .get('/api/tasks')
        .set('X-User-Id', OTHER_USER_ID)
        .expect(200);

    expect(response.body.data).toEqual([]);
  });
});
