'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let group = 6310;
    const firstName = "Bulat";
    const id = Symbol(21);
    let isStudent = true;
    let car = null;

    // 1.2 Выведите типы всех переменных
    console.log(typeof group);
    console.log(typeof firstName);
    console.log(typeof id);
    console.log(typeof isStudent);
    console.log(typeof car);
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

function calculate(a, b, op) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    if (op === '/' && b === 0){
        return('На 0 делить нельзя');
    } else {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            default:
                return 'Неизвестная операция';
        }
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle': {
            const [radius] = params;
            return Math.PI * Math.pow(radius, 2);
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
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    return str.split('').reverse().join('');
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

    title: "Старик и море",
    author: "Эрнест Хемингуэй",
    year: 1952,
    pages: 128,
    isAvailable: true,

    getInfo() {
        return `"${this.title}", автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
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
        let count = 0;

        for (let subject in this.grades) {
            sum += this.grades[subject];
            count++;
        }

        return sum / count;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        student.grades[subject] = grade;
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
    const squares = numbers.map(num => num ** 2);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((sum, num) => {
        return sum + num;
    }, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = users.slice().sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users.filter(user => user.isActive).map(user => user.name).sort((a, b) => a.localeCompare(b));

    return {
        squares,
        activeUsers,
        victoria,
        sum,
        sortedByAge,
        allAdults,
        activeUserNames
    };
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
            id: this.tasks.length > 0 
                ? Math.max(...this.tasks.map(t => t.id)) + 1 
                : 1,
            title: title,
            completed: false,
            priority: priority
        };
        this.tasks.push(newTask);
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(item => item.id === taskId);
        if (task) {
            task.completed = true;
        }
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        this.tasks = this.tasks.filter(task => task.id !== taskId);
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
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = this.tasks.filter(task => !task.completed).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
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
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                throw new Error("Год выпука не может быть больше текущего");
            }
            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle2.age - vehicle1.age);
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
            console.log(`Ёмкость батареи ${this.batteryCapacity} кВт/ч`);
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

    console.log("\n== ЗАДАНИЕ 1 ==")

    // Тест 1: simpleTask
    simpleTask();

    console.log("== Тесты задания 1 завершены ==")

    console.log("\n== ЗАДАНИЕ 2 ==")

    // Тест 2: getReviewerNumber
    console.assert(getReviewerNumber(20, 1) === 21, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(29, 1) === 0, "Тест получения ревьюера провален");

    // Тест 3: getVariant
    console.assert(getVariant(21, 4) === 1)
    console.assert(getVariant(10, 5) === 5)
    
    // Тест 4: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 0, '/') === 'На 0 делить нельзя', "Тест калькулятора провален");
    console.assert(calculate(10, 5, '%') === 'Неизвестная операция', "Тест калькулятора провален");

    // Тест 5: calculateArea
    console.assert(calculateArea('circle', 5) === Math.PI * 25, "Тест калькулятора площади провален");
    console.assert(calculateArea('rectangle', 5, 10) === 50, "Тест калькулятора площади провален");
    console.assert(calculateArea('triangle', 10, 5) === 25, "Тест калькулятора площади провален");
    console.assert(calculateArea('square', 5) === 'Неизвестная фигура', "Тест калькулятора площади провален");

    // Тест 6: reverseString:
    console.assert(reverseString('hello') === 'olleh', "Тест реверса строки провален");
    console.assert(reverseString('6310') === '0136', "Тест реверса строки провален");
    console.assert(reverseString('') === '', "Тест реверса строки провален");

    // Тест 7: getRandomNumber
    const randomNumber = getRandomNumber(1, 10);
    console.assert(randomNumber >= 1 && randomNumber <= 10, "Тест рандомного числа провален");

    console.log("== Тесты задания 2 завершены ==")

    console.log("\n== ЗАДАНИЕ 3 ==")

    // Тест 8: book getInfo()
    console.assert(book.getInfo() === '"Старик и море", автор: Эрнест Хемингуэй, год: 1952, страниц: 128', "Тест getInfo провален");
    
    // Тест 9: book toggleAvailability
    console.assert(book.isAvailable === true, "Тест isAvailable провален");
    console.assert(book.toggleAvailability() === false, "Тест toggleAvailability провален");
    console.assert(book.toggleAvailability() === true, "Тест toggleAvailability провален");

    // Тест 10: student getAverageGrade
    console.assert(student.getAverageGrade() === 90, "Тест getAverageGrade провален");
    
    // Тест 11: student addGrade
    student.addGrade('physics', 80)
    console.assert(student.grades.physics === 80, "Тест addGrade провален");

    console.log("== Тесты задания 3 завершены ==");

    console.log("\n== ЗАДАНИЕ 4 ==");

    const arrayResult = processArrays();

    // Тест 12: forEach
    const numbersOver50 = [67, 89, 56, 91];
    console.assert(numbersOver50.length === 4, "Тест forEach провален");
    console.assert(numbersOver50.every(n => n > 50), "Тест forEach провален");

    // Тест 13: map
    console.assert(arrayResult.squares.join(',') === 
    '144,2025,529,4489,1156,7921,3136,8281,729,196', "Тест map провален");

    // Тест 14: filter
    console.assert(arrayResult.activeUsers.length === 3, "Тест filter провален");
    console.assert(arrayResult.activeUsers.every(user => user.isActive), 
    "Тест filter провален");

    // Тест 15: find
    console.assert(arrayResult.victoria.name === 'Виктория', "Тест find провален");
    console.assert(arrayResult.victoria.age === 22, "Тест find провален");

    // Тест 16: reduce
    console.assert(arrayResult.sum === 458, "Тест reduce провален");
    
    // Тест 17: sort
    console.assert(arrayResult.sortedByAge.map(user => user.age).join(',') === 
    '35,30,28,25,22', "Тест sort провален");

    // Тест 18: every
    console.assert(arrayResult.allAdults === true, "Тест every провален");
    
    // Тест 19: filter map sort
    console.assert(arrayResult.activeUserNames.join(',') === 
    'Анна,Виктория,Григорий', "Тест filter map sort провален");

    console.log("== Тесты задания 4 завершены ==");
    
    console.log("\n== ЗАДАНИЕ 5 ==");

    // Тест 20: addTask
    const oldLength = taskManager.tasks.length;
    taskManager.addTask('Повторить тесты', 'low');
    console.assert(taskManager.tasks.length === oldLength + 1,
        "Тест addTask провален");

    const addedTask = taskManager.tasks[taskManager.tasks.length - 1];
    console.assert(addedTask.completed === false, "Тест addTask провален");
        
    // Тест 21: completeTask
    taskManager.completeTask(addedTask.id);
    console.assert(addedTask.completed === true, "Тест completeTask провален");

    // Тест 22: deleteTask
    const lengthBeforeDelete = taskManager.tasks.length;
    taskManager.deleteTask(addedTask.id);

    console.assert(taskManager.tasks.length === lengthBeforeDelete - 1, "Тест deleteTask провален");
    console.assert(taskManager.tasks.find(task => task.id === addedTask.id) === undefined, "Тест deleteTask провален");
    
    // Тест 23: getTasksByStatus
    const completedTasks = taskManager.getTasksByStatus(true);
    const pendingTasks = taskManager.getTasksByStatus(false);

    console.assert(completedTasks.every(task => task.completed === true),
    "Тест getTasksByStatus провален");
    console.assert(pendingTasks.every(task => task.completed === false),
    "Тест getTasksByStatus провален");

    // Тест 24: getStats
    const stats = taskManager.getStats();
    
    console.assert(stats.total === 3, "Тест getStats провален");
    console.assert(stats.completed === 1, "Тест getStats провален");
    console.assert(stats.pending === 2, "Тест getStats провален");
    console.assert(stats.completionRate === 33,
    "Тест getStats провален");

    console.log("== Тесты задания 5 завершены ==");

    console.log("\n== ЗАДАНИЕ 6 ==");

    // Тест 25: Vehicle
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);
    
    // Тест 26: Car
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();
    
    // Тест 27: electricCar
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);
    
    // Тест 28: Age
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');

    // Тест 29: compareAge (статический метод)
    const vehicle1 = new Vehicle('Toyota', 'Camry', 2015);
    const vehicle2 = new Vehicle('Honda', 'Civic', 2018);
    console.assert(Vehicle.compareAge(vehicle1, vehicle2) === 3, 
        'Тест compareAge провален');

    // Тест 30: setter year (проверка на будущий год)
    const testVehicle2 = new Vehicle('Test', 'Model', 2020);
    let yearErrorThrown = false;
    try {
        testVehicle2.year = 2030;
    } catch (error) {
        yearErrorThrown = true;
    }
    console.assert(yearErrorThrown, "Тест setter year провален");
    console.log("== Тесты задания 6 завершены ==");

    console.log("\n== ЗАДАНИЕ 7 ==");

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles()); 
    
    console.log("== Тесты задания 7 завершены ==");
    
        console.log("\n== ЗАДАНИЕ 8 ==");

    const emailTests = [
        // Базовые корректные email
        { email: "user@example.com", expected: true, desc: "Базовый email" },
        { email: "user123@example.com", expected: true, desc: "С цифрами" },
        { email: "john.doe@example.com", expected: true, desc: "С точкой в имени" },
        { email: "john-doe@example.com", expected: true, desc: "С дефисом" },
        
        // Спецсимволы % и + в локальной части (замечание преподавателя)
        { email: "user%name@example.com", expected: true, desc: "Спецсимвол %" },
        { email: "user+tag@example.com", expected: true, desc: "Спецсимвол +" },
        
        // Поддомен (замечание преподавателя)
        { email: "user@mail.example.com", expected: true, desc: "Поддомен" },
        
        // Кириллица должна отклоняться (замечание преподавателя)
        { email: "пользователь@example.com", expected: false, desc: "Кириллица" },
        
        // Некорректные форматы
        { email: "userexample.com", expected: false, desc: "Нет @" },
        { email: "user@", expected: false, desc: "Нет домена" },
        { email: "@example.com", expected: false, desc: "Нет имени" },
        { email: "user@example", expected: false, desc: "Нет точки после домена" },
        { email: "user name@example.com", expected: false, desc: "Пробел" },
        { email: "user@@example.com", expected: false, desc: "Два @" },
        { email: "user@example.", expected: false, desc: "Нет текста после точки" },
        { email: "USER@EXAMPLE.COM", expected: true, desc: "Верхний регистр" },
        { email: "user_name@example.com", expected: true, desc: "Подчеркивание" },
        
        // Минимальная длина TLD (замечание про Тест 14)
        { email: "a@b.co", expected: true, desc: "Минимальный TLD (2 символа)" },
        { email: "a@b.c", expected: false, desc: "Односимвольный TLD" }
    ];

    let allPassed = true;
    
    emailTests.forEach((test, index) => {
        const result = validateEmail(test.email);
        const passed = result === test.expected;
        
        if (!passed) {
            allPassed = false;
            console.assert(false, 
                `Тест ${index + 1} (${test.desc}) провален: "${test.email}" | Ожидалось: ${test.expected}, Получено: ${result}`);
        } else {
            console.log(`✅ Тест ${index + 1} (${test.desc}): ПРОЙДЕН`);
        }
    });

    if (allPassed) {
        console.log("Все тесты задания 8 пройдены! ✅");
    }
}

// Запуск тестов
runTests();