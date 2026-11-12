'use strict';

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    const str = "Karim";
    let num = 56;
    const bool = true;
    let empty = null;
    const obj = { key: "value" };

    console.log(typeof str);
    console.log(typeof num);
    console.log(typeof bool);
    console.log(typeof empty);
    console.log(typeof obj);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    return (number + lab) % 30;
}

function getVariant(number, variants) {
    return number % variants;
}

function calculate(a, b, operation) {
    switch (operation) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b !== 0 ? a / b : "Нельзя делить на ноль";
        default: return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    switch (figure) {
        case 'circle': return Math.PI * params[0] ** 2;
        case 'rectangle': return params[0] * params[1];
        case 'triangle': return 0.5 * params[0] * params[1];
        default: return 'Неизвестная фигура';
    }
}

const reverseString = (str) => {
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: "Моя книга",
    author: "Карим",
    year: 2026,
    pages: 56,
    isAvailable: true,

    getInfo() {
        return `${this.title}, ${this.author}, ${this.year} г., ${this.pages} стр.`;
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
        return values.reduce((sum, grade) => sum + grade, 0) / values.length;
    },

    addGrade(subject, grade) {
        this.grades[subject] = grade;
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

    console.log("Числа больше 50:");
    numbers.forEach(n => { if (n > 50) console.log(n); });

    const squares = numbers.map(n => n * n);
    const activeUsers = users.filter(u => u.isActive);
    const victoria = users.find(u => u.name === "Виктория");
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    const allAdults = users.every(u => u.age > 18);
    
    const activeUserNames = users
        .filter(u => u.isActive)
        .map(u => u.name)
        .sort();
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        this.tasks.push({ id: newId, title, completed: false, priority });
    },

    completeTask(taskId) {
        // ИСПРАВЛЕНО: было task.Id
        const task = this.tasks.find(t => t.id === taskId);
        if (task) task.completed = true;
    },

    deleteTask(taskId) {
        // ИСПРАВЛЕНО: было task.Id
        this.tasks = this.tasks.filter(t => t.id !== taskId);
    },

    getTasksByStatus(completed) {
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;
        return { total, completed, pending, completionRate };
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
            return new Date().getFullYear() - this.year;
        }

        set year(newYear) {
            if (newYear <= new Date().getFullYear()) {
                this._year = newYear;
            } else {
                console.error("Год не может быть больше текущего");
            }
        }

        get year() {
            return this._year;
        }

        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.age - vehicle2.age);
        }

        // ИСПРАВЛЕНО: добавлен отсутствующий метод
        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    class Car extends Vehicle {
        // ИСПРАВЛЕНО: добавлено значение по умолчанию, чтобы фабрика не ломалась
        constructor(make, model, year, numDoors = 4) {
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

    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        return new vehicleType(make, model, year);
    };

    return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====
function validatePassword(password) {
    if (typeof password !== 'string') return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    return passwordRegex.test(password);
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getVariant(6, 4) === 2, "Тест getVariant провален");
    
    console.assert(calculate(10, 5, '-') === 5, "Тест calculate - провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест calculate * провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест calculate / провален");
    console.assert(calculate(10, 0, '/') === 'Нельзя делить на ноль', "Тест деления на 0 провален");
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    
    console.assert(calculateArea('circle', 5) === Math.PI * 25, "Тест circle провален");
    console.assert(calculateArea('rectangle', 4, 5) === 20, "Тест rectangle провален");
    console.assert(calculateArea('triangle', 4, 5) === 10, "Тест triangle провален");
    
    console.assert(reverseString("abc") === "cba", "Тест reverseString провален");
    const rnd = getRandomNumber(1, 10);
    console.assert(rnd >= 1 && rnd <= 10, "Тест getRandomNumber провален");

    console.assert(book.getInfo().includes(book.title), "Тест book.getInfo провален");
    const prevAvail = book.isAvailable;
    book.toggleAvailability();
    console.assert(book.isAvailable === !prevAvail, "Тест toggleAvailability провален");
    
    console.assert(student.getAverageGrade() === 90, "Тест getAverageGrade провален");
    student.addGrade("physics", 80);
    console.assert(student.grades.physics === 80, "Тест addGrade провален");
    
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    
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

    taskManager.addTask("Новая задача", "low");
    console.assert(taskManager.tasks.length === 4, "Тест addTask провален");
    
    taskManager.completeTask(1);
    console.assert(taskManager.tasks.find(t => t.id === 1).completed === true, "Тест completeTask провален");
    
    console.assert(taskManager.getTasksByStatus(true).length === 2, "Тест getTasksByStatus провален");
    
    taskManager.deleteTask(4);
    console.assert(taskManager.tasks.length === 3, "Тест deleteTask провален");

    const v1 = new Vehicle('A', 'B', 2020);
    const v2 = new Vehicle('C', 'D', 2015);
    console.assert(Vehicle.compareAge(v1, v2) === 5, "Тест compareAge провален");
    
    v1.year = 2022;
    console.assert(v1.year === 2022, "Тест сеттера year провален");
    v1.year = 2030; 
    console.assert(v1.year === 2022, "Тест сеттера year (будущий год) провален");

    console.assert(validatePassword("Password1!") === true, "Тест: валидный пароль");
    console.assert(validatePassword("Aa1!aaaa") === true, "Тест: минимальная длина (ровно 8)");
    console.assert(validatePassword("password1!") === false, "Тест: нет заглавной буквы");
    console.assert(validatePassword("PASSWORD1!") === false, "Тест: нет строчной буквы");
    console.assert(validatePassword("Password!") === false, "Тест: нет цифры");
    console.assert(validatePassword("Password1") === false, "Тест: нет спецсимвола");
    console.assert(validatePassword("Aa1!aaa") === false, "Тест: меньше 8 символов");
    console.assert(validatePassword("") === false, "Тест: пустая строка");

    console.log("Все тесты пройдены!");
}

runTests();