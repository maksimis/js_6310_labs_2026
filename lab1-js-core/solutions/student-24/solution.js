'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    let p1 = 1;
    let p2 = "Дима";
    let p3 = null;
    let p4 = undefined;
    const p5 = true;

    
    console.log(typeof p1);
    console.log(typeof p2);
    console.log(typeof p3);
    console.log(typeof p4);
    console.log(typeof p5);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    return ((number + lab - 1) % 30) + 1;
}

function getVariant(number, variants) {
    
    const remainder = number % variants;
    return remainder === 0 ? variants : remainder;
}

function calculate(a, b, operation) {
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                return "Делить нельзя на ноль";
            }
            return a / b;
        default:
            return "Нет такой операции";
    }
}

function calculateArea(figure, ...params) {
    if (params.some(param => param < 0)) {
        return "Ошибка: значения не могут быть меньше 0";
    }

    switch (figure) {
        case 'circle':
            return Math.PI * Math.pow(params[0], 2);
        case 'rectangle':
            return params[0] * params[1];
        case 'triangle':
            return 0.5 * params[0] * params[1];
        default:
            return "Нет такой фигуры";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: "Человек паук",
    author: "Stan lee",
    year: 1990,
    pages: 480,
    isAvailable: true,

    getInfo() {
        return `"${this.title}", автор: ${this.author}, год выпуска: ${this.year}, страниц: ${this.pages}`;
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
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    },

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

    console.log("Числа больше 50:");
    numbers.forEach(element => {
        if (element > 50) {
            console.log(element);
        }
    });

    const squares = numbers.map(num => num ** 2);
    const activeUsers = users.filter(user => user.isActive);
    const victoria = users.find(user => user.name === "Виктория");
    const sum = numbers.reduce((sum, num) => sum + num, 0);
    const sortedByAge = users.sort((a, b) => b.age - a.age);
    const allAdults = users.every(user => user.age >= 18);
    

    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort((a, b) => a.localeCompare(b));

    console.log(squares);
    console.log(activeUsers);
    console.log(victoria);
    console.log(sum);
    console.log(sortedByAge);
    console.log(allAdults);
    console.log(activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        const newTask = {
            id: this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1,
            title: title,
            completed: false,
            priority: priority
        };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            return task;
        }
        return null;
    },

    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const deletedTask = this.tasks.splice(index, 1)[0];
            return deletedTask;
        }
        return null;
    },

    getTasksByStatus(completed) {
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        return {
            total,
            completed,
            pending,
            completionRate: Math.round(completionRate * 100) / 100
        };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    class Vehicle {
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year;
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
                throw new Error(`Год не может быть больше текущего (${currentYear})`);
            }
            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.age - vehicle2.age);
        }

        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

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
            return this.batteryCapacity * 6;
        }
    }

    const createVehicleFactory = (vehicleType) => {
        return (...args) => {
            return new vehicleType(...args);
        };
    };

    return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validateDate(date) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    return dateRegex.test(date);
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    simpleTask();
    processArrays();

    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getVariant(5, 10) === 5, "getVariant: обычный случай");
    console.assert(getVariant(30, 30) === 30, "getVariant: случай с остатком 0"); // Дополнительный тест

    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест калькулятора (-) провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест калькулятора (*) провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора (/) провален");
    console.assert(calculate(10, 0, '/') === "Делить нельзя на ноль", "Тест деления на ноль провален"); // Дополнительный тест

    console.assert(calculateArea("rectangle", 5, 3) === 15, "Тест площади прямоугольника провален");
    console.assert(calculateArea("triangle", 10, 4) === 20, "Тест площади треугольника провален"); // Дополнительный тест
    console.assert(calculateArea("circle", -5) === "Ошибка: значения не могут быть меньше 0", "Тест отрицательных значений провален"); // Дополнительный тест

    console.assert(reverseString("hello") === "olleh", "reverseString провален");
    console.log(`Рандомное число: ${getRandomNumber(1, 100)}`);
    console.log();

    const bookInfo = book.getInfo();
    console.assert(bookInfo.includes("Человек паук"), "book.getInfo должен содержать название");
    console.assert(bookInfo.includes("Stan lee"), "book.getInfo должен содержать автора");
    console.assert(book.isAvailable === true, "book изначально доступен");
    console.assert(book.toggleAvailability() === false, "book.toggleAvailability: first toggle");
    console.assert(book.isAvailable === false, "book.isAvailable после первого toggle");
    console.assert(book.toggleAvailability() === true, "book.toggleAvailability: second toggle");
    console.assert(book.isAvailable === true, "book.isAvailable после второго toggle");

    console.assert(student.getAverageGrade() === 90, "student.getAverageGrade провален");
    student.addGrade("english", 88);
    console.assert(student.grades.english === 88, "student.addGrade: новая оценка добавлена");
    console.assert(student.getAverageGrade() === 89.5, `student.getAverageGrade после добавления: ожидалось 89.5`);
    student.addGrade("physics", 92);
    console.assert(Object.keys(student.grades).length === 5, "student: должно быть 5 предметов");

    const initialStats = taskManager.getStats();
    console.assert(initialStats.total === 3, "taskManager: изначально 3 задачи");
    console.assert(initialStats.completed === 1, "taskManager: 1 выполненная задача");
    console.assert(initialStats.pending === 2, "taskManager: 2 незавершенных задачи");
    console.assert(Math.abs(initialStats.completionRate - 33.33) < 0.01, `taskManager: completionRate ~33.33%`);

    const newTask = taskManager.addTask("Написать тесты", "high");
    console.assert(newTask.title === "Написать тесты", "addTask: название сохранено");
    console.assert(newTask.completed === false, "addTask: задача не выполнена");
    console.assert(newTask.priority === "high", "addTask: приоритет сохранен");
    console.assert(taskManager.tasks.length === 4, "addTask: количество задач увеличено");

    const defaultTask = taskManager.addTask("Задача без приоритета");
    console.assert(defaultTask.priority === "medium", "addTask: дефолтный приоритет medium");

    const completedTask = taskManager.completeTask(1);
    console.assert(completedTask !== null, "completeTask: задача найдена");
    console.assert(completedTask.completed === true, "completeTask: задача отмечена выполненной");

    const notFoundTask = taskManager.completeTask(999);
    console.assert(notFoundTask === null, "completeTask: несуществующая задача возвращает null");

    const deletedTask = taskManager.deleteTask(2);
    console.assert(deletedTask !== null, "deleteTask: задача удалена");
    console.assert(deletedTask.id === 2, "deleteTask: правильный ID");
    console.assert(taskManager.tasks.length === 4, "deleteTask: количество задач уменьшено");

    const completedTasks = taskManager.getTasksByStatus(true);
    const pendingTasks = taskManager.getTasksByStatus(false);
    console.assert(completedTasks.length >= 1, "getTasksByStatus: есть выполненные задачи");
    console.assert(pendingTasks.length >= 1, "getTasksByStatus: есть невыполненные задачи");

    const updatedStats = taskManager.getStats();
    console.assert(updatedStats.total === 4, "getStats: обновленное количество задач");

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
    const myNewCar = createCarFactory('BMW', 'X5', 2022, 5);
    console.log('Создан новый автомобиль через фабрику:');
    myNewCar.displayInfo();
    console.assert(myNewCar.numDoors === 5, "Тест фабрики для Car (numDoors) провален");

    const createElectricCarFactory = createVehicleFactory(ElectricCar);
    const myNewElectricCar = createElectricCarFactory('Tesla', 'Model S', 2023, 4, 100);
    console.log('Создан новый электромобиль через фабрику:');
    myNewElectricCar.displayInfo();
    console.assert(myNewElectricCar.batteryCapacity === 100, "Тест фабрики для ElectricCar провален");

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    console.assert(validateDate("01.01.2000") === true, "validateDate: корректная дата 01.01.2000");
    console.assert(validateDate("15.06.1995") === true, "validateDate: корректная дата 15.06.1995");
    console.assert(validateDate("31.12.2023") === true, "validateDate: корректная дата 31.12.2023");
    console.assert(validateDate("29.02.2024") === true, "validateDate: корректная дата 29.02.2024 (високосный год, формат верный)");

    console.assert(validateDate("1.01.2000") === false, "validateDate: отсутствие ведущего нуля у дня (1.01.2000)");
    console.assert(validateDate("01.1.2000") === false, "validateDate: отсутствие ведущего нуля у месяца (01.1.2000)");
    console.assert(validateDate("01-01-2000") === false, "validateDate: неправильный разделитель (дефис)");
    console.assert(validateDate("01/01/2000") === false, "validateDate: неправильный разделитель (слэш)");
    console.assert(validateDate(" 01.01.2000") === false, "validateDate: лишний пробел в начале строки");
    console.assert(validateDate("01.01.2000 ") === false, "validateDate: лишний пробел в конце строки");
    console.assert(validateDate("01.01.200") === false, "validateDate: год состоит из 3 цифр");
    console.assert(validateDate("01.01.20000") === false, "validateDate: год состоит из 5 цифр");

    console.assert(validateDate("00.01.2000") === false, "validateDate: день 00 недопустим");
    console.assert(validateDate("32.01.2000") === false, "validateDate: день 32 недопустим");
    console.assert(validateDate("99.01.2000") === false, "validateDate: день 99 недопустим");
    console.assert(validateDate("01.00.2000") === false, "validateDate: месяц 00 недопустим");
    console.assert(validateDate("01.13.2000") === false, "validateDate: месяц 13 недопустим");
    console.assert(validateDate("01.01.1899") === false, "validateDate: год 1899 вне диапазона (19xx-20xx)");
    console.assert(validateDate("01.01.2100") === false, "validateDate: год 2100 вне диапазона (19xx-20xx)");

    console.assert(validateDate(null) === false, "validateDate: null должен возвращать false");
    console.assert(validateDate(undefined) === false, "validateDate: undefined должен возвращать false");
    console.assert(validateDate(12345) === false, "validateDate: число должно возвращать false");
    console.assert(validateDate({}) === false, "validateDate: объект должен возвращать false");
    console.assert(validateDate([]) === false, "validateDate: массив должен возвращать false");
    
    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();