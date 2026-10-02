'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const myName = "Никита";
    const nothing = null;
    let mySymbol = Symbol(28);
    let isStudent = true;
    let myGroup = 6310;

    // 1.2 Выведите типы всех переменных
    console.log("Имя:", typeof myName);
    console.log("Пусто:", typeof nothing);
    console.log("Символ:", typeof mySymbol);
    console.log("Студент:", typeof isStudent);
    console.log("Группа:", typeof myGroup);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return ((number + lab - 1) % 30) + 1;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return ((number - 1) % variants) + 1;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    if (operation === "/" && b === 0){
        return("Ошибка деления");
    }
    else {
        switch (operation) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
            default: return "Операция не найдена";
        }
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case "circle": {
            const [radius] = params;
            return Math.PI * radius * radius;
        }
        case "rectangle": {
            const [width, height] = params;
            return width * height;
        }
        case "triangle": {
            const [base, height] = params;
            return 0.5 * base * height;
        }
        default: return "Фигура не найдена";
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
    title: "Жизнь с нуля в альтернативном мире",
    author: "Таппэй Нагацуки",
    year: 2014,
    pages: 248,
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
        // Ваш код здесь
        const values = Object.values(this.grades);
        if (values.length === 0) return 0;
        const total = values.reduce((sum, grade) => sum + grade, 0);
        return total / values.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        // Ваш код здесь
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
    numbers.forEach((num) => {
        if (num > 50) {
            console.log(num);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    /*const squares =  ваш код */
    const squares = numbers.map((num) => num * num);

    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */
    const activeUsers = users.filter((user) => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */
    const victoria = users.find((user) => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */
    const sum = numbers.reduce((total, num) => total + num, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    /*const sortedByAge =  ваш код */
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    /*const allAdults =  ваш код */
    const allAdults = users.every((user) => user.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    /*const activeUserNames =  ваш код */
    const activeUserNames = users.filter((user) => user.isActive).map((user) => user.name).sort((a, b) => a.localeCompare(b));
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
        const newTask = {
            id: this.tasks.length > 0 ? Math.max(...this.tasks.map((t) => t.id)) + 1 : 1,
            title,
            completed: false,
            priority
        };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find((t) => t.id === taskId);
        if (task) {
            task.completed = true;
            return task;
        }
        return null;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter((t) => t.completed === completed);
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
        const total = this.tasks.length;
        const completed = this.tasks.filter((t) => t.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

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
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = Number(year);
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
            if (newYear > new Date().getFullYear()) {
                throw new Error("Год выпуска не может быть больше текущего года");
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
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        // (добавьте в конструктор: Vehicle.vehicleCount++;)
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    // 6.2 Класс Car (наследуется от Vehicle)
    // Добавьте новое свойство numDoors (количество дверей).
    class Car extends Vehicle {
        constructor(make, model, year, numDoors = 4) {
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
        constructor(make, model, year, numDoors = 4, batteryCapacity) {
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
    const createVehicleFactory = (vehicleType) => (...args) => {
        return new vehicleType(...args);
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

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    console.log("\n=== ЗАДАНИЕ 1 ===")
    // simpleTask
    simpleTask();

    console.log("\n=== ЗАДАНИЕ 2 ===")
    // getReviewerNumber
    console.assert(getReviewerNumber(28, 1) === 29, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(29, 1) === 30, "Тест получения ревьюера провален");

    // getVariant
    console.assert(getVariant(28, 5) === 3)

    // calculate
    console.assert(calculate(100, 5, '+') === 105, "Тест калькулятора провален");
    console.assert(calculate(100, 5, '-') === 95, "Тест калькулятора (-) провален");
    console.assert(calculate(100, 5, '*') === 500, "Тест калькулятора (*) провален");
    console.assert(calculate(100, 5, '/') === 20, "Тест калькулятора (/) провален");
    console.assert(calculate(100, 0, '/') === "Ошибка деления", "Тест деления на ноль провален");
    console.assert(calculate(100, 5, '%') === "Операция не найдена", "Тест неизвестной операции провален");

    // alculateArea
    console.assert(calculateArea('circle', 4) === Math.PI * 16, "Тест калькулятора площади провален");
    console.assert(calculateArea('rectangle', 4, 5) === 20, "Тест калькулятора площади провален");
    console.assert(calculateArea('triangle', 6, 4) === 12, "Тест калькулятора площади провален");
    console.assert(calculateArea('octagon', 10) === "Фигура не найдена", "Тест калькулятора площади провален");

    // reverseString
    console.assert(reverseString('frontend') === 'dnetnorf', "Тест реверса строки провален");
    console.assert(reverseString('12345') === '54321', "Тест реверса цифр провален");
    console.assert(reverseString('') === '', "Тест реверса пустой строки провален");

    // getRandomNumber
    const rndNum = getRandomNumber(25, 75);
    console.assert(rndNum >= 25 && rndNum <= 75, "Тест случайного числа провален");

    console.log("\n=== ЗАДАНИЕ 3 ===");

    // book getInfo()
    console.assert(
        book.getInfo() === 'название: "Жизнь с нуля в альтернативном мире", автор: Таппэй Нагацуки, год: 2014, страниц: 248',
        "Тест book.getInfo провален"
    );

    // book toggleAvailability
    console.assert(book.isAvailable === true, "Тест начальной доступности книги провален");
    console.assert(book.toggleAvailability() === false, "Тест смены статуса (false) провален");
    console.assert(book.toggleAvailability() === true, "Тест возврата статуса (true) провален");

    // student getAverageGrade
    console.assert(student.getAverageGrade() === 90, "Тест среднего балла студента провален");

    // student addGrade
    student.addGrade('english', 100);
    console.assert(student.grades.english === 100, "Тест добавления оценки провален");
    console.assert(student.getAverageGrade() === 92.5, "Тест пересчета среднего балла провален");

    console.log("\n=== ЗАДАНИЕ 4 ===");

    const arrayResults = processArrays();

    // forEach
    const numbersOver50 = [67, 89, 56, 91];
    console.assert(numbersOver50.length === 4, "Тест forEach (длина) провален");
    console.assert(numbersOver50.every((n) => n > 50), "Тест forEach (значения) провален");

    // map
    console.assert(
        arrayResults.squares.join(',') === '144,2025,529,4489,1156,7921,3136,8281,729,196',
        "Тест map провален"
    );

    // filter
    console.assert(arrayResults.activeUsers.length === 3, "Тест filter (активные) провален");
    console.assert(arrayResults.activeUsers.every((user) => user.isActive), "Тест filter (isActive) провален");

    // find
    console.assert(arrayResults.victoria.name === 'Виктория', "Тест find (имя) провален");
    console.assert(arrayResults.victoria.age === 22, "Тест find (возраст) провален");

    // reduce
    console.assert(arrayResults.sum === 458, "Тест reduce суммы провален");

    // sort
    console.assert(
        arrayResults.sortedByAge.map(u => u.age).join(',') === '35,30,28,25,22',
        "Тест sort возраста провален"
    );

    // every
    console.assert(arrayResults.allAdults === true, "Тест every провален");

    // filter map sort
    console.assert(
        arrayResults.activeUserNames.join(',') === 'Анна,Виктория,Григорий',
        "Тест цепочки методов провален"
    );

    console.log("\n=== ЗАДАНИЕ 5 ===");

    // addTask
    const tasksCount = taskManager.tasks.length;
    taskManager.addTask('Написать отчет', 'high');
    console.assert(taskManager.tasks.length === tasksCount + 1, "Тест addTask (увеличение длины) провален");
    const lastTask = taskManager.tasks[taskManager.tasks.length - 1];
    console.assert(lastTask.completed === false, "Тест addTask (начальный статус) провален");

    // completeTask
    taskManager.completeTask(lastTask.id);
    console.assert(lastTask.completed === true, "Тест completeTask провален");

    // deleteTask
    const beforeDelCount = taskManager.tasks.length;
    taskManager.deleteTask(lastTask.id);
    console.assert(taskManager.tasks.length === beforeDelCount - 1, "Тест deleteTask (длина) провален");
    console.assert(taskManager.tasks.find(t => t.id === lastTask.id) === undefined, "Тест deleteTask (поиск) провален");

    // getTasksByStatus
    const doneTasks = taskManager.getTasksByStatus(true);
    const inProgressTasks = taskManager.getTasksByStatus(false);
    console.assert(doneTasks.every(t => t.completed === true), "Тест getTasksByStatus (true) провален");
    console.assert(inProgressTasks.every(t => t.completed === false), "Тест getTasksByStatus (false) провален");

    // getStats
    const managerStats = taskManager.getStats();
    console.assert(managerStats.total === 3, "Тест getStats (total) провален");
    console.assert(managerStats.completed === 1, "Тест getStats (completed) провален");
    console.assert(managerStats.pending === 2, "Тест getStats (pending) провален");
    console.assert(managerStats.completionRate === 33, "Тест getStats (rate) провален");

    console.log("\n=== ЗАДАНИЕ 6 ===")

    // Vehicle
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    // Car
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();

    // ElectricCar 
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);
    console.assert(electricCar.calculateRange() === 450, "Тест запаса хода ElectricCar провален");

    // Age
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');

    // compareAge
    const carA = new Vehicle('Toyota', 'Camry', 2015);
    const carB = new Vehicle('Honda', 'Civic', 2018);
    console.assert(Vehicle.compareAge(carA, carB) === 3, 'Тест compareAge провален');

    // setter year
    const validationVehicle = new Vehicle('Test', 'Test', 2020);
    let errorCaught = false;
    try {
        validationVehicle.year = 2100;
    } catch (e) {
        errorCaught = true;
    }
    console.assert(errorCaught, "Тест исключения сеттера year провален");

    console.log("\n=== ЗАДАНИЕ 7 ===")

    // createVehicleFactory (каррирование)
    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    // getTotalVehicles
    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());
    console.assert(Vehicle.getTotalVehicles() === 8, "Тест getTotalVehicles провален");

    console.log("\n=== ЗАДАНИЕ 8 (Вариант 4) ===")

    console.assert(validateDate("18.09.2026") === true, "Дата: валидная провален");
    console.assert(validateDate("31.12.1999") === true, "Дата: конец века провален");
    console.assert(validateDate("32.01.2025") === false, "Дата: день > 31 провален");
    console.assert(validateDate("15.13.2022") === false, "Дата: месяц > 12 провален");
    console.assert(validateDate("15.05.1899") === false, "Дата: год < 1900 провален");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();