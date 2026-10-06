'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных
    let a = 10;
    let b = 'aboba';
    let f = Symbol('x');
    let c = true;
    let ded = null;
    console.log(a, typeof a);
    console.log(b, typeof b);
    console.log(c, typeof c);
    console.log(ded, typeof ded);
    console.log(f, typeof f);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    let reviewer_number = ((number + lab - 1) % 30) + 1;
    return reviewer_number;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    let variant_number = ((number - 1) % variants) + 1;
    return variant_number;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    if (operation === '+') {
        return a + b;
    } else if (operation === '-') {
        return a - b;
    } else if (operation === '*') {
        return a * b;
    } else if (operation === '/') {
        return a / b;
    } else {
        return 'Неизвестная операция';
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    switch (figure) {
        case 'circle': {
            const r = params[0];
            return 3.14 * r * r;           
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
            return 'Неизвестная фигура';
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => str.split('').reverse().join('');
    // Функция возвращает перевернутую строку


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
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    pages: 671,
    isAvailable: true,

    // Метод возвращает строку с информацией о книге
    getInfo() {
        return `Книга: "${this.title}", автор: ${this.author}, год выпуска: ${this.year}, страниц: ${this.pages}`;
    },

    // Метод меняет доступность и возвращает новое значение
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
        // Ваш код здесь
        const values = Object.values(this.grades);
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, grade) => acc + grade, 0);
        return sum / values.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        // Ваш код здесь
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
    numbers.forEach(num => {
        if (num > 50) console.log(num);
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(num => num ** 2);
    console.log("Квадраты чисел:", squares);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);
    console.log("Активные пользователи:", activeUsers);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");
    console.log("Виктория:", victoria);

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("Сумма всех чисел:", sum);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log("Пользователи по возрасту (убывание):", sortedByAge);

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
        .sort((a, b) => a.localeCompare(b));
    console.log("Имена активных пользователей:", activeUserNames);
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
        const id = this.tasks.length > 0
            ? Math.max(...this.tasks.map(t => t.id)) + 1
            : 1;
        const newTask = { id, title, completed: false, priority };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return null;
        task.completed = true;
        return task;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter(task => task.completed === completed);
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
        // 6.4 Статические методы и свойства
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this._year = year;            // через _year, чтобы работал сеттер
            Vehicle.vehicleCount++;       // (добавьте в конструктор: Vehicle.vehicleCount++;)
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
                console.log(`Ошибка: год не может быть больше ${currentYear}`);
                return;
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
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
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
            console.log(`Ёмкость батареи: ${this.batteryCapacity} кВт·ч`);
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
        switch (vehicleType) {
            case 'vehicle':      return new Vehicle(make, model, year);
            case 'car':          return new Car(make, model, year, 4);
            case 'electricCar':  return new ElectricCar(make, model, year, 4, 60);
            default:             return new Vehicle(make, model, year);
        }
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

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Тест 0: simpleTask
    simpleTask();

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

    // Тест reverseString
    console.assert(reverseString('abc') === 'cba', "reverseString('abc') === 'cba'");
    console.assert(reverseString('JavaScript') === 'tpircSavaJ', "reverseString('JavaScript')");
    console.assert(reverseString('a') === 'a',                 "одна буква");
    console.assert(reverseString('') === '',                   "пустая строка");

    console.log("reverseString: тесты пройдены ✅");

    // Тесты validatePassword
    console.assert(validatePassword("Password1!") === true,            "обычный валидный");
    console.assert(validatePassword("Abcdef1!") === true,              "ровно 8 символов (граница)");
    console.assert(validatePassword("aB1!aB1!aB1!") === true,          "всё чередуется");
    console.assert(validatePassword("Aa1!" + "x".repeat(20)) === true, "очень длинный");

    // Нет одной из категорий
    console.assert(validatePassword("abcdefg1!") === false,            "нет заглавной");
    console.assert(validatePassword("ABCDEFG1!") === false,            "нет строчной");
    console.assert(validatePassword("Abcdefg!") === false,             "нет цифры");
    console.assert(validatePassword("Abcdefg1") === false,             "нет спецсимвола");

    // Слишком короткий
    console.assert(validatePassword("Abc1!a") === false,               "7 символов (на 1 меньше)");
    console.assert(validatePassword("Aa1!") === false,                 "4 символа");
    console.assert(validatePassword("") === false,                     "пустая строка");

    // Запрещённые символы
    console.assert(validatePassword("Abcdef1! ") === false,            "пробел");
    console.assert(validatePassword("Abcdef1!-") === false,            "дефис не в наборе");
    console.assert(validatePassword("Пароль1!A") === false,            "кириллица");

    console.log("validatePassword: тесты пройдены ✅");

    // Тест getVariant
    console.assert(getVariant(1, 4) === 1,   "getVariant(1,4) === 1");
    console.assert(getVariant(4, 4) === 4,   "getVariant(4,4) === 4");
    console.assert(getVariant(5, 4) === 1,   "getVariant(5,4) === 1");
    console.assert(getVariant(100, 1) === 1, "getVariant(100,1) === 1");
    console.assert(getVariant(30, 30) === 30,"getVariant(30,30) === 30");
    console.assert(getVariant(31, 30) === 1, "getVariant(31,30) === 1");

    console.log("getVariant: тесты пройдены ✅");

    // Тест calculateArea
    console.assert(calculateArea('circle', 1) === 3.14,       "circle r=1 → 3.14");
    console.assert(calculateArea('rectangle', 3, 4) === 12,   "rectangle 3x4 → 12");
    console.assert(calculateArea('triangle', 10, 5) === 25,   "triangle 10x5 → 25");
    console.assert(calculateArea('triangle', 0, 5) === 0,     "triangle 0x5 → 0");
    console.assert(calculateArea('square', 5) === 'Неизвестная фигура', "square → ошибка");
    console.assert(calculateArea('', 1) === 'Неизвестная фигура',       "пустая фигура → ошибка");

    console.log("calculateArea: тесты пройдены ✅");

    // Тест getRandomNumber
    console.assert(getRandomNumber(5, 5) === 5, "getRandomNumber(5,5) === 5");

    const r1 = getRandomNumber(1, 10);
    console.assert(Number.isInteger(r1) && r1 >= 1 && r1 <= 10, `диапазон [1,10]: ${r1}`);

    const r2 = getRandomNumber(-5, -1);
    console.assert(Number.isInteger(r2) && r2 >= -5 && r2 <= -1, `диапазон [-5,-1]: ${r2}`);

    const r3 = getRandomNumber(-3, 3);
    console.assert(Number.isInteger(r3) && r3 >= -3 && r3 <= 3, `диапазон [-3,3]: ${r3}`);

    console.log("getRandomNumber: тесты пройдены ✅");

    
    
    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();