'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const name = "Антон";
    const age = 20;
    const isStudent = true;
    const diploma = null;
    let averageScore;

    // 1.2 Выведите типы всех переменных
    console.log("Тип name:", typeof name);
    console.log("Тип age:", typeof age);
    console.log("Тип isStudent:", typeof isStudent);
    console.log("Тип diploma:", typeof diploma);
    console.log("Тип averageScore:", typeof averageScore);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    const reviewer = (number + lab) % 30;
    return reviewer === 0 ? reviewer + 1 : reviewer;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    const variant = number % variants;
    return variant === 0 ? variants : variant;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) return "Ошибка: деление на ноль";
            return a / b;
        default: return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle':
            return Math.PI * params[0] ** 2;
        case 'rectangle':
            return params[0] * params[1];
        case 'triangle':
            return 0.5 * params[0] * params[1];
        default:
            return "Неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    title: "Чистый код",
    author: "Роберт Мартин",
    year: 2008,
    pages: 464,
    isAvailable: true,

    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    getInfo() {
        return `${this.title}, ${this.author}, ${this.year} год, ${this.pages} стр.`;
    },

    // метод toggleAvailability - который меняет значение доступности и возвращает его
    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
};

const student = {
    // 3.2 Реализуйте методы объекта "студент"
    name: "Анна Петрова",
    age: 20,
    course: 2,
    grades: {
        math: 90,
        programming: 95,
        history: 85
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
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
    const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
    const words = ["JavaScript", "программирование", "массив", "функция", "объект"];
    const users = [
        { id: 1, name: "Анна", age: 25, isActive: true },
        { id: 2, name: "Борис", age: 30, isActive: false },
        { id: 3, name: "Виктория", age: 22, isActive: true },
        { id: 4, name: "Григорий", age: 35, isActive: true },
        { id: 5, name: "Дарья", age: 28, isActive: false }
    ];

    // 1. Используйте forEach для вывода всех чисел больше 50
    console.log("Числа больше 50:");
    numbers.forEach(num => {
        if (num > 50) console.log(num);
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(num => num * num);
    console.log("Квадраты:", squares);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);
    console.log("Активные:", activeUsers.map(u => u.name));

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");
    console.log("Найдена:", victoria);

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("Сумма:", sum);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log("По возрасту (убыв.):", sortedByAge.map(u => `${u.name}: ${u.age}`));

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);
    console.log("Все старше 18:", allAdults);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();
    console.log("Активные по алфавиту:", activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        // 5.1 Добавление задачи
        const newId = this.tasks.length > 0
            ? Math.max(...this.tasks.map(t => t.id)) + 1
            : 1;
        this.tasks.push({ id: newId, title, completed: false, priority });
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
        }
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        this.tasks = this.tasks.filter(t => t.id !== taskId);
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : (completed / total) * 100;
        return { total, completed, pending, completionRate };
    }
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
            console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`);
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            return new Date().getFullYear() - this.year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            if (newYear > new Date().getFullYear()) {
                throw new Error("Год выпуска не может быть больше текущего");
            }
            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.age - vehicle2.age);
        }

        // 6.4 Статические методы и свойства
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        // (добавьте в конструктор: Vehicle.vehicleCount++;)
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
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
        return new vehicleType(make, model, year);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
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

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Задание 1
    console.log("\n--- Задание 1: Базовые операции ---");
    simpleTask();

    // Тест 1: getReviewerNumber
    console.log("\n--- Задание 2: Функции ---");
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(20, 1) === 21, "Ревьювер для студента 20 лаба 1 должен быть 21");
    console.assert(getReviewerNumber(29, 1) === 1, "При переполнении должен быть 1");
    console.log("getReviewerNumber: ок");

    console.assert(getVariant(20, 4) === 4, "Вариант для студента 20 при 4 вариантах должен быть 4");
    console.assert(getVariant(1, 4) === 1, "Вариант для студента 1 при 4 вариантах должен быть 1");
    console.log("getVariant: ок");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора + провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест калькулятора - провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест калькулятора * провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора / провален");
    console.assert(calculate(10, 0, '/') === "Ошибка: деление на ноль", "Тест деления на ноль провален");
    console.log("calculate: ок");

    // Тест calculateArea
    console.assert(Math.abs(calculateArea('circle', 5) - Math.PI * 25) < 0.001, "Тест площади круга провален");
    console.assert(calculateArea('rectangle', 4, 6) === 24, "Тест площади прямоугольника провален");
    console.assert(calculateArea('triangle', 10, 5) === 25, "Тест площади треугольника провален");
    console.log("calculateArea: ок");

    // Тест стрелочных функций
    console.assert(reverseString("hello") === "olleh", "Тест реверса строки провален");
    console.assert(reverseString("") === "", "Тест реверса пустой строки провален");
    console.log("reverseString: ок");

    const rnd = getRandomNumber(1, 10);
    console.assert(rnd >= 1 && rnd <= 10, "Тест случайного числа провален");
    console.log("getRandomNumber: ок");

    // Тест 3: Объекты
    console.log("\n--- Задание 3: Объекты ---");
    console.log("book.getInfo():", book.getInfo());
    console.assert(book.toggleAvailability() === false, "toggleAvailability: первый вызов должен дать false");
    console.assert(book.toggleAvailability() === true, "toggleAvailability: второй вызов должен дать true");
    console.log("book: ок");

    console.assert(student.getAverageGrade() === 90, "Средний балл должен быть 90");
    student.addGrade("physics", 100);
    console.assert(student.grades.physics === 100, "Оценка по физике должна быть 100");
    console.log("student: ок");

    // Задание 4
    console.log("\n--- Задание 4: Массивы ---");
    processArrays();

    // Тест 3: taskManager
    console.log("\n--- Задание 5: Менеджер задач ---");
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    taskManager.addTask("Тестовая задача", "low");
    console.assert(taskManager.getStats().total === 4, "После добавления должно быть 4 задачи");
    taskManager.completeTask(1);
    console.assert(taskManager.tasks.find(t => t.id === 1).completed === true, "Задача 1 должна быть выполнена");
    console.assert(taskManager.getTasksByStatus(true).length === 2, "Выполненных задач должно быть 2");
    taskManager.deleteTask(4);
    console.assert(taskManager.getStats().total === 3, "После удаления должно быть 3 задачи");
    console.log("taskManager: ок");

    // Тест 4: классы и наследование
    console.log("\n--- Задание 6: Классы и наследование ---");
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();

    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);

    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');

    console.log("Разница в возрасте Toyota и Test:", Vehicle.compareAge(vehicle, testVehicle));

    // Задание 7
    console.log("\n--- Задание 7: Каррирование ---");
    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    // Задание 8: тесты для варианта 4 (validateDate)
    console.log("\n--- Задание 8: Regex — вариант 4 (дата DD.MM.YYYY) ---");

    // Валидные даты
    console.assert(validateDate("15.09.2026") === true, "Обычная дата должна быть валидной");
    console.assert(validateDate("01.01.1900") === true, "Начало диапазона годов (1900) валидно");
    console.assert(validateDate("31.12.2099") === true, "Конец диапазона годов (2099) валиден");
    console.assert(validateDate("01.01.2000") === true, "Первый день 2000 года валиден");
    console.assert(validateDate("28.02.2024") === true, "28 февраля валидно");

    // Граничные значения дней
    console.assert(validateDate("00.01.2020") === false, "День 00 невалиден");
    console.assert(validateDate("32.01.2020") === false, "День 32 невалиден");

    // Граничные значения месяцев
    console.assert(validateDate("15.00.2020") === false, "Месяц 00 невалиден");
    console.assert(validateDate("15.13.2020") === false, "Месяц 13 невалиден");

    // Год вне диапазона
    console.assert(validateDate("15.09.1899") === false, "Год 1899 вне диапазона");
    console.assert(validateDate("15.09.2100") === false, "Год 2100 вне диапазона");

    // Неправильные разделители
    console.assert(validateDate("15/09/2026") === false, "Слеш вместо точки невалиден");
    console.assert(validateDate("15-09-2026") === false, "Дефис вместо точки невалиден");

    // Некорректный формат
    console.assert(validateDate("") === false, "Пустая строка невалидна");
    console.assert(validateDate("1.9.2026") === false, "Без ведущих нулей невалидно");
    console.assert(validateDate("абв.гд.ежзи") === false, "Кириллица невалидна");
    console.assert(validateDate("15.09.26") === false, "Двузначный год невалиден");

    console.log("validateDate: все тесты пройдены ✅");

    console.log("\n=== Все тесты пройдены! ✅ ===");
}

// Запуск тестов
runTests();
