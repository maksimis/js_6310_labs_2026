"use strict";

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
  // 1.1 Объявите переменные разных типов (не менее 5)
  let num = 1;
  let name = "Ivan";
  let isTrue = true;
  let nullValue = null;
  let undefinedValue;

  // 1.2 Выведите типы всех переменных
  const writeType = (param) => console.log(typeof param);
  writeType(num);
  writeType(name);
  writeType(isTrue);
  writeType(nullValue);
  writeType(undefinedValue);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
  // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
  return (number + lab) % 30;
}

function getVariant(number, variants) {
  // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
  return number % variants;
}

function calculate(a, b, operation) {
  // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
  switch (operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new Error("Деление на ноль невозможно");
      }
      return a / b;
    default:
      throw new Error(`Неизвестная операция: ${operation}`);
  }
}

function calculateArea(figure, ...params) {
  // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
  // Используйте switch.
  switch (figure) {
    case "circle": {
      const [radius] = params;
      return Math.PI * radius ** 2;
    }
    case "rectangle": {
      const [width, height] = params;
      return width * height;
    }
    case "triangle": {
      const [base, height] = params;
      return (base * height) / 2;
    }
    default:
      throw new Error(`Неизвестная фигура: ${figure}`);
  }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
  // Функция возвращает перевернутую строку
  return str.split("").reverse().join("");
};

const getRandomNumber = (min, max) => {
  // Функция возвращает случайное число между min и max
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
  // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
  // года выпуска, количества страниц, и доступности
  // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
  // метод toggleAvailability - который меняет значение доступности и возвращает его
  title: "Мастер и Маргарита",
  author: "Михаил Булгаков",
  year: 1967,
  pages: 480,
  isAvailable: true,

  getInfo() {
    return `"${this.title}", автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
  },

  toggleAvailability() {
    this.isAvailable = !this.isAvailable;
    return this.isAvailable;
  },
};

const student = {
  // 3.2 Реализуйте методы объекта "студент"
  name: "Анна Петрова",
  age: 20,
  course: 2,
  grades: {
    math: 90,
    programming: 95,
    history: 85,
  },

  // Метод для расчета среднего балла
  getAverageGrade() {
    const values = Object.values(this.grades);
    const sum = values.reduce((acc, grade) => acc + grade, 0);
    return sum / values.length;
  },

  // Метод для добавления новой оценки
  addGrade(subject, grade) {
    this.grades[subject] = grade;
    return this.grades;
  },
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
  const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
  const words = [
    "JavaScript",
    "программирование",
    "массив",
    "функция",
    "объект",
  ];
  const users = [
    { id: 1, name: "Анна", age: 25, isActive: true },
    { id: 2, name: "Борис", age: 30, isActive: false },
    { id: 3, name: "Виктория", age: 22, isActive: true },
    { id: 4, name: "Григорий", age: 35, isActive: true },
    { id: 5, name: "Дарья", age: 28, isActive: false },
  ];

  // 1. Используйте forEach для вывода всех чисел больше 50
  console.log("Числа больше 50:");
  numbers.forEach((n) => {
    if (n > 50) console.log(n);
  });

  // 2. Используйте map для создания массива квадратов чисел
  const squares = numbers.map((n) => n ** 2);
  console.log("Квадраты чисел:", squares);

  // 3. Используйте filter для получения активных пользователей
  const activeUsers = users.filter((u) => u.isActive);
  console.log(
    "Активные пользователи:",
    activeUsers.map((u) => u.name),
  );

  // 4. Используйте find для поиска пользователя с именем "Виктория"
  const victoria = users.find((u) => u.name === "Виктория");
  console.log("Найден пользователь:", victoria);

  // 5. Используйте reduce для подсчета суммы всех чисел
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  console.log("Сумма чисел:", sum);

  // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
  const sortedByAge = [...users].sort((a, b) => b.age - a.age);
  console.log(
    "Пользователи по убыванию возраста:",
    sortedByAge.map((u) => `${u.name} (${u.age})`),
  );

  // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
  const allAdults = users.every((u) => u.age > 18);
  console.log("Все пользователи старше 18 лет:", allAdults);

  // 8. Создайте цепочку методов:
  //    - отфильтровать активных пользователей
  //    - преобразовать в массив имен
  //    - отсортировать по алфавиту
  const activeUserNames = users
    .filter((u) => u.isActive)
    .map((u) => u.name)
    .sort((a, b) => a.localeCompare(b, "ru"));
  console.log("Имена активных пользователей (по алфавиту):", activeUserNames);

  return {
    squares,
    activeUsers,
    victoria,
    sum,
    sortedByAge,
    allAdults,
    activeUserNames,
  };
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
  tasks: [
    { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
    {
      id: 2,
      title: "Сделать лабораторную работу",
      completed: true,
      priority: "high",
    },
    { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" },
  ],

  addTask(title, priority = "medium") {
    // 5.1 Добавление задачи
    const newId =
      this.tasks.length > 0
        ? Math.max(...this.tasks.map((task) => task.id)) + 1
        : 1;
    const newTask = { id: newId, title, completed: false, priority };
    this.tasks.push(newTask);
    return newTask;
  },

  completeTask(taskId) {
    // 5.2 Отметка выполнения
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = true;
    }
    return task;
  },

  // Удаление задачи
  deleteTask(taskId) {
    // 5.3 Ваш код здесь
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  },

  // Получение списка задач по статусу
  getTasksByStatus(completed) {
    // 5.4 Ваш код здесь
    return this.tasks.filter((task) => task.completed === completed);
  },

  getStats() {
    /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  },
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
  // 6.1 Базовый класс Vehicle
  // В конструкторе принимайте и сохраняйте в this свойства:
  // make (марка), model (модель), year (год выпуска).
  class Vehicle {
    static vehicleCount = 0;

    constructor(make, model, year) {
      this.make = make;
      this.model = model;
      this.year = year;
      Vehicle.vehicleCount++;
    }

    // Добавьте метод displayInfo(), который выводит в консоль информацию
    // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
    displayInfo() {
      console.log(
        `Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`,
      );
    }

    // Добавьте геттер age, который возвращает возраст транспортного средства
    // (текущий год минус год выпуска). Используйте new Date().getFullYear().
    get age() {
      return new Date().getFullYear() - this.year;
    }

    // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
    set year(newYear) {
      const currentYear = new Date().getFullYear();
      if (newYear > currentYear) {
        throw new Error("Год выпуска не может быть больше текущего года");
      }
      this._year = newYear;
    }

    get year() {
      return this._year;
    }

    // Добавьте статический метод compareAge(vehicle1, vehicle2),
    // который возвращает разницу в возрасте между двумя транспортными средствами.
    static compareAge(vehicle1, vehicle2) {
      return vehicle1.age - vehicle2.age;
    }

    static getTotalVehicles() {
      return Vehicle.vehicleCount;
    }

    // 6.4 Статические методы и свойства
    // Добавьте статическое свойство vehicleCount в класс Vehicle
    // для подсчета количества созданных транспортных средств.
    // (добавьте в конструктор: Vehicle.vehicleCount++;)
    // Создайте статический метод getTotalVehicles(),
    // который возвращает общее количество созданных транспортных средств.
  }

  // 6.2 Класс Car (наследуется от Vehicle)
  // Добавьте новое свойство numDoors (количество дверей).
  class Car extends Vehicle {
    constructor(make, model, year, numDoors = 4) {
      super(make, model, year);
      this.numDoors = numDoors;
    }

    // Переопределите метод displayInfo() так, чтобы он также выводил количество дверей.
    // Используйте super.displayInfo() для вызова метода родителя.
    displayInfo() {
      super.displayInfo();
      console.log(`Количество дверей: ${this.numDoors}`);
    }

    // Добавьте метод honk(), который выводит "Beep beep!".
    honk() {
      console.log("Beep beep!");
    }
  }

  // 6.3 Класс ElectricCar (наследуется от Car)
  // Добавьте новое свойство batteryCapacity (емкость батареи в кВт·ч).
  class ElectricCar extends Car {
    constructor(make, model, year, numDoors, batteryCapacity) {
      super(make, model, year, numDoors);
      this.batteryCapacity = batteryCapacity;
    }

    // Переопределите метод displayInfo() для вывода дополнительной информации о батарее.
    displayInfo() {
      super.displayInfo();
      console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
    }

    // Добавьте метод calculateRange(), который рассчитывает примерный запас хода
    // (предположим, что 1 кВт·ч = 6 км).
    calculateRange() {
      return this.batteryCapacity * 6;
    }
  }

  // ===== ЗАДАНИЕ 7: Каррирование =====
  // Создайте функцию createVehicleFactory, которая возвращает функцию
  // для создания транспортных средств определенного типа (каррирование).
  const createVehicleFactory = (vehicleType) => (make, model, year) => {
    return new vehicleType(make, model, year); // Замените {} на выражение
  };

  return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====
/*
Дополнительные материалы:
https://regex101.com/ - интерактивный тестер regex
MDN Regular Expressions - https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_expressions
Learn Regex - https://github.com/ziishaned/learn-regex - учебник по regex

Задание (по вариантам):
1. Изучите функции с регулярными выражениями по своему варианту
На защите вы должны суметь объяснить структуру регулярного выражения.
2. Напишите тесты, покрывающие все различные варианты. Обратите внимание: тесты должны обеспечивать полное покрытие, но не быть дублирующимися.
3. Если предложенное регулярное выражение некорректно, вы можете исправить его.

Вычисление своего варианта:
Номер варианта = Ваш номер % Общее количество вариантов
 */

/**
 * Вариант 1: Валидация email адреса
 * Правила:
 * - Латиница, цифры, спецсимволы: ._%+-
 * - Обязательный символ @
 * - Доменная часть: латиница, цифры, точка
 * - Минимальная длина 5 символов
 */
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Вариант 2: Валидация пароля
 * Правила:
 * - Минимум 8 символов
 * - Хотя бы одна заглавная буква
 * - Хотя бы одна строчная буква
 * - Хотя бы одна цифра
 * - Хотя бы один специальный символ: !@#$%^&*()
 */
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Вариант 3: Валидация номера телефона (российский формат)
 * Поддерживает форматы:
 * - +7 (999) 123-45-67
 * - 8 (999) 123-45-67
 * - 89991234567
 * - +7(999)123-45-67
 */
function validatePhone(phone) {
  const phoneRegex = /^(\+7|8)[\s(-]?\d{3}[\s)-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  return phoneRegex.test(phone);
}

/**
 * Вариант 4: Валидация даты в формате DD.MM.YYYY
 * Правила:
 * - День: 01-31
 * - Месяц: 01-12
 * - Год: 1900-2099
 */
function validateDate(date) {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
  return dateRegex.test(date);
}

// Бонус: выполните все остальные варианты. Выполнение бонуса не учитывается в итоговой оценке.

// Вариант 2: Валидация пароля
// validatePassword: валидные случаи
function runRegexTests() {
  console.log("=== ТЕСТЫ РЕГУЛЯРНЫХ ВЫРАЖЕНИЙ ===");
  console.assert(
    validatePassword("Passw0rd!") === true,
    "password: все требования выполнены",
  );
  // validatePassword: невалидные случаи (по одному нарушению на тест)
  console.assert(
    validatePassword("passw0rd!") === false,
    "password: нет заглавной буквы",
  );
  console.assert(
    validatePassword("PASSW0RD!") === false,
    "password: нет строчной буквы",
  );
  console.assert(
    validatePassword("Password!") === false,
    "password: нет цифры",
  );
  console.assert(
    validatePassword("Passw0rd") === false,
    "password: нет спецсимвола",
  );
  console.assert(
    validatePassword("Pw0!abcd") === true,
    "password: ровно 8 символов - валидно",
  );
  console.assert(
    validatePassword("Pw0!abc") === false,
    "password: короче 8 символов",
  );

  console.log("Тесты регулярных выражений завершены");
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
  console.log("=== ТЕСТИРОВАНИЕ ===");

  // Тест 1: getReviewerNumber
  console.assert(
    getReviewerNumber(5, 1) === 6,
    "Тест получения ревьюера провален",
  );

  // Тест 2: calculate
  console.assert(calculate(10, 5, "+") === 15, "Тест калькулятора провален");

  // Тест 3: taskManager
  console.assert(
    (taskManager.getStats() || {}).total === 3,
    "Тест taskManager провален",
  );

  // Тест 4: классы и наследование
  const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
  const vehicle = new Vehicle("Toyota", "Camry", 2015);
  vehicle.displayInfo();
  console.log(`Возраст: ${vehicle.age} лет`);

  const car = new Car("Honda", "Civic", 2018, 4);
  car.displayInfo();
  car.honk();

  const electricCar = new ElectricCar("Tesla", "Model 3", 2020, 4, 75);
  electricCar.displayInfo();
  console.log(`Запас хода: ${electricCar.calculateRange()} км`);

  const testVehicle = new Vehicle("Test", "Model", 2010);
  console.assert(
    testVehicle.age === new Date().getFullYear() - 2010,
    "Тест возраста провален",
  );

  const createCarFactory = createVehicleFactory(Car);
  const myNewCar = createCarFactory("BMW", "X5", 2022);
  console.log("Создан новый автомобиль:");
  myNewCar.displayInfo();

  console.log(
    "Всего создано транспортных средств:",
    Vehicle.getTotalVehicles(),
  );

  // Добавьте остальные тесты...

  // Тест 5: calculateArea
  console.assert(
    Math.abs(calculateArea("circle", 2) - Math.PI * 4) < 1e-9,
    "Тест площади круга провален",
  );
  console.assert(
    calculateArea("rectangle", 3, 4) === 12,
    "Тест площади прямоугольника провален",
  );
  console.assert(
    calculateArea("triangle", 6, 4) === 12,
    "Тест площади треугольника провален",
  );

  // Тест 6: стрелочные функции
  console.assert(
    reverseString("JavaScript") === "tpircSavaJ",
    "Тест reverseString провален",
  );
  const randomNum = getRandomNumber(1, 10);
  console.assert(
    randomNum >= 1 && randomNum <= 10,
    "Тест getRandomNumber провален",
  );

  // Тест 7: getVariant
  console.assert(getVariant(23, 4) === 3, "Тест getVariant провален");

  // Тест 8: объект book
  console.log(book.getInfo());
  const initialAvailability = book.isAvailable;
  const toggledAvailability = book.toggleAvailability();
  console.assert(
    toggledAvailability === !initialAvailability,
    "Тест toggleAvailability провален",
  );

  // Тест 9: объект student
  console.assert(
    Math.abs(student.getAverageGrade() - 90) < 1e-9,
    "Тест среднего балла провален",
  );
  student.addGrade("english", 100);
  console.assert(
    student.grades.english === 100,
    "Тест добавления оценки провален",
  );

  // Тест 10: массивы
  const arrayResults = processArrays();
  console.assert(arrayResults.sum === 458, "Тест суммы массива провален");
  console.assert(
    arrayResults.activeUsers.length === 3,
    "Тест активных пользователей провален",
  );
  console.assert(
    arrayResults.victoria.id === 3,
    "Тест поиска пользователя провален",
  );
  console.assert(
    arrayResults.allAdults === true,
    "Тест проверки совершеннолетия провален",
  );

  // Тест 11: taskManager - остальные методы
  const addedTask = taskManager.addTask("Новая задача", "low");
  console.assert(
    taskManager.tasks.some((t) => t.id === addedTask.id),
    "Тест добавления задачи провален",
  );
  taskManager.completeTask(1);
  console.assert(
    taskManager.tasks.find((t) => t.id === 1).completed === true,
    "Тест выполнения задачи провален",
  );
  console.assert(
    taskManager.getTasksByStatus(true).length >= 1,
    "Тест получения задач по статусу провален",
  );
  const statsBeforeDelete = taskManager.getStats().total;
  taskManager.deleteTask(addedTask.id);
  console.assert(
    taskManager.getStats().total === statsBeforeDelete - 1,
    "Тест удаления задачи провален",
  );

  // Тест 12: регулярные выражения
  runRegexTests();

  console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();
