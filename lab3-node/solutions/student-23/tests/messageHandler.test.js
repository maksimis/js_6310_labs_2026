import {
  createMessageHandler,
  UserFSM,
  formatTask,
  STATES
} from '../src/messageHandler.js';
import { clearTasks, clearStats } from '../src/storage.js';

function makeCtx(userId, text) {
  const sent = [];
  return {
    senderId: userId,
    text,
    sent,
    send: async (payload) => sent.push(payload)
  };
}

function lastText(ctx) {
  const last = ctx.sent[ctx.sent.length - 1];
  return typeof last === 'string' ? last : last.message;
}

function lastKeyboard(ctx) {
  const last = ctx.sent[ctx.sent.length - 1];
  return typeof last === 'object' ? last.keyboard : undefined;
}

describe('messageHandler', () => {
  let fsm;
  let handler;

  beforeEach(() => {
    clearTasks();
    clearStats();
    fsm = new UserFSM();
    handler = createMessageHandler(fsm);
  });

  it('отвечает на /start и показывает клавиатуру', async () => {
    const ctx = makeCtx(1, '/start');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Привет/);
    expect(lastKeyboard(ctx)).toBeDefined();
    expect(fsm.get(1).state).toBe(STATES.IDLE);
  });

  it('проходит FSM-цепочку /gen_task → js → test', async () => {
    await handler(makeCtx(1, '/gen_task'));
    expect(fsm.get(1).state).toBe(STATES.AWAITING_TOPIC);

    await handler(makeCtx(1, 'js'));
    expect(fsm.get(1).state).toBe(STATES.AWAITING_TYPE);

    const c = makeCtx(1, 'test');
    await handler(c);
    expect(fsm.get(1).state).toBe(STATES.AWAITING_ANSWER);
    expect(lastText(c)).toMatch(/Задание/);
    expect(lastKeyboard(c)).toBeDefined();
  });

  it('не пускает дальше при неверной теме', async () => {
    await handler(makeCtx(1, '/gen_task'));
    const c = makeCtx(1, 'java');
    await handler(c);
    expect(fsm.get(1).state).toBe(STATES.AWAITING_TOPIC);
    expect(lastText(c)).toMatch(/Неверная тема/);
  });

  it('не пускает дальше при неверном типе', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'quiz');
    await handler(c);
    expect(fsm.get(1).state).toBe(STATES.AWAITING_TYPE);
    expect(lastText(c)).toMatch(/Неверный тип/);
  });

  it('принимает ответ на тест просто как букву', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'test');
    await handler(c);

    const taskId = lastText(c).match(/#(\S+)/)[1];
    expect(taskId).toBeTruthy();

    const answerCtx = makeCtx(1, 'A');
    await handler(answerCtx);
    expect(fsm.get(1).state).toBe(STATES.IDLE);
    expect(lastText(answerCtx)).toBeTruthy();
  });

  it('принимает развёрнутый ответ на теорию', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'theory');
    await handler(c);
    expect(fsm.get(1).state).toBe(STATES.AWAITING_ANSWER);
    expect(lastText(c)).toMatch(/минимум 15 символов/);

    const answerCtx = makeCtx(
      1,
      'Это функция, которая запоминает переменную и область видимости'
    );
    await handler(answerCtx);
    expect(fsm.get(1).state).toBe(STATES.IDLE);
  });

  it('отклоняет слишком короткий ответ на теорию', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    await handler(makeCtx(1, 'theory'));

    const answerCtx = makeCtx(1, 'не знаю');
    await handler(answerCtx);
    expect(lastText(answerCtx)).toMatch(/слишком короткий/i);
  });

  it('принимает ответ через /check', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'test');
    await handler(c);
    const taskId = lastText(c).match(/#(\S+)/)[1];

    const checkCtx = makeCtx(1, `/check ${taskId} A`);
    await handler(checkCtx);
    expect(fsm.get(1).state).toBe(STATES.IDLE);
  });

  it('обрабатывает /check help', async () => {
    const ctx = makeCtx(1, '/check help');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Команда \/check/);
  });

  it('обрабатывает /check без аргументов как справку', async () => {
    const ctx = makeCtx(1, '/check');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Команда \/check/);
  });

  it('сообщает об использовании /check при нехватке аргументов', async () => {
    const ctx = makeCtx(1, '/check abc123');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Использование/);
  });

  it('изолирует состояния разных пользователей', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(2, '/gen_task'));
    await handler(makeCtx(2, 'node'));

    expect(fsm.get(1).state).toBe(STATES.AWAITING_TOPIC);
    expect(fsm.get(2).state).toBe(STATES.AWAITING_TYPE);
    expect(fsm.get(2).context.topic).toBe('node');
  });

  it('показывает статистику', async () => {
    const ctx = makeCtx(1, '/stats');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Статистика/);
  });

  it('отвечает на неизвестную команду', async () => {
    const ctx = makeCtx(1, 'hello');
    await handler(ctx);
    expect(lastText(ctx)).toMatch(/Неизвестная команда/);
  });

  it('formatTask содержит варианты и подсказку для теста', () => {
    const msg = formatTask({
      id: 'a1',
      topicName: 'JS',
      type: 'test',
      question: 'Q?',
      options: ['a', 'b']
    });
    expect(msg).toMatch(/A\) a/);
    expect(msg).toMatch(/B\) b/);
    expect(msg).toMatch(/букву/);
  });

  it('принимает /check <answer> в состоянии AWAITING_ANSWER', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'theory');
    await handler(c);
  
    // Пользователь пишет /check + свободный текст (без ID)
    const ctx = makeCtx(
      1,
      '/check Это когда функция запоминает переменную и область видимости'
    );
    await handler(ctx);
    expect(fsm.get(1).state).toBe(STATES.IDLE);
    expect(lastText(ctx)).toBeTruthy();
  });
  
  it('принимает /check <currentId> <answer> в состоянии AWAITING_ANSWER', async () => {
    await handler(makeCtx(1, '/gen_task'));
    await handler(makeCtx(1, 'js'));
    const c = makeCtx(1, 'test');
    await handler(c);
  
    const taskId = lastText(c).match(/#(\S+)/)[1];
    const ctx = makeCtx(1, `/check ${taskId} A`);
    await handler(ctx);
    expect(fsm.get(1).state).toBe(STATES.IDLE);
  });
  
  it('formatTask содержит подсказку для теории', () => {
    const msg = formatTask({
      id: 'a2',
      topicName: 'JS',
      type: 'theory',
      question: 'Что такое замыкание?'
    });
    expect(msg).toMatch(/Теория/);
    expect(msg).toMatch(/минимум 15 символов/);
  });
});