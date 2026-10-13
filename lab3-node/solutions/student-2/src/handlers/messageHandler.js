import { getLevelsList, getLevelHint, getCurrentLevel, setLevelCompleted } from '../breakout/levels.js';
import { calculateBounce, renderAsciiTrajectory } from '../breakout/physics.js';
import { parsePhysicsParams, formatEchoMessage } from '../utils/index.js';

const userStates = {};

const getOrCreateUserSession = (chatId) => {
  if (!userStates[chatId]) {
    userStates[chatId] = {
      state: 'IDLE',
      progress: { 1: false, 2: false, 3: false }
    };
  }
  return userStates[chatId];
};

const handleMessage = async (text, msgOrReply, maybeReply) => {
  let reply;
  let chatId = 'default';

  if (typeof msgOrReply === 'function') {
    reply = msgOrReply;
  } else {
    chatId = msgOrReply?.chat?.id || 'default';
    reply = maybeReply;
  }

  const user = getOrCreateUserSession(chatId);

  if (!text) {
    await reply('Пожалуйста, отправьте текстовую команду.');
    return;
  }

  if (text === '/start') {
    user.state = 'IDLE';
    await reply(
      'Я бот-помощник по игре Breakout! Доступные команды: /levels, /physics, /hint, /complete <номер>.'
    );
    return;
  }

  if (text === '/levels') {
    user.state = 'IDLE';
    await reply(
      `Уровни игры Breakout:\n\n${getLevelsList(user.progress)}\n\nЧтобы отметить уровень пройденным, отправьте: /complete <номер>`
    );
    return;
  }

  if (text.startsWith('/complete')) {
    user.state = 'IDLE';
    const parts = text.trim().split(/\s+/);
    const targetLevel = parts[1] || getCurrentLevel(user.progress);
    const res = setLevelCompleted(user.progress, targetLevel);
    await reply(res.message);
    return;
  }

  if (text === '/hint') {
    user.state = 'IDLE';
    const activeLevel = getCurrentLevel(user.progress);
    await reply(getLevelHint(activeLevel), { parse_mode: 'Markdown' });
    return;
  }

  if (text === '/physics') {
    user.state = 'AWAITING_PHYSICS_PARAMS';
    await reply(
      'Введите параметры для расчета траектории (угол в градусах 0-360 и скорость > 0 через пробел, например: 45 10):'
    );
    return;
  }

  switch (user.state) {
  case 'AWAITING_PHYSICS_PARAMS': {
    const parsed = parsePhysicsParams(text);
    if (!parsed.isValid) {
      await reply(`Некорректный ввод: ${parsed.error}`);
      return;
    }

    const result = calculateBounce(parsed.angle, parsed.speed);
    const diagram = renderAsciiTrajectory(parsed.angle);
    user.state = 'IDLE';

    const responseText =
        `Результат отскока:\n${result.summary}\n\n` +
        'Схема траектории:\n```\n' +
        `${diagram}\n` +
        '```';

    await reply(responseText, { parse_mode: 'Markdown' });
    break;
  }
  case 'IDLE':
  default: {
    await reply(formatEchoMessage(text));
    break;
  }
  }
};

export default handleMessage;