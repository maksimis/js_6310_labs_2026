import type { Day, Eating, Meal } from '@my-app/ui-library'

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thirsday', 'Friday', 'Sunday', 'Saturday']
export const EATINGS: Eating[] = ['breakfast', 'lunch', 'snack', 'dinner']

export const MEALS: Meal[] = [
  { id: '1', name: 'Омлет', ingredients: [
    { name: 'яйца', amount: 3, unit: 'шт' },
    { name: 'молоко', amount: 1, unit: 'л' },
  ] },
  { id: '2', name: 'Яичница', ingredients: [{ name: 'яйца', amount: 2, unit: 'шт' }] },
  { id: '3', name: 'Каша', ingredients: [
    { name: 'овсянка', amount: 1, unit: 'кг' },
    { name: 'молоко', amount: 1, unit: 'л' },
  ] },
  // новые блюда
  { id: '4', name: 'Борщ', ingredients: [
    { name: 'свёкла', amount: 2, unit: 'шт' },
    { name: 'капуста', amount: 1, unit: 'кг' },
    { name: 'картофель', amount: 1, unit: 'кг' },
    { name: 'мясо', amount: 1, unit: 'кг' },
  ] },
  { id: '5', name: 'Рагу', ingredients: [
    { name: 'картофель', amount: 1, unit: 'кг' },
    { name: 'мясо', amount: 1, unit: 'кг' },
    { name: 'морковь', amount: 2, unit: 'шт' },
  ] },
  { id: '6', name: 'Печенье', ingredients: [
    { name: 'мука', amount: 1, unit: 'кг' },
    { name: 'яйца', amount: 2, unit: 'шт' },
    { name: 'молоко', amount: 1, unit: 'л' },
  ] },
]