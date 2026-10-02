'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    let p1 = 1;
    let p2 = "Дима";
    let p3 = null;
    let p4 = undefined;
    const p5 = 3;

    console.log(p1, p2, p3, p4)

}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    return ((number + lab - 1) % 30) + 1;
}

function getVariant(number, variants) {
    return number % variants;
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
                return console.log("Делить нельзя на ноль")
                break;
            }
            return a / b;
        default:
            console.log("Нет такой операции");
    }
}

function calculateArea(figure, ...params) {
    switch (figure) {
        case 'circle':
            return Math.PI * Math.pow(params[0], 2);
        case 'rectangle':
            return params[0] * params[1];
        case 'triangle':
            return params[0] * params[1];
        default:
            console.log("Нет такой фигуры")

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
        const sum = values.reduce((acc, val) => acc + val, 0);
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
    numbers.forEach(element => {
        if (element > 50) {
            console.log(element);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(num => num ** 2);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((sum, num) => sum + num, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = users.sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age >= 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
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

    // Удаление задачи
    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const deletedTask = this.tasks.splice(index, 1)[0];
            return deletedTask;
        }
        return null;
    },

    // Получение списка задач по статусу
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
            completionRate: Math.round(completionRate * 100) / 100 // округление до 2 знаков
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
            return new Date().getFullYear() - this._year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
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

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.age - vehicle2.age);
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

    // getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // getVariant
    console.assert(getVariant(5, 10) === 5, "getVariant: обычный случай");

    // calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест калькулятора (-) провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест калькулятора (*) провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора (/) провален");

    // calculateArea
    console.assert(calculateArea("rectangle", 5, 3) === 15, "Тест площади прямоугольника провален");

    // reverseString
    console.assert(reverseString("hello") === "olleh", "reverseString провален");

    // getRandomNumber
    console.log(`Рандомное число: ${getRandomNumber(1, 100)}`);
    console.log();

    // book
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

    const newAvg = student.getAverageGrade();
    console.assert(newAvg === 89.5, `student.getAverageGrade после добавления: ожидалось 89.5, получено ${newAvg}`);

    student.addGrade("physics", 92);
    console.assert(Object.keys(student.grades).length === 5, "student: должно быть 5 предметов");

    // tasks
    const initialStats = taskManager.getStats();
    console.assert(initialStats.total === 3, "taskManager: изначально 3 задачи");
    console.assert(initialStats.completed === 1, "taskManager: 1 выполненная задача");
    console.assert(initialStats.pending === 2, "taskManager: 2 незавершенных задачи");
    console.assert(Math.abs(initialStats.completionRate - 33.33) < 0.01,
        `taskManager: completionRate ~33.33%, получено ${initialStats.completionRate}%`);

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

    // Vehicle
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