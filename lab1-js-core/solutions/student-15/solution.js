'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const name = "Иван";
    const age = 25;
    const isStudent = true;
    const weight = 70.5;
    const hobbies = ["спорт", "музыка"];
    const nothing = null;
    let undefinedVar;

    // 1.2 Выведите типы всех переменных
    console.log("name:", typeof name);
    console.log("age:", typeof age);
    console.log("isStudent:", typeof isStudent);
    console.log("weight:", typeof weight);
    console.log("hobbies:", typeof hobbies);
    console.log("nothing:", typeof nothing);
    console.log("undefinedVar:", typeof undefinedVar);
}

// ===== ЗАДАНИЕ 2: Функции =====

const REVIEWERS_COUNT = 30; // общее количество ревьюеров

function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы
    // по вашему номеру и номеру лабораторной работы.
    // Скобки обязательны: сначала сумма, потом остаток.
    // Сдвиг -1 / +1 сохраняет нумерацию 1..REVIEWERS_COUNT.
    return ((number + lab - 1) % REVIEWERS_COUNT) + 1;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов.
    // Даёт диапазон 1..variants и корректно обрабатывает кратные номера.
    return ((number - 1) % variants) + 1;
}

function calculate(a, b, operation) {
    // 2.3 Калькулятор: +, -, *, /
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) return 'Ошибка: деление на ноль';
            return a / b;
        default:
            return 'Ошибка: неверная операция';
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Площадь фигур 'circle', 'rectangle', 'triangle'
    switch (figure) {
        case 'circle': {
            const [radius] = params;
            return Math.PI * radius * radius;
        }
        case 'rectangle': {
            const [width, height] = params;
            return width * height;
        }
        case 'triangle': {
            const [base, height] = params;
            return 0.5 * base * height;
        }
        default:
            return 'Ошибка: неизвестная фигура';
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => str.split('').reverse().join('');

const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Объект "книга"
    title: "JavaScript для профессионалов",
    author: "Джон Резиг",
    year: 2020,
    pages: 450,
    isAvailable: true,

    getInfo() {
        return `"${this.title}" — автор: ${this.author}, год выпуска: ${this.year}, страниц: ${this.pages}`;
    },

    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
};

const student = {
    name: "Анна Петрова",
    age: 20,
    course: 2,
    grades: {
        math: 90,
        programming: 95,
        history: 85
    },

    getAverageGrade() {
        const values = Object.values(this.grades);
        if (values.length === 0) return 0;
        return values.reduce((acc, g) => acc + g, 0) / values.length;
    },

    addGrade(subject, grade) {
        // 1. Проверка subject: должно быть непустой строкой
        if (typeof subject !== 'string' || subject.trim() === '') {
            console.warn('addGrade: название предмета не может быть пустым');
            return false;
        }

        // 2. Проверка grade: должно быть числом
        if (typeof grade !== 'number' || !Number.isFinite(grade)) {
            console.warn('addGrade: оценка должна быть числом');
            return false;
        }

        // 3. Проверка grade: целое число (если оценки целые)
        if (!Number.isInteger(grade)) {
            console.warn('addGrade: оценка должна быть целым числом');
            return false;
        }

        // 4. Проверка grade: не отрицательное и не больше 100
        if (grade < 0 || grade > 100) {
            console.warn('addGrade: оценка должна быть в диапазоне 0..100');
            return false;
        }

        // Всё ок — добавляем
        this.grades[subject.trim()] = grade;
        return true;
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
    const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
    const users = [
        { id: 1, name: "Анна", age: 25, isActive: true },
        { id: 2, name: "Борис", age: 30, isActive: false },
        { id: 3, name: "Виктория", age: 22, isActive: true },
        { id: 4, name: "Григорий", age: 35, isActive: true },
        { id: 5, name: "Дарья", age: 28, isActive: false }
    ];

    // 1. Числа больше 50
    console.log("Числа больше 50:");
    numbers.forEach(n => { if (n > 50) console.log(n); });

    // 2. Квадраты чисел
    const squares = numbers.map(n => n * n);

    // 3. Активные пользователи
    const activeUsers = users.filter(u => u.isActive);

    // 4. Поиск "Виктория"
    const victoria = users.find(u => u.name === "Виктория");

    // 5. Сумма всех чисел
    const sum = numbers.reduce((acc, n) => acc + n, 0);

    // 6. Сортировка по возрасту (убывание)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Все старше 18
    const allAdults = users.every(u => u.age > 18);

    // 8. Цепочка: активные → имена → сортировка
    const activeUserNames = users
        .filter(u => u.isActive)
        .map(u => u.name)
        .sort((a, b) => a.localeCompare(b));

    return { squares, activeUsers, victoria, sum, sortedByAge, allAdults, activeUserNames };
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
        const maxId = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) : 0;
        const newTask = { id: maxId + 1, title, completed: false, priority };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) { task.completed = true; return true; }
        return false;
    },

    deleteTask(taskId) {
        // 5.3 Удаление задачи
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) return this.tasks.splice(index, 1)[0];
        return null;
    },

    getTasksByStatus(completed) {
        // 5.4 Фильтрация по статусу
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
        // 5.5 Статистика
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;
        return { total, completed, pending, completionRate };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    class Vehicle {
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year; // через сеттер
            Vehicle.vehicleCount++;
        }

        displayInfo() {
            console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`);
        }

        get age() {
            return new Date().getFullYear() - this._year;
        }

        set year(newYear) {
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                throw new Error(`Год выпуска не может быть больше текущего (${currentYear})`);
            }
            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        static compareAge(v1, v2) {
            return Math.abs(v1.age - v2.age);
        }

        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    // 6.2 Класс Car
    class Car extends Vehicle {
        constructor(make, model, year, numDoors) {
            super(make, model, year);
            this.numDoors = numDoors;
        }

        displayInfo() {
            super.displayInfo();
            console.log(`Количество дверей: ${this.numDoors}`);
        }

        honk() {
            console.log("Beep beep!");
        }
    }

    // 6.3 Класс ElectricCar
    class ElectricCar extends Car {
        constructor(make, model, year, numDoors, batteryCapacity) {
            super(make, model, year, numDoors);
            this.batteryCapacity = batteryCapacity;
        }

        displayInfo() {
            super.displayInfo();
            console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
        }

        calculateRange() {
            // 1 кВт·ч = 6 км
            return this.batteryCapacity * 6;
        }
    }

    // ===== ЗАДАНИЕ 7: Каррирование =====
    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        return new vehicleType(make, model, year, 4);
    };

    return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====

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
 * - +7 999 123 45 67
 * - 8-999-123-45-67
 */
function validatePhone(phone) {
    const phoneRegex = /^(?:\+7|8)[\s-]?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
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

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===\n");

    // ----- Параметры студента -----
    const MY_NUMBER = 15;      // номер студента
    const MY_LAB = 1;          // номер лабораторной
    const VARIANTS = 4;        // количество вариантов

    // ----- Задание 1 -----
    console.log("--- Задание 1: simpleTask ---");
    simpleTask();

    // ----- Задание 2 -----
    console.log("\n--- Задание 2: функции ---");

    // getReviewerNumber: проверяем границы и кратность
    console.log(`Ревьюер для number=${MY_NUMBER}, lab=${MY_LAB}:`,
        getReviewerNumber(MY_NUMBER, MY_LAB)); // ожидаем 16
    console.assert(getReviewerNumber(MY_NUMBER, MY_LAB) === 16,
        "getReviewerNumber(15,1) должен быть 16");
    console.assert(getReviewerNumber(15, 15) === 30,
        "Сумма, кратная 30, должна давать 30, а не 0");
    console.assert(getReviewerNumber(1, 1) === 2,
        "Минимальные значения");
    console.assert(getReviewerNumber(30, 30) === 30,
        "Максимальные значения");

    // getVariant: ваш случай + кратные
    console.log(`Вариант для number=${MY_NUMBER}, variants=${VARIANTS}:`,
        getVariant(MY_NUMBER, VARIANTS)); // ожидаем 3
    console.assert(getVariant(MY_NUMBER, VARIANTS) === 3,
        "getVariant(15,4) должен быть 3");
    console.assert(getVariant(16, VARIANTS) === 4,
        "getVariant(16,4) должен быть 4, а не 0");
    console.assert(getVariant(20, 10) === 10,
        "Кратный номер даёт последний вариант");

    // calculate
    console.assert(calculate(10, 5, '+') === 15, "+");
    console.assert(calculate(10, 5, '-') === 5, "-");
    console.assert(calculate(10, 5, '*') === 50, "*");
    console.assert(calculate(10, 5, '/') === 2, "/");
    console.assert(calculate(10, 0, '/') === 'Ошибка: деление на ноль', "деление на 0");
    console.assert(calculate(10, 5, '%') === 'Ошибка: неверная операция', "неизвестная операция");

    // calculateArea
    console.assert(Math.abs(calculateArea('circle', 5) - 78.54) < 0.01, "площадь круга");
    console.assert(calculateArea('rectangle', 4, 6) === 24, "площадь прямоугольника");
    console.assert(calculateArea('triangle', 10, 5) === 25, "площадь треугольника");
    console.assert(calculateArea('square', 5) === 'Ошибка: неизвестная фигура', "неизвестная фигура");

    // Стрелочные функции
    console.assert(reverseString('JavaScript') === 'tpircSavaJ', "reverseString");
    const rnd = getRandomNumber(1, 10);
    console.assert(rnd >= 1 && rnd <= 10, "getRandomNumber в диапазоне");
    console.log("Случайное число [1,10]:", rnd);

    // ----- Задание 3 -----
    console.log("\n--- Задание 3: объекты ---");
    console.log(book.getInfo());
    console.assert(book.toggleAvailability() === false, "toggleAvailability → false");
    console.assert(book.toggleAvailability() === true, "toggleAvailability → true");
    console.assert(book.isAvailable === true, "вернулось в true");

    console.log("Средний балл:", student.getAverageGrade());
    console.assert(student.getAverageGrade() === 90, "средний балл Анны = 90");
    student.addGrade('physics', 80);
    console.assert(student.grades.physics === 80, "новая оценка добавлена");
    console.assert(student.getAverageGrade() === 87.5, "средний балл после добавления");
    delete student.grades.physics; // откат, чтобы не влиять на другие тесты

    // ----- Задание 4 -----
    console.log("\n--- Задание 4: массивы ---");
    const arrResult = processArrays();
    console.assert(arrResult.sum === 458, "сумма чисел");
    console.assert(arrResult.allAdults === true, "все старше 18");
    console.assert(arrResult.victoria.name === "Виктория", "найдена Виктория");
    console.assert(arrResult.activeUsers.length === 3, "3 активных пользователя");
    console.assert(arrResult.sortedByAge[0].name === "Григорий", "старший — Григорий");
    console.assert(
        JSON.stringify(arrResult.activeUserNames) === JSON.stringify(["Анна", "Виктория", "Григорий"]),
        "имена активных по алфавиту"
    );

    // ----- Задание 5 -----
    console.log("\n--- Задание 5: taskManager ---");
    console.assert(taskManager.getStats().total === 3, "изначально 3 задачи");
    console.assert(taskManager.getStats().completed === 1, "1 выполнена");

    const t = taskManager.addTask("Новая задача", "low");
    console.assert(t.id === 4 && t.priority === "low", "добавление задачи");
    console.assert(taskManager.getStats().total === 4, "стало 4 задачи");

    console.assert(taskManager.completeTask(1) === true, "выполнение задачи 1");
    console.assert(taskManager.getTasksByStatus(false).length === 2, "2 невыполненные");

    const del = taskManager.deleteTask(3);
    console.assert(del && del.id === 3, "удаление задачи 3");
    console.assert(taskManager.deleteTask(999) === null, "удаление несуществующей");

    const stats = taskManager.getStats();
    console.assert(stats.total === 3 && stats.completed === 2, "финальная статистика");
    console.log("Статистика:", stats);

    // ----- Задание 6 -----
    console.log("\n--- Задание 6: классы ---");
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();

    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.assert(vehicle.age === new Date().getFullYear() - 2015, "возраст Vehicle");

    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();
    console.assert(car.numDoors === 4, "numDoors");

    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.assert(electricCar.calculateRange() === 450, "запас хода 75*6=450");

    // Сеттер year с проверкой
    let threw = false;
    try { new Vehicle('Future', 'X', 2050); } catch (e) { threw = true; }
    console.assert(threw === true, "сеттер year отклонил будущий год");

    // Статические методы
    const v1 = new Vehicle('A', 'B', 2010);
    const v2 = new Vehicle('C', 'D', 2020);
    console.assert(Vehicle.compareAge(v1, v2) === 10, "compareAge");

    // ----- Задание 7: каррирование -----
    console.log("\n--- Задание 7: каррирование ---");
    const createCarFactory = createVehicleFactory(Car);
    const bmw = createCarFactory('BMW', 'X5', 2022);
    bmw.displayInfo();
    console.assert(bmw instanceof Car, "созданный объект — экземпляр Car");

    console.log("Всего создано транспортных средств:", Vehicle.getTotalVehicles());

    // ----- Задание 8 -----
    console.log("\n--- Задание 8: регулярные выражения ---");

    function testValidatePhone() {
        console.log("=== Тестирование validatePhone ===");

        // --- Валидные номера ---
        const validPhones = [
            '+7 (999) 123-45-67',   // классический формат с +7 и скобками
            '8 (999) 123-45-67',    // классический формат с 8 и скобками
            '89991234567',          // слитный формат с 8
            '+79991234567',         // слитный формат с +7
            '+7(999)123-45-67',     // без пробела после +7
            '8(999)1234567',        // без пробелов с 8
            '+7 999 123 45 67',     // с пробелами
            '8-999-123-45-67',      // с дефисами
            '+7-999-123-45-67',     // с дефисами и +7
            '+7 (999) 123 45 67',   // смешанные разделители
            '8 999 1234567',        // пробел только в начале
        ];

        validPhones.forEach(phone => {
            console.assert(
                validatePhone(phone) === true,
                `ОШИБКА: номер "${phone}" должен быть валидным`
            );
        });
        console.log(`✅ Валидные номера (${validPhones.length} шт.) — все прошли`);

        // --- Невалидные номера ---
        const invalidPhones = [
            '9991234567',           // без +7 или 8
            '+7 999 123 45',        // не хватает цифр (только 5 групп)
            '+7 999 123 45 67 89',  // лишние цифры
            '+7 (999) 123-45-6',    // не хватает одной цифры
            '+7 (999) 123-45-678',  // лишняя цифра
            '7 999 123 45 67',      // начинается с 7 без +
            '+8 999 123 45 67',     // +8 (неверный код)
            '8 999 123 45 67 8',    // лишняя цифра в конце
            'abc 999 123 45 67',    // буквы
            '',                     // пустая строка
            '+7 999 123-45-6a',     // буква в конце
            '+7 (999 123-45-67',    // несбалансированная скобка
            '8) 999 (123-45-67',    // скобки не в том порядке
            '+7--999--123--45--67', // двойные дефисы
            '+7  999  123  45  67', // двойные пробелы
            '8 (999) 123-45-67 ',   // пробел в конце
            ' 8 (999) 123-45-67',   // пробел в начале
            '+7 (999) 123-45-67\n', // перенос строки в конце
        ];

        invalidPhones.forEach(phone => {
            console.assert(
                validatePhone(phone) === false,
                `ОШИБКА: номер "${phone}" должен быть невалидным`
            );
        });
        console.log(`✅ Невалидные номера (${invalidPhones.length} шт.) — все прошли`);

        console.log("=== Все тесты validatePhone пройдены! ✅ ===");
    }

    // Запуск тестов
    testValidatePhone();

    console.log("\nВсе тесты пройдены! ✅");
}

// Запуск тестов
runTests();