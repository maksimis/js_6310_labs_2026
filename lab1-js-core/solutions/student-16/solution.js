'use strict';

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    console.log("\n=== ЗАДАНИЕ 1: Базовые операции ===");
    
    // 1.1 Объявите переменные разных типов (не менее 5)
    const stringVar = "Hello!";
    const numberVar = 25;
    const booleanVar = true;
    const nullVar = null;
    let undefinedVar;
    const objectVar = { name: "Test", value: 1000 };
    const arrayVar = [1, 2, 3, 4, 5];

    // 1.2 Выведите типы всех переменных
    console.log(`stringVar: ${typeof stringVar}`);
    console.log(`numberVar: ${typeof numberVar}`);
    console.log(`booleanVar: ${typeof booleanVar}`);
    console.log(`nullVar: ${typeof nullVar}`);
    console.log(`undefinedVar: ${typeof undefinedVar}`);
    console.log(`objectVar: ${typeof objectVar}`);
    console.log(`arrayVar: ${typeof arrayVar}`);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы
    let students = 30;
    let sum = number + lab;
    let rev = sum % students;
    if (rev === 0) {
        rev = students; 
    }
    return rev;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта
    return (number % variants) || variants;
}

function calculate(a, b, operation) {
    // 2.3 Функция калькулятор
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                return "Ошибка: деление на ноль";
            }
            return a / b;
        default:
            return "Ошибка: неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Функция для определения площади фигур
    switch (figure) {
        case 'circle':
            if (params.length < 1) return "Ошибка: недостаточно параметров";
            const radius = params[0];
            return Math.PI * radius * radius;
        case 'rectangle':
            if (params.length < 2) return "Ошибка: недостаточно параметров";
            const width = params[0];
            const height = params[1];
            return width * height;
        case 'triangle':
            if (params.length < 2) return "Ошибка: недостаточно параметров";
            const base = params[0];
            const triHeight = params[1];
            return 0.5 * base * triHeight;
        default:
            return "Ошибка: неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга"
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    year: 1967,
    pages: 480,
    isAvailable: true,

    getInfo() {
        return `"${this.title}" - ${this.author}, ${this.year} г., ${this.pages} стр.`;
    },

    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
}

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

    getAverageGrade() {
        const grades = Object.values(this.grades);
        if (grades.length === 0) return 0;
        const sum = grades.reduce((acc, grade) => acc + grade, 0);
        return sum / grades.length;
    },

    addGrade(subject, grade) {
        if (typeof subject !== "string" || subject.trim() === "") {
            console.log("Ошибка: название предмета не может быть пустым");
            return false;
        }

        if (typeof grade !== "number" || isNaN(grade)) {
            console.log("Ошибка: оценка должна быть числом");
            return false;
        }

        if (grade < 0) {
            console.log("Ошибка: оценка не может быть отрицательной");
            return false;
        }

        if (grade > 100) {
            console.log("Ошибка: оценка не может быть больше 100");
            return false;
        }

        this.grades[subject] = grade;
        return true;
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
    console.log("\n=== ЗАДАНИЕ 4: Массивы ===");
    
    const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
    const words = ["JavaScript", "программирование", "массив", "функция", "объект"];
    const users = [
        { id: 1, name: "Анна", age: 25, isActive: true },
        { id: 2, name: "Борис", age: 30, isActive: false },
        { id: 3, name: "Виктория", age: 22, isActive: true },
        { id: 4, name: "Григорий", age: 35, isActive: true },
        { id: 5, name: "Дарья", age: 28, isActive: false }
    ];

    // 1. forEach для вывода всех чисел больше 50
    console.log("\nЧисла больше 50:");
    numbers.forEach(num => {
        if (num > 50) {
            console.log(num);
        }
    });

    // 2. map для создания массива квадратов чисел
    const squares = numbers.map(num => num * num);
    console.log("\nКвадраты чисел:", squares);

    // 3. filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive === true);
    console.log("\nАктивные пользователи:", activeUsers);

    // 4. find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");
    console.log("\nПользователь Виктория:", victoria);

    // 5. reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("\nСумма всех чисел:", sum);

    // 6. sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log("\nПользователи по возрасту (убывание):", sortedByAge);

    // 7. every для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);
    console.log("\nВсе ли пользователи старше 18 лет:", allAdults);

    // 8. Цепочка методов
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();
    console.log("\nИмена активных пользователей (по алфавиту):", activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        const maxId = this.tasks.reduce((max, task) => task.id > max ? task.id : max, 0);
        this.tasks.push({
            id: maxId + 1,
            title: title,
            completed: false,
            priority: priority
        });
        return this.tasks[this.tasks.length - 1];
    },

    completeTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = true;
        }
        return task;
    },

    deleteTask(taskId) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            return this.tasks.splice(index, 1)[0];
        }
        return null;
    },

    getTasksByStatus(completed) {
        return this.tasks.filter(task => task.completed === completed);
    },

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;
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
        class Vehicle {
            static vehicleCount = 0;

            constructor(make, model, year) {
                this.make = make;
                this.model = model;
                this._year = year;
                Vehicle.vehicleCount++;
            }

            displayInfo() {
                console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
            }

            get age() {
                return new Date().getFullYear() - this._year;
            }

            set year(newYear) {
                if (newYear > new Date().getFullYear()) {
                    console.log("Ошибка: год не может быть больше текущего");
                    return;
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

        // ===== ЗАДАНИЕ 7: Каррирование =====
        const createVehicleFactory = (vehicleType) => (make, model, year) => {
            return new vehicleType(make, model, year);
        };

        return { Vehicle, Car, ElectricCar, createVehicleFactory };
    }

// ===== ЗАДАНИЕ 8: Валидация (регулярные выражения) =====
function validateDate(date) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    
    if (!dateRegex.test(date)) return false;

    const [day, month, year] = date.split('.').map(Number);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Февраль в високосный год — 29 дней
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;

    return day <= daysInMonth[month - 1];
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("\n=== ЗАПУСК ТЕСТОВ ===");

    // Тест 1: simpleTask
    simpleTask();

    // Тест 2: getReviewerNumber
    console.log("\n=== ЗАДАНИЕ 2: Функции ===");
    console.log("\n=== Тест getReviewerNumber ===");
    console.log(`getReviewerNumber(16, 1) = ${getReviewerNumber(16, 1)}`);

    // Тест 3: getVariant
    console.log("\n=== Тест getVariant ===");
    console.log(`getVariant(16, 4) = ${getVariant(16, 4)}`);

    // Тест 4: calculate
    console.log("\n=== Тест calculate ===");
    console.log(`10 + 5 = ${calculate(10, 5, '+')}`);
    console.log(`10 - 5 = ${calculate(10, 5, '-')}`);
    console.log(`10 * 5 = ${calculate(10, 5, '*')}`);
    console.log(`10 / 5 = ${calculate(10, 5, '/')}`);
    console.log(`10 / 0 = ${calculate(10, 0, '/')}`);

    // Тест 5: calculateArea
    console.log("\n=== Тест calculateArea ===");
    console.log(`Площадь круга (r=5): ${calculateArea('circle', 5).toFixed(2)}`);
    console.log(`Площадь прямоугольника (4x5): ${calculateArea('rectangle', 4, 5)}`);
    console.log(`Площадь треугольника (6x8): ${calculateArea('triangle', 6, 8)}`);

    // Тест 6: reverseString
    console.log("\n=== Тест reverseString ===");
    console.log(`"hello" -> "${reverseString("hello")}"`);
    console.log(`"sixseven" -> "${reverseString("sixseven")}"`);

    // Тест 7: getRandomNumber
    console.log("\n=== Тест getRandomNumber ===");
    console.log(`Случайное число от 1 до 10: ${getRandomNumber(1, 10)}`);

    // Тест 8: book
    console.log("\n=== ЗАДАНИЕ 3: Объекты ===");
    console.log("\n=== Тест book ===");
    console.log(book.getInfo());
    console.log(`Доступна: ${book.isAvailable}`);
    book.toggleAvailability();
    console.log(`После toggle: ${book.isAvailable}`);

    // Тест 9: student
    console.log("\n=== Тест student ===");
    console.log(`Средний балл: ${student.getAverageGrade()}`);
    student.addGrade("physics", 88);
    console.log(`Добавлена оценка по физике: ${student.grades.physics}`);
    console.log(`Новый средний балл: ${student.getAverageGrade()}`);

    // Тест 10: processArrays
    processArrays();

    // Тест 11: taskManager
    console.log("\n=== ЗАДАНИЕ 5: Менеджер задач ===");
    console.log("\n=== Тест taskManager ===");
    console.log("Статистика:", taskManager.getStats());
    
    const newTask = taskManager.addTask("Новая задача", "low");
    console.log(`Добавлена задача: ${newTask.title} (id: ${newTask.id})`);
    
    taskManager.completeTask(4);
    console.log(`Задача #4 выполнена`);
    
    taskManager.deleteTask(1);
    console.log(`Задача #1 удалена`);
    
    console.log(`Текущих задач: ${taskManager.tasks.length}`);
    console.log("Статистика после изменений:", taskManager.getStats());

    // Тест 12: Classes
    console.log("\n=== ЗАДАНИЕ 6: Классы и наследование ===");
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    console.log("\nVehicle:");
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    const car = new Car('Honda', 'Civic', 2018, 4);
    console.log("\nCar:");
    car.displayInfo();
    car.honk();

    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    console.log("\nElectricCar:");
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);

    // Тест 13: Каррирование
    console.log("\n=== ЗАДАНИЕ 7: Каррирование ===");

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log("\nСоздан через фабрику:");
    myNewCar.displayInfo();

    console.log(`\nВсего создано транспортных средств: ${Vehicle.getTotalVehicles()}`);

    // Тест 14: validateDate
    console.log("\n=== ЗАДАНИЕ 8: Регулярные выражения (Вариант 4) ===");
    console.log("\n=== Тест validateDate ===");
    console.log(`15.05.2026: ${validateDate("15.05.2026")}`);
    console.log(`32.01.2024: ${validateDate("32.01.2024")}`);
    console.log(`29.02.2024: ${validateDate("29.02.2024")}`);
    console.log(`31.02.2024: ${validateDate("31.02.2024")}`);
    console.log(`01.13.2024: ${validateDate("01.13.2024")}`);

    console.log("\nВСЕ ТЕСТЫ ВЫПОЛНЕНЫ");
}

runTests();