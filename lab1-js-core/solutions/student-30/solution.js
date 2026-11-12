'use strict';

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const stringVar = "Привет, JavaScript";   // string
    const numberVar = 42;                      // number
    const booleanVar = true;                   // boolean
    const objectVar = { name: "Объект" };      // object
    const arrayVar = [1, 2, 3];                // object (массив — это object)
    const undefinedVar = undefined;            // undefined

    // 1.2 Выведите типы всех переменных
    console.log(typeof stringVar);     // "string"
    console.log(typeof numberVar);     // "number"
    console.log(typeof booleanVar);    // "boolean"
    console.log(typeof objectVar);     // "object"
    console.log(typeof arrayVar);      // "object"
    console.log(typeof undefinedVar);  // "undefined"
    console.log(Array.isArray(arrayVar)); // true — правильная проверка массива
}

// ===== ЗАДАНИЕ 2: Функции =====

// 2.1 Номер ревьюера: (номер + номер лабы) % всего студентов
function getReviewerNumber(number, lab) {
    const TOTAL_STUDENTS = 30;
    return (number + lab) % TOTAL_STUDENTS;
}

// 2.2 Номер варианта: номер % количество вариантов
function getVariant(number, variants) {
    return number % variants;
}

// 2.3 Калькулятор
function calculate(a, b, operation) {
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) {
                return 'Ошибка: деление на ноль';
            }
            return a / b;
        default:
            return 'Ошибка: неизвестная операция';
    }
}

// 2.4 Площадь фигур через switch
function calculateArea(figure, ...params) {
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
const reverseString = (str) => {
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    // Случайное целое от min до max включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: 'JavaScript: Подробное руководство',
    author: 'Дэвид Флэнаган',
    year: 2020,
    pages: 706,
    isAvailable: true,

    getInfo() {
        return `«${this.title}», автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
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

    // Средний балл: Object.values берёт все значения оценок
    getAverageGrade() {
        const values = Object.values(this.grades);
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, grade) => acc + grade, 0);
        return sum / values.length;
    },

    // Добавление/обновление оценки по предмету
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

    // 1. forEach — числа больше 50
    console.log("Числа больше 50:");
    numbers.forEach(num => {
        if (num > 50) console.log(num);
    });

    // 2. map — массив квадратов
    const squares = numbers.map(num => num * num);
    console.log("Квадраты чисел:", squares);

    // 3. filter — активные пользователи
    const activeUsers = users.filter(user => user.isActive);
    console.log("Активные пользователи:", activeUsers);

    // 4. find — пользователь "Виктория"
    const victoria = users.find(user => user.name === "Виктория");
    console.log("Найден пользователь:", victoria);

    // 5. reduce — сумма всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("Сумма чисел:", sum);

    // 6. sort — пользователи по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log("Пользователи по возрасту (убывание):", sortedByAge);

    // 7. every — все ли старше 18
    const allAdults = users.every(user => user.age > 18);
    console.log("Все старше 18:", allAdults);

    // 8. Цепочка: активные → имена → сортировка по алфавиту
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort((a, b) => a.localeCompare(b));
    console.log("Имена активных пользователей (по алфавиту):", activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        // Новый id = максимальный + 1 (или 1, если список пуст)
        const newId = this.tasks.length
            ? Math.max(...this.tasks.map(t => t.id)) + 1
            : 1;
        const task = { id: newId, title, completed: false, priority };
        this.tasks.push(task);
        return task;
    },

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            return true;
        }
        return false;
    },

    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    },

    getTasksByStatus(completed) {
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        // Защита от деления на ноль
        const completionRate = total === 0 ? 0 : (completed / total) * 100;
        return { total, completed, pending, completionRate };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс
    class Vehicle {
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
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                console.log(`Ошибка: год ${newYear} больше текущего (${currentYear})`);
                return;
            }
            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        static compareAge(vehicle1, vehicle2) {
            return vehicle1.age - vehicle2.age;
        }

        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    // Статическое свойство — объявляем ПОСЛЕ класса
    Vehicle.vehicleCount = 0;

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
            console.log(`Ёмкость батареи: ${this.batteryCapacity} кВт·ч`);
        }

        calculateRange() {
            // 1 кВт·ч = 6 км
            return this.batteryCapacity * 6;
        }
    }

    // ===== ЗАДАНИЕ 7: Каррирование =====
    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        switch (vehicleType) {
            case 'vehicle':     return new Vehicle(make, model, year);
            case 'car':         return new Car(make, model, year, 4);
            case 'electricCar': return new ElectricCar(make, model, year, 4, 60);
            default:            return null;
        }
    };

    return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====
// Вариант 2 (твой): валидация пароля
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    return passwordRegex.test(password);
}

// Тесты для пароля
function testPassword() {
    const tests = [
        // [пароль, ожидаемый результат, комментарий]
        ["Abcdef1!", true,  "корректный: 8 символов, есть всё"],
        ["Passw0rd@", true, "корректный: спецсимвол @"],
        ["Qwerty12#", true, "корректный: спецсимвол #"],
        ["Aa1!", false,      "короткий: 4 символа"],
        ["abcdefg1!", false, "нет заглавной"],
        ["ABCDEFG1!", false, "нет строчной"],
        ["Abcdefgh!", false, "нет цифры"],
        ["Abcdefg1", false,  "нет спецсимвола"],
        ["", false,          "пустая строка"],
        ["Abc def1!", false, "пробел не разрешён"],
        ["Abcdef1!~", false, "символ ~ не разрешён"]
    ];
    tests.forEach(([pass, expected, comment]) => {
        const result = validatePassword(pass);
        const status = result === expected ? "✅" : "❌";
        console.log(`${status} "${pass}" → ${result} (${comment})`);
    });
}
// ============================================================
// ===== ДЕМОНСТРАЦИЯ / ЗАПУСК ВСЕХ ЗАДАНИЙ =====
// ============================================================

console.log("\n===== ЗАДАНИЕ 1: Базовые операции =====");
simpleTask();

console.log("\n===== ЗАДАНИЕ 2: Функции =====");
console.log("Номер ревьюера (30, лаба 1, всего 30):", getReviewerNumber(30, 1));
console.log("Номер варианта (30 % 4):", getVariant(30, 4));
console.log("10 + 5 =", calculate(10, 5, '+'));
console.log("10 - 5 =", calculate(10, 5, '-'));
console.log("10 * 5 =", calculate(10, 5, '*'));
console.log("10 / 5 =", calculate(10, 5, '/'));
console.log("10 / 0 =", calculate(10, 0, '/'));
console.log("Площадь круга (r=5):", calculateArea('circle', 5).toFixed(2));
console.log("Площадь прямоугольника (4x6):", calculateArea('rectangle', 4, 6));
console.log("Площадь треугольника (основание 4, высота 6):", calculateArea('triangle', 4, 6));
console.log("Перевёрнутая строка 'JavaScript':", reverseString('JavaScript'));
console.log("Случайное число от 1 до 10:", getRandomNumber(1, 10));

console.log("\n===== ЗАДАНИЕ 3: Объекты =====");
console.log("Информация о книге:", book.getInfo());
console.log("Доступность до:", book.isAvailable, "→ после toggle:", book.toggleAvailability());
console.log("Средний балл студента:", student.getAverageGrade());
student.addGrade('physics', 88);
console.log("После добавления физики:", student.getAverageGrade().toFixed(2));

console.log("\n===== ЗАДАНИЕ 4: Массивы =====");
processArrays();

console.log("\n===== ЗАДАНИЕ 5: Менеджер задач =====");
console.log("Добавлена задача:", taskManager.addTask("Новая задача", "low"));
console.log("Отметить выполненной задачу id=1:", taskManager.completeTask(1));
console.log("Задачи по статусу completed=true:", taskManager.getTasksByStatus(true));
console.log("Статистика:", taskManager.getStats());
console.log("Удаление задачи id=3:", taskManager.deleteTask(3));
console.log("Статистика после удаления:", taskManager.getStats());

console.log("\n===== ЗАДАНИЕ 6: Классы и наследование =====");
const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();

const v1 = new Vehicle('Toyota', 'Corolla', 2015);
v1.displayInfo();
console.log("Возраст:", v1.age, "лет");

const car1 = new Car('BMW', 'X5', 2020, 5);
car1.displayInfo();
car1.honk();

const tesla = new ElectricCar('Tesla', 'Model S', 2022, 4, 100);
tesla.displayInfo();
console.log("Запас хода:", tesla.calculateRange(), "км");

console.log("Разница в возрасте v1 и car1:", Vehicle.compareAge(v1, car1));
console.log("Всего транспортных средств:", Vehicle.getTotalVehicles());

// Проверка сеттера: год в будущем
v1.year = 3000;
console.log("Год после неудачной попытки установить 3000:", v1.year);

console.log("\n===== ЗАДАНИЕ 7: Каррирование =====");
const createCarFactory = createVehicleFactory('car');
const myCar = createCarFactory('Lada', 'Vesta', 2023);
console.log("Создан через каррирование:", myCar);
myCar.displayInfo();

const createElectricFactory = createVehicleFactory('electricCar');
const myElectric = createElectricFactory('Nissan', 'Leaf', 2021);
myElectric.displayInfo();
console.log("Запас хода:", myElectric.calculateRange(), "км");

console.log("\n===== ЗАДАНИЕ 8: Регулярные выражения (Вариант 2: пароль) =====");
testPassword();