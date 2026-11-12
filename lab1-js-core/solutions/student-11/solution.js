'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    let a = 1;
    let b = "приветик";
    let c = true;
    let d;
    let e = null;
    console.log(typeof a);
    console.log(typeof b);
    console.log(typeof c);
    console.log(typeof d);
    console.log(typeof e);
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    return (number + lab) % 30;
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
}

function getVariant(number, variants) {
    if (number % variants === 0) {
        return number;
    }
    return number % variants;
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
}

function calculate(a, b, operation) {
    if (operation === "+") {
        return a + b;  
    } else if (operation === "-") {
        return a - b;
    } else if (operation === "*") {
        return a * b;
    } else if (operation === "/") {
        return a / b;
    }
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
}

function calculateArea(figure, ...params) {
    switch (figure) {
        case 'circle':
            return Math.PI * (params[0] ** 2);
        case 'rectangle':
            return params[0] * params[1];
        case 'triangle':
            return (params[0] * params[1]) / 2;
    }
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    return str.split('').reverse().join('');
    // Функция возвращает перевернутую строку
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    // Функция возвращает случайное число между min и max
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: "Повести Белкина",
    author: "Александр Сергеевич Пушкин",
    year: 2023,
    pages: 350,
    isAvailable: true,

    getInfo() {
        return `название: "${this.title}", автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
    },

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
        let sum = 0;
        let gradesArray = Object.values(this.grades);
        for (let i = 0; i < gradesArray.length; i++) {
            sum += gradesArray[i];
        }
        return sum / gradesArray.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
        return `оценка ${grade} по предмету ${subject} успешно добавлена!`;
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
        if (num > 50) {
            console.log(num);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(num => num ** 2);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");



    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age >= 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users.filter(user => user.isActive).map(user => user.name).sort();
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
        const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        this.tasks.push({ id: newId, title, priority, completed: false });
    },

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) task.completed = true;
        // 5.2 Отметка выполнения
    },

    // Удаление задачи
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        // 5.3 Ваш код здесь
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        return this.tasks.filter(t => t.completed === completed);
        // 5.4 Ваш код здесь
    },

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : completed / total;
        return { total, completed, pending, completionRate };
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    // В конструкторе принимайте и сохраняйте в this свойства:
    // make (марка), model (модель), year (год выпуска).
    class Vehicle {
        // 6.4 Статические методы и свойства
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        // (добавьте в конструктор: Vehicle.vehicleCount++;)
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this._year = year;
            Vehicle.vehicleCount++;
            // ..
        }

        // Добавьте метод displayInfo(), который выводит в консоль информацию
        // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
        displayInfo() {
            console.log(`марка: ${this.make}, модель: ${this.model}, год: ${this._year}`);
            // ..
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            return new Date().getFullYear() - this._year;
            // ..
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            if (newYear <= new Date().getFullYear()) {
                this._year = newYear;
            } else {
                console.log("ошибка: год не может быть больше текущего");
            }
            // ..
        }

        get year() {
            return this._year;
        }

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.age - vehicle2.age);
            // ..
        }

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
            // ..
        }

        // Переопределите метод displayInfo() так, чтобы он также выводил количество дверей.
        // Используйте super.displayInfo() для вызова метода родителя.
        displayInfo() {
            super.displayInfo();
            console.log(`двери: ${this.numDoors}`);
            // ..
        }

        // Добавьте метод honk(), который выводит "Beep beep!".
        honk() {
            console.log("beep beep!");
            // ..
        }
    }

    // 6.3 Класс ElectricCar (наследуется от Car)
    // Добавьте новое свойство batteryCapacity (емкость батареи в кВт·ч).
    class ElectricCar extends Car {
        constructor(make, model, year, numDoors, batteryCapacity) {
            super(make, model, year, numDoors);
            this.batteryCapacity = batteryCapacity;
            // ..
        }

        // Переопределите метод displayInfo() для вывода дополнительной информации о батарее.
        displayInfo() {
            super.displayInfo();
            console.log(`емкость батареи: ${this.batteryCapacity} квт·ч`);
            // ..
        }

        // Добавьте метод calculateRange(), который рассчитывает примерный запас хода
        // (предположим, что 1 кВт·ч = 6 км).
        calculateRange() {
            return this.batteryCapacity * 6;
            // ..
        }
    }

    // ===== ЗАДАНИЕ 7: Каррирование =====
    // Создайте функцию createVehicleFactory, которая возвращает функцию
    // для создания транспортных средств определенного типа (каррирование).
    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        return new vehicleType(make, model, year);
        // Замените {} на выражение
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
    const phoneRegex = /^(\+7|8)\s*\(?\d{3}\)?\s*\d{3}\s*-?\s*\d{2}\s*-?\s*\d{2}$/;
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
    console.assert(validatePhone("+7 (999) 123-45-67") === true, "ошибка: формат +7 с пробелами и скобками");
    
    // формат: 8 (999) 123-45-67
    console.assert(validatePhone("8 (999) 123-45-67") === true, "ошибка: формат 8 с пробелами и скобками");
    
    // формат: 89991234567 (компактный, без разделителей)
    console.assert(validatePhone("89991234567") === true, "ошибка: компактный формат без разделителей");
    
    // формат: +7(999)123-45-67 (смешанный, без пробелов)
    console.assert(validatePhone("+7(999)123-45-67") === true, "ошибка: смешанный формат без пробелов");
    
    // отсутствует код страны
    console.assert(validatePhone("9991234567") === false, "ошибка: пропущен код страны (+7 или 8)");
    
    // неверное количество цифр в группе
    console.assert(validatePhone("+7 (99) 123-45-67") === false, "ошибка: неверное количество цифр в коде оператора");
    
    // слишком длинный номер (лишние цифры в конце)
    console.assert(validatePhone("+7 (999) 123-45-678") === false, "ошибка: номер слишком длинный");
    
    // наличие букв вместо цифр
    console.assert(validatePhone("+7 (abc) 123-45-67") === false, "ошибка: буквы в коде оператора");
    
    // лишний пробел в конце строки (якорь $ должен это отловить)
    console.assert(validatePhone("+7 (999) 123-45-67 ") === false, "ошибка: лишний пробел в конце строки");


    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();