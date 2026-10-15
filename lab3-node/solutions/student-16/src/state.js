const sessions = new Map();

export const STEPS = {
  IDLE: 'idle',
  MODE: 'mode',
  TOPIC: 'topic',
  QUESTION: 'question',
  FINISHED: 'finished',
};

export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      step: STEPS.IDLE,
      mode: null,
      topic: null,
      questions: [],
      index: 0,
      score: 0,
    });
  }
  return sessions.get(userId);
}

export function resetSession(userId) {
  sessions.set(userId, {
    step: STEPS.IDLE,
    mode: null,
    topic: null,
    questions: [],
    index: 0,
    score: 0,
  });
  return sessions.get(userId);
}

export function clearSessions() {
  sessions.clear();
}