import React from 'react'

import { Eating, Day, Meal } from '../Types/Types'

export interface MealCalendarProps {
  day: Day[];
  eating: Eating[];
  meal: Meal[];
  selected?: Record<string, Meal>;
  choice: (day: Day, eating: Eating, meal: Meal) => void;
}

export const MealCalendar: React.FC<MealCalendarProps> = ({
  day, eating, meal, selected, choice,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {day.map((d) => (
            <th key={d}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {eating.map((eat) => (
          <tr key={eat}>
            <th>{eat}</th>
            {day.map((d) => {
              const day_meal = `${d}-${eat}`

              return (
                <td key={d}>
                  <select
                    value={selected?.[day_meal]?.id ?? ''}
                    onChange={(event) => {
                      const found = meal.find((i) => i.id === event.target.value)
                    
                      if (found){
                        choice(d, eat, found)
                      }
                    }}
                  >
                    <option value="">-</option>
                    {meal.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}