'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    const name = 'Анна';
    const age = 20;
    const isStudent = true;
    const score = null;
    let city;
    const subjects = ['математика', 'JavaScript'];
    [name, age, isStudent, score, city, subjects].forEach((value) => {
        console.log(typeof value);
    });
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    const studentCount = 30;
    return (number + lab) % studentCount || studentCount;
}

function getVariant(number, variants) {
    if (!Number.isInteger(number) || !Number.isInteger(variants) || variants < 1) {
        throw new RangeError('Номер студента и число вариантов должны быть целыми, число вариантов — положительным');
    }
    return ((number - 1) % variants) + 1;
}

function calculate(a, b, operation) {
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) throw new RangeError('Деление на ноль невозможно');
            return a / b;
        default: throw new TypeError(`Неизвестная операция: ${operation}`);
    }
}

function calculateArea(figure, ...params) {
    switch (figure) {
        case 'circle':
            if (params.length !== 1 || params[0] < 0) throw new RangeError('Для круга нужен неотрицательный радиус');
            return Math.PI * params[0] ** 2;
        case 'rectangle':
            if (params.length !== 2 || params.some((value) => value < 0)) throw new RangeError('Для прямоугольника нужны две неотрицательные стороны');
            return params[0] * params[1];
        case 'triangle':
            if (params.length !== 2 || params.some((value) => value < 0)) throw new RangeError('Для треугольника нужны основание и высота');
            return params[0] * params[1] / 2;
        default: throw new TypeError(`Неизвестная фигура: ${figure}`);
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    return Array.from(str).reverse().join('');
};

const getRandomNumber = (min, max) => {
    if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
        throw new RangeError('Ожидаются целые границы, где min не больше max');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    year: 1943,
    pages: 96,
    available: true,
    getInfo() {
        return `«${this.title}», автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
    },
    toggleAvailability() {
        this.available = !this.available;
        return this.available;
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
        return values.length ? values.reduce((sum, grade) => sum + grade, 0) / values.length : 0;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        if (typeof subject !== 'string' || !subject.trim() || !Number.isFinite(grade) || grade < 0 || grade > 100) {
            throw new TypeError('Укажите предмет и оценку от 0 до 100');
        }
        this.grades[subject] = grade;
        return this.grades[subject];
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
    numbers.forEach((number) => { if (number > 50) console.log(number); });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map((number) => number ** 2);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter((user) => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find((user) => user.name === 'Виктория');

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((total, number) => total + number, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every((user) => user.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users.filter((user) => user.isActive).map((user) => user.name).sort((a, b) => a.localeCompare(b, 'ru'));
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
        if (typeof title !== 'string' || !title.trim()) throw new TypeError('Название задачи не должно быть пустым');
        const nextId = this.tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
        const task = { id: nextId, title: title.trim(), completed: false, priority };
        this.tasks.push(task);
        return task;
    },

    completeTask(taskId) {
        const task = this.tasks.find(({ id }) => id === taskId);
        if (!task) return false;
        task.completed = true;
        return true;
    },

    // Удаление задачи
    deleteTask(taskId) {
        const index = this.tasks.findIndex(({ id }) => id === taskId);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
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
        return {
            total,
            completed,
            pending: total - completed,
            completionRate: total ? completed / total * 100 : 0
        };
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
            if (!Number.isInteger(newYear) || newYear > new Date().getFullYear()) {
                throw new RangeError('Год выпуска должен быть целым и не больше текущего года');
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
            console.log('Beep beep!');
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

// Вариант студента 12: ((12 - 1) % 4) + 1 = 4, проверка даты DD.MM.YYYY.
function runRegexTests() {
    const cases = [
        ['01.01.1900', true],
        ['31.12.2099', true],
        ['29.02.2024', true],
        ['00.01.2000', false],
        ['32.01.2000', false],
        ['01.00.2000', false],
        ['01.13.2000', false],
        ['1.01.2000', false],
        ['01/01/2000', false],
        ['01.01.1899', false],
        ['01.01.2100', false],
        ['31.02.2024', true] // Regex валидирует формат и диапазоны полей, но не календарную дату.
    ];
    cases.forEach(([value, expected]) => {
        console.assert(validateDate(value) === expected, `Ошибка проверки даты: ${value}`);
    });
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(12, 1) === 13, "Тест ревьюера студента 12 провален");
    console.assert(getVariant(12, 4) === 4, "Тест определения варианта провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, '-') === 5 && calculate(10, 5, '*') === 50 && calculate(10, 5, '/') === 2, "Тесты операций калькулятора провалены");
    console.assert(calculateArea('circle', 2) === Math.PI * 4 && calculateArea('rectangle', 3, 4) === 12 && calculateArea('triangle', 3, 4) === 6, "Тест площади провален");
    console.assert(reverseString('JavaScript') === 'tpircSavaJ', "Тест разворота строки провален");
    console.assert(Number.isInteger(getRandomNumber(2, 2)) && getRandomNumber(2, 2) === 2, "Тест случайного числа провален");
    console.assert(book.getInfo().includes(book.title) && book.toggleAvailability() === false, "Тест книги провален");
    console.assert(student.getAverageGrade() === 90 && student.addGrade('physics', 80) === 80, "Тест методов студента провален");
    console.assert(processArrays().sum === 458, "Тест обработки массивов провален");

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
    console.assert(Vehicle.compareAge(vehicle, testVehicle) === -5, 'Тест сравнения возраста провален');

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    taskManager.addTask('Проверить работу', 'low');
    console.assert(taskManager.completeTask(4) && taskManager.getStats().completed === 2, 'Тест завершения задачи провален');
    console.assert(taskManager.getTasksByStatus(false).length === 2 && taskManager.deleteTask(4), 'Тест списка/удаления задач провален');
    runRegexTests();

    // Добавьте остальные тесты...

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();
