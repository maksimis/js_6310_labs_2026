export function handleScore(session) {
  if (!session.quiz) {
    return 'Активная сессия отсутствует. Начните игру командой /new_quiz.';
  }
  return `Текущий счёт: ${session.quiz.score} из ${session.quiz.questions.length}`;
}