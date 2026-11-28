export type Eating = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thirsday'| 'Friday' | 'Sunday' | 'Saturday' ;
export type Unit = 'л' | 'шт' | 'кг';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

export interface Meal {
  name: string;
  id: string;
  ingredients: Ingredient[];
}