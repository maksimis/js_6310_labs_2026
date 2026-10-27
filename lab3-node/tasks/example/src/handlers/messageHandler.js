// Общий обработчик текстового сообщения для ботов (Telegram и VK)
const handleMessage = async (text, reply) => {
  if (text === '/start') {
    await reply('Привет! Я твой первый бот!');
    return;
  }

  if (text) {
    await reply(`Вы сказали: "${text}"`);
  }
}

export default handleMessage;