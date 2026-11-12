import { 
  addHabit, checkHabit, getProgress, getUserHabits, 
  getUserState, setUserState 
} from '../utils/storage.js';

const handleMessage = async (text, userId, reply) => {
  const trimmedText = text.trim();
  let state = getUserState(userId);

  // Сброс состояния при команде /start
  if (trimmedText === '/start') {
    setUserState(userId, 'IDLE', {});
    return reply('Привет! Я HabitBot. Используйте /add_habit, /check или /progress.');
  }

  // Команды всегда обрабатываются, независимо от текущего состояния
  if (trimmedText === '/add_habit') {
    setUserState(userId, 'WAITING_FOR_NAME', {});
    return reply('Введите название привычки:');
  }
  
  if (trimmedText === '/check') {
    const habits = getUserHabits(userId);
    if (habits.length === 0) {
      setUserState(userId, 'IDLE', {});
      return reply('У вас пока нет привычек. Добавьте через /add_habit.');
    }
    setUserState(userId, 'WAITING_FOR_CHECK_NAME', {});
    return reply(`Какую привычку отмечаем? Доступны: ${habits.join(', ')}`);
  }
  
  if (trimmedText === '/progress') {
    const habits = getUserHabits(userId);
    if (habits.length === 0) return reply('Нет привычек для отображения прогресса.');
    setUserState(userId, 'WAITING_FOR_PROGRESS_NAME', {});
    return reply(`Прогресс какой привычки показать? (${habits.join(', ')})`);
  }

  // Обработка состояний ожидания (только для обычного текста)
  if (state.step === 'WAITING_FOR_NAME') {
    // Защита от служебных имен и пустых строк
    if (trimmedText === '_state' || trimmedText === '__proto__' || trimmedText.startsWith('_')) {
      return reply('❌ Недопустимое название. Используйте обычное слово без символов _ в начале.');
    }
    if (trimmedText.length === 0) {
      return reply('❌ Название не может быть пустым. Введите название привычки:');
    }
    setUserState(userId, 'WAITING_FOR_FREQUENCY', { tempHabitName: trimmedText });
    return reply('Выберите периодичность, отправив число:\n1 - Ежедневно\n2 - Несколько раз в неделю');
  }

  if (state.step === 'WAITING_FOR_FREQUENCY') {
    if (trimmedText !== '1' && trimmedText !== '2') {
      return reply('Пожалуйста, отправьте 1 или 2.');
    }
    const freq = trimmedText === '1' ? 'daily' : 'weekly';
    addHabit(userId, state.data.tempHabitName, freq);
    setUserState(userId, 'IDLE', {});
    return reply(`✅ Привычка "${state.data.tempHabitName}" добавлена!`);
  }

  if (state.step === 'WAITING_FOR_CHECK_NAME') {
    const data = getProgress(userId, trimmedText);
    if (!data) {
      setUserState(userId, 'IDLE', {});
      return reply('❌ Привычка не найдена. Проверьте название или добавьте новую.');
    }
    
    // Проверяем, выполнена ли привычка сегодня, до повторной отметки
    if (data.isDoneToday) {
      setUserState(userId, 'IDLE', {});
      return reply(`️ Привычка "${trimmedText}" уже выполнена сегодня!`);
    }
    
    checkHabit(userId, trimmedText);
    setUserState(userId, 'IDLE', {});
    return reply(`✅ Привычка "${trimmedText}" отмечена на сегодня!`);
  }

  if (state.step === 'WAITING_FOR_PROGRESS_NAME') {
    const data = getProgress(userId, trimmedText);
    setUserState(userId, 'IDLE', {});
    if (!data) return reply('Привычка не найдена.');
    
    const totalDays = data.history.length;
    
    // Считаем прогресс за неделю (последние 7 дней)
    const weekDays = data.history.filter(date => {
      const diff = Date.now() - new Date(date).getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    
    // Считаем прогресс за месяц (последние 30 дней)
    const monthDays = data.history.filter(date => {
      const diff = Date.now() - new Date(date).getTime();
      return diff <= 30 * 24 * 60 * 60 * 1000;
    }).length;
    
    const bar = '█'.repeat(Math.min(totalDays, 10)) + '░'.repeat(Math.max(0, 10 - totalDays));
    const weekBar = '█'.repeat(weekDays) + '░'.repeat(Math.max(0, 7 - weekDays));
    const monthBar = '█'.repeat(Math.min(monthDays, 30)) + '░'.repeat(Math.max(0, 30 - monthDays));
    
    return reply(
      `📊 Прогресс: "${trimmedText}"\n` +
      `Периодичность: ${data.frequency}\n` +
      `\n📅 За неделю (7 дней): ${weekDays}/7\n[${weekBar}]\n` +
      `📆 За месяц (30 дней): ${monthDays}/30\n[${monthBar}]\n` +
      `📈 Всего выполнено дней: ${totalDays}\n` +
      `Прогресс: [${bar}] ${Math.min(totalDays * 10, 100)}%\n` +
      `🔥 Текущий стрик: ${data.streak} дн.\n` +
      `Выполнено сегодня: ${data.isDoneToday ? 'Да ✅' : 'Нет ❌'}`
    );
  }

  return reply('Неизвестная команда. Используйте /start для справки.');
};

export default handleMessage;