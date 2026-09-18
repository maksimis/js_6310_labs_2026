'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let userName = "Иван";              // string
    let userAge = 20;                   // number
    let isStudent = true;               // boolean
    let emptyValue = null;              // null
    let notAssigned;                      // undefined

    // 1.2 Выведите типы всех переменных
    console.log("userName:", typeof userName);       // string
    console.log("userAge:", typeof userAge);         // number
    console.log("isStudent:", typeof isStudent);     // boolean
    console.log("emptyValue:", typeof emptyValue);   // object 
    console.log("notAssigned:", typeof notAssigned); // undefined
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return(number + lab) % 30;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return((number - 1)%variants)+1
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

    title: "Город Костей",
    author: "Кассандра Клэр",
    year: 2007,
    pages: 544,
    isAvailable: true,

    getInfo() {
        return `${this.title}, ${this.author}, ${this.year}, ${this.pages} стр.`;
    },

    toggleAvailability() {
        return (this.isAvailable = !this.isAvailable);
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
        history: 85
    },

    // Метод для расчета среднего балла
    getAverageGrade() {
        const values = Object.values(this.grades);
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, grade) => acc + grade, 0);
        return sum / values.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
         this.grades[subject] = grade;
        return this.grades;
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
    const squares = numbers.map(num => num ** 2);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);

    // 8. Создайте цепочку методов
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort((a, b) => a.localeCompare(b));

}


// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    // 5.1 Добавление задачи
    addTask(title, priority = "medium") {
        const id = this.tasks.length > 0
            ? Math.max(...this.tasks.map(t => t.id)) + 1
            : 1;

        const newTask = {
            id: id,
            title: title,
            completed: false,
            priority: priority
        };

        this.tasks.push(newTask);
        return newTask;
    },

    // 5.2 Отметка выполнения
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return null;

        task.completed = true;
        return task;
    },

    // 5.3 Удаление задачи
    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index === -1) return false;

        this.tasks.splice(index, 1);
        return true;
    },

    // 5.4 Получение списка задач по статусу
    getTasksByStatus(completed) {
        return this.tasks.filter(t => t.completed === completed);
    },

    // 5.5 Статистика
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0
            ? (completed / total) * 100
            : 0;

        return {
            total,
            completed,
            pending,
            completionRate
        };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    // В конструкторе принимайте и сохраняйте в this свойства:
    // make (марка), model (модель), year (год выпуска).
    class Vehicle {
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
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
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
            return vehicle1.age - vehicle2.age;
        }

        // 6.4 Статические методы и свойства
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        // (добавьте в конструктор: Vehicle.vehicleCount++;)
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
        static vehicleCount = 0;

        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }



        // 6.2 Класс Car (наследуется от Vehicle)
    // Добавьте новое свойство numDoors (количество дверей).
    class Car extends Vehicle {
        constructor(make, model, year, numDoors) {
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
const createVehicleFactory = (VehicleClass) => (...params) => {
    return new VehicleClass(...params);
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

// ===== ОСНОВНАЯ ФУНКЦИЯ =====

function validateDate(date) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    return dateRegex.test(date);
}

// ===== ТЕСТЫ =====

const tests = [
    // ===== ВАЛИДНЫЕ ДАТЫ =====

    // День: все три альтернативы и границы
    { input: "01.01.2000", expected: true,  desc: "Минимальный день 01" },
    { input: "09.01.2000", expected: true,  desc: "Граница 1-й альтернативы 09" },
    { input: "10.01.2000", expected: true,  desc: "Начало 2-й альтернативы 10" },
    { input: "29.01.2000", expected: true,  desc: "Конец 2-й альтернативы 29" },
    { input: "30.01.2000", expected: true,  desc: "3-я альтернатива: 30" },
    { input: "31.01.2000", expected: true,  desc: "Максимальный день 31" },

    // Месяц: обе альтернативы и границы
    { input: "01.01.2000", expected: true,  desc: "Минимальный месяц 01" },
    { input: "01.09.2000", expected: true,  desc: "Граница 1-й альтернативы 09" },
    { input: "01.10.2000", expected: true,  desc: "Начало 2-й альтернативы 10" },
    { input: "01.12.2000", expected: true,  desc: "Максимальный месяц 12" },

    // Год: обе альтернативы и границы
    { input: "01.01.1900", expected: true,  desc: "Минимальный год 1900" },
    { input: "01.01.1999", expected: true,  desc: "Конец альтернативы 19" },
    { input: "01.01.2000", expected: true,  desc: "Начало альтернативы 20" },
    { input: "01.01.2099", expected: true,  desc: "Максимальный год 2099" },

    // ===== НЕВАЛИДНЫЕ ДАТЫ =====

    // День за границами
    { input: "00.01.2000", expected: false, desc: "День 00 — нет" },
    { input: "32.01.2000", expected: false, desc: "День 32 — нет" },
    { input: "99.01.2000", expected: false, desc: "День 99 — нет" },

    // Месяц за границами
    { input: "01.00.2000", expected: false, desc: "Месяц 00 — нет" },
    { input: "01.13.2000", expected: false, desc: "Месяц 13 — нет" },

    // Год за границами
    { input: "01.01.1899", expected: false, desc: "Год 1899 — раньше 1900" },
    { input: "01.01.2100", expected: false, desc: "Год 2100 — позже 2099" },

    // Неверный разделитель
    { input: "01-01-2000", expected: false, desc: "Дефис вместо точки" },
    { input: "01/01/2000", expected: false, desc: "Слэш вместо точки" },

    // Неверный формат
    { input: "1.1.2000",    expected: false, desc: "Однозначные день и месяц" },
    { input: "01.1.2000",   expected: false, desc: "Однозначный месяц" },
    { input: "1.01.2000",   expected: false, desc: "Однозначный день" },
    { input: "01.01.200",   expected: false, desc: "Год из 3 цифр" },
    { input: "01.01.20000", expected: false, desc: "Год из 5 цифр" },

    // Лишние символы
    { input: " 01.01.2000",   expected: false, desc: "Пробел в начале" },
    { input: "01.01.2000 ",   expected: false, desc: "Пробел в конце" },
    { input: "01.01.2000abc", expected: false, desc: "Мусор в конце" },
    { input: "abc01.01.2000", expected: false, desc: "Мусор в начале" },
    { input: "01.01.2000.01", expected: false, desc: "Лишняя часть" },

    // Пустая строка и текст
    { input: "",         expected: false, desc: "Пустая строка" },
    { input: "не дата",  expected: false, desc: "Текст" },
];

// ===== ЗАПУСК ТЕСТОВ =====

let passed = 0;
let failed = 0;

for (const { input, expected, desc } of tests) {
    const result = validateDate(input);
    const ok = result === expected;

    if (ok) {
        passed++;
        console.log(`[OK]   ${desc}: "${input}" -> ${result}`);
    } else {
        failed++;
        console.log(`[FAIL] ${desc}: "${input}" -> получено ${result}, ожидалось ${expected}`);
    }
}


// Бонус: выполните все остальные варианты. Выполнение бонуса не учитывается в итоговой оценке.

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");

    // Тест 4: классы и наследование
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

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    // Добавьте остальные тесты...

    // --- getReviewerNumber ---
    console.log("\n--- getReviewerNumber ---");
    console.assert(getReviewerNumber(30, 5) === 5, "getReviewerNumber(30, 5) должен быть 5 (зацикливание)");
    console.assert(getReviewerNumber(1, 1) === 2, "getReviewerNumber(1, 1) должен быть 2");

    // --- getVariant ---
    console.log("\n--- getVariant ---");
    console.assert(getVariant(4, 4) === 4, "getVariant(4, 4) должен быть 4");
    console.assert(getVariant(5, 4) === 1, "getVariant(5, 4) должен быть 1 (зацикливание)");
    console.assert(getVariant(1, 4) === 1, "getVariant(1, 4) должен быть 1");

    // --- calculate: все операции ---
    console.log("\n--- calculate ---");
    console.assert(calculate(10, 5, "-") === 5, "calculate - провален");
    console.assert(calculate(10, 5, "*") === 50, "calculate * провален");
    console.assert(calculate(10, 5, "/") === 2, "calculate / провален");

    try {
        calculate(10, 0, "/");
        console.assert(false, "calculate: деление на ноль должно бросать ошибку");
    } catch (e) {
        console.log("calculate: деление на ноль корректно отловлено");
    }

    try {
        calculate(10, 5, "%");
        console.assert(false, "calculate: неизвестная операция должна бросать ошибку");
    } catch (e) {
        console.log("calculate: неизвестная операция корректно отловлена");
    }

    // --- calculateArea ---
    console.log("\n--- calculateArea ---");
    console.assert(
        Math.abs(calculateArea("circle", 5) - Math.PI * 25) < 0.0001,
        "calculateArea circle провален"
    );
    console.assert(calculateArea("rectangle", 4, 6) === 24, "calculateArea rectangle провален");
    console.assert(calculateArea("triangle", 4, 6) === 12, "calculateArea triangle провален");

    try {
        calculateArea("square", 5);
        console.assert(false, "calculateArea: неизвестная фигура должна бросать ошибку");
    } catch (e) {
        console.log("calculateArea: неизвестная фигура корректно отловлена");
    }

    // --- reverseString, getRandomNumber ---
    console.log("\n--- reverseString, getRandomNumber ---");
    console.assert(reverseString("привет") === "тевирп", "reverseString провален");
    console.assert(reverseString("") === "", "reverseString пустой строки провален");
    console.assert(reverseString("a") === "a", "reverseString одного символа провален");

    const random = getRandomNumber(1, 10);
    console.assert(random >= 1 && random <= 10, "getRandomNumber вне диапазона");
    console.assert(Number.isInteger(random), "getRandomNumber должен быть целым");

    // --- book ---
    console.log("\n--- book ---");
    console.assert(typeof book.getInfo() === "string", "book.getInfo() должен возвращать строку");
    const initialAvail = book.isAvailable;
    const toggled = book.toggleAvailability();
    console.assert(toggled === !initialAvail, "book.toggleAvailability не переключил значение");
    console.assert(book.isAvailable === !initialAvail, "book.isAvailable не изменился");
    book.toggleAvailability(); // вернуть как было

    // --- student: getAverageGrade и addGrade ---
    console.log("\n--- student ---");
    console.assert(student.getAverageGrade() === 90, "student: начальный средний балл должен быть 90");

    // Добавление нового предмета
    student.addGrade("physics", 80);
    console.assert(student.grades.physics === 80, "student.addGrade не добавил новый предмет");
    console.assert(student.getAverageGrade() === 87.5, "student: средний после добавления должен быть 87.5");

    // Перезапись существующей оценки
    student.addGrade("math", 100);
    console.assert(student.grades.math === 100, "student.addGrade не перезаписал оценку");

    // --- taskManager: все методы ---
    console.log("\n--- taskManager ---");

    // getStats — все поля
    console.assert(taskManager.getStats().total === 3, "taskManager: total должен быть 3");
    console.assert(taskManager.getStats().completed === 1, "taskManager: completed должен быть 1");
    console.assert(taskManager.getStats().pending === 2, "taskManager: pending должен быть 2");

    // addTask
    const newTask = taskManager.addTask("Новая задача", "low");
    console.assert(newTask.id === 4, "addTask: id должен быть 4");
    console.assert(newTask.priority === "low", "addTask: приоритет не передан");
    console.assert(newTask.completed === false, "addTask: новая задача должна быть невыполнена");
    console.assert(taskManager.getStats().total === 4, "addTask: total должен стать 4");

    // addTask с приоритетом по умолчанию
    const defaultTask = taskManager.addTask("Без приоритета");
    console.assert(defaultTask.priority === "medium", "addTask: приоритет по умолчанию должен быть medium");

    // completeTask
    const completed = taskManager.completeTask(1);
    console.assert(completed !== null, "completeTask: задача 1 должна найтись");
    console.assert(completed.completed === true, "completeTask: задача 1 должна стать выполненной");

    // completeTask для несуществующей
    console.assert(taskManager.completeTask(999) === null, "completeTask: несуществующая задача должна вернуть null");

    // getTasksByStatus
    const pending = taskManager.getTasksByStatus(false);
    const done = taskManager.getTasksByStatus(true);
    console.assert(Array.isArray(pending), "getTasksByStatus должен вернуть массив");
    console.assert(pending.every(t => !t.completed), "getTasksByStatus(false) вернул выполненные");
    console.assert(done.every(t => t.completed), "getTasksByStatus(true) вернул невыполненные");

    // deleteTask
    const deleted = taskManager.deleteTask(2);
    console.assert(deleted === true, "deleteTask: должен вернуть true");
    console.assert(taskManager.tasks.find(t => t.id === 2) === undefined, "deleteTask: задача 2 не удалена");

    // deleteTask для несуществующей
    console.assert(taskManager.deleteTask(999) === false, "deleteTask: несуществующая должна вернуть false");

    // getStats — инвариант
    const stats = taskManager.getStats();
    console.log("Итоговая статистика:", stats);
    console.assert(stats.total === stats.completed + stats.pending, "getStats: total !== completed + pending");
    console.assert(stats.completionRate >= 0 && stats.completionRate <= 100, "getStats: completionRate вне диапазона");

    // --- Классы: сеттер года, compareAge, фабрика ---
    console.log("\n--- Дополнительно по классам ---");

    // Сеттер года
    try {
        new Vehicle("Future", "Model", 2050);
        console.assert(false, "Сеттер года должен был бросить ошибку для 2050");
    } catch (e) {
        console.log("Сеттер года корректно отклонил год из будущего");
    }

    // compareAge
    const older = new Vehicle("A", "B", 2010);
    const newer = new Vehicle("C", "D", 2020);
    console.assert(Vehicle.compareAge(older, newer) === 10, "compareAge неверный");

    // Фабрика с полным набором аргументов
    const createCar2 = createVehicleFactory(Car);
    const bmw = createCar2("BMW", "X5", 2022, 4);
    console.assert(bmw.numDoors === 4, "Фабрика не передала numDoors");

    // --- validateDate (ваш вариант) ---
    console.log("\n--- validateDate ---");
    console.assert(validateDate("01.01.2000") === true, "validateDate: валидная провалена");
    console.assert(validateDate("31.12.2099") === true, "validateDate: валидная граница провалена");
    console.assert(validateDate("00.01.2000") === false, "validateDate: день 00 провален");
    console.assert(validateDate("01.13.2000") === false, "validateDate: месяц 13 провален");
    console.assert(validateDate("01-01-2000") === false, "validateDate: дефис вместо точки провален");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();