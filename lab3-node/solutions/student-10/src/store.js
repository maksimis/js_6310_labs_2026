const users = new Map();

const defaultRecipes = () => [
  {
    name: 'Паннакотта',
    ingredients: [
      { name: 'сливки', amount: 500, unit: 'мл' },
      { name: 'сахар', amount: 100, unit: 'г' },
      { name: 'желатин', amount: 15, unit: 'г' },
      { name: 'ванильный сахар', amount: 10, unit: 'г' },
    ],
    steps: ['Замочить желатин', 'Нагреть сливки с сахаром', 'Растворить желатин', 'Разлить по формам и охладить'],
  },
  {
    name: 'Медовик',
    ingredients: [
      { name: 'мука', amount: 400, unit: 'г' },
      { name: 'мед', amount: 100, unit: 'г' },
      { name: 'яйца', amount: 2, unit: 'шт' },
      { name: 'сахар', amount: 150, unit: 'г' },
      { name: 'сливочное масло', amount: 100, unit: 'г' },
      { name: 'сметана', amount: 500, unit: 'г' },
    ],
    steps: ['Замесить медовое тесто', 'Испечь коржи', 'Взбить крем из сметаны', 'Смазать коржи кремом и оставить пропитаться'],
  },
  {
    name: 'Сырники',
    ingredients: [
      { name: 'творог', amount: 500, unit: 'г' },
      { name: 'яйцо', amount: 1, unit: 'шт' },
      { name: 'мука', amount: 50, unit: 'г' },
      { name: 'сахар', amount: 30, unit: 'г' },
      { name: 'растительное масло', amount: 20, unit: 'мл' },
    ],
    steps: ['Смешать творог, яйцо и сахар', 'Добавить муку и замесить тесто', 'Сформировать сырники', 'Обжарить с двух сторон до золотистой корочки'],
  }
];

// Состояние каждого пользователя изолировано по userId
export const getUser = (userId) => {
  if (!users.has(userId)) {
    users.set(userId, {
      state: 'IDLE',
      draft: {},
      recipes: defaultRecipes(),
      plan: {},
      bought: {},
    });
  }
  return users.get(userId);
};

export const clearStore = () => users.clear();