'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных
    const n = 11;
    const strok = "stroka";
    let bool = true;
    let zero = null;
    let object = {name: "Anna"};

    console.log(typeof n)
    console.log(typeof strok)
    console.log(typeof bool)
    console.log(typeof zero)
    console.log(typeof object)
}

// ===== ЗАДАНИЕ 2: Функции =====
const allst = 30;
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    const result = (number + lab) % allst
    return result === 0 ? allst : result
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    const vari = number % variants;
    return vari === 0 ? variants : vari;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) throw new Error("Деление на ноль");
            return a / b;
        default:
            throw new Error(`Неизвестная операция: ${operation}`);
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle': {
            const [radius] = params;
            return 3.14 * radius ** 2;
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
            throw new Error(`Неизвестная фигура: ${figure}`);
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => str.split('').reverse().join('');
    // Функция возвращает перевернутую строку

const getRandomNumber = (min, max) => {
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    title: "Все о котах",
    author: "Лилия Тейчер",
    year: 2020,
    pages: 450,
    isAvailable: true,

    getInfo() {
        return `${this.title}, автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
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
        const grades = Object.values(this.grades);
        if (grades.length === 0) return 0;
        return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
        return this;
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

    // 3. Используйте filter для получения активных пользователей
     const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => acc + num, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort((a, b) => a.localeCompare(b));

    console.log({ squares, activeUsers, victoria, sum, sortedByAge, allAdults, activeUserNames });
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    // 5.1 Добавление задачи
    addTask(title, priority = "medium") {
        const id = this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
        const task = { id, title, completed: false, priority };
        this.tasks.push(task);
        return task;
    },

    // 5.2 Отметка выполнения
    completeTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return null;
        task.completed = true;
        return task;
    },

    // 5.3 Удаление задачи
    deleteTask(taskId) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    },

    // 5.4 Задачи по статусу
    getTasksByStatus(completed) {
        return this.tasks.filter(task => task.completed === completed);
    },

    /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : completed / total;
        return { total, completed, pending, completionRate };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    // В конструкторе принимайте и сохраняйте в this свойства:
    // make (марка), model (модель), year (год выпуска).
    class Vehicle {
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
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                throw new RangeError('Год выпуска не может быть больше текущего');
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

    Vehicle.vehicleCount = 0;

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
    const createVehicleFactory = (vehicleType) => (make, model, year) =>
        new vehicleType(make, model, year);

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
    //const phoneRegex = /^(\+7|8)[\s(-]?\d{3}[\s)-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    const phoneRegex = /^(\+7|8)\s?(\(\d{3}\)|\d{3})\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
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

       //email
       console.log("--- validateEmail ---");
       console.assert(validateEmail("user@example.com") === true,
           "email valid: обычный");
       console.assert(validateEmail("a.b_c%d+e-f@sub.domain.co") === true,
           "email valid: все разрешённые спецсимволы");
       console.assert(validateEmail("x@y.zz") === true,
           "email valid: минимальная длина");
       console.assert(validateEmail("userexample.com") === false,
           "email invalid: нет @");
       console.assert(validateEmail("@example.com") === false,
           "email invalid: пустое имя");
       console.assert(validateEmail("user@domain.c") === false,
           "email invalid: TLD из 1 символа");
       console.assert(validateEmail("user name@example.com") === false,
           "email invalid: пробел в имени");
       console.assert(validateEmail("user@domain") === false,
           "email invalid: нет TLD");
   
       //password
       console.log("--- validatePassword ---");
       console.assert(validatePassword("Aa1!aaaa") === true,
           "password valid: ровно 8 символов, все требования");
       console.assert(validatePassword("MyP@ssw0rd") === true,
           "password valid: длинный со всеми категориями");
       console.assert(validatePassword("Aa1!aaa") === false,
           "password invalid: 7 символов (мало)");
       console.assert(validatePassword("abcde1!a") === false,
           "password invalid: нет заглавной");
       console.assert(validatePassword("ABCDE1!A") === false,
           "password invalid: нет строчной");
       console.assert(validatePassword("Abcdefg!") === false,
           "password invalid: нет цифры");
       console.assert(validatePassword("Abcdefg1") === false,
           "password invalid: нет спецсимвола");
   
       //phone
       console.log("--- validatePhone ---");
       console.assert(validatePhone("+7 (999) 123-45-67") === true,
           "phone valid: +7 (999) 123-45-67");
       console.assert(validatePhone("8 (999) 123-45-67") === true,
           "phone valid: 8 (999) 123-45-67");
       console.assert(validatePhone("89991234567") === true,
           "phone valid: 89991234567");
       console.assert(validatePhone("+7(999)123-45-67") === true,
           "phone valid: +7(999)123-45-67");
       console.assert(validatePhone("9991234567") === false,
           "phone invalid: нет префикса +7/8");
       console.assert(validatePhone("+7 (999 123-45-67") === false,
           "phone invalid: несбалансированные скобки");
       console.assert(validatePhone("abc") === false,
           "phone invalid: буквы вместо цифр");
   
       //date
       console.log("--- validateDate ---");
       console.assert(validateDate("01.01.1900") === true,
           "date valid: нижняя граница года");
       console.assert(validateDate("31.12.2099") === true,
           "date valid: верхняя граница года");
       console.assert(validateDate("15.06.2024") === true,
           "date valid: обычная дата");
       console.assert(validateDate("00.01.2000") === false,
           "date invalid: день 00");
       console.assert(validateDate("32.01.2000") === false,
           "date invalid: день 32");
       console.assert(validateDate("01.13.2000") === false,
           "date invalid: месяц 13");
       console.assert(validateDate("01.01.1899") === false,
           "date invalid: год 1899");
       console.assert(validateDate("01.01.2100") === false,
           "date invalid: год 2100");
       console.assert(validateDate("1.01.2000") === false,
           "date invalid: день без ведущего нуля");
       console.assert(validateDate("01-01-2000") === false,
           "date invalid: неверный разделитель");
   
       console.log("Все тесты пройдены! ✅");
   }
   
// ===== РАСШИРЕННОЕ ТЕСТИРОВАНИЕ (функции) =====
function runExtraTests() {
    console.log("\n=== РАСШИРЕННОЕ ТЕСТИРОВАНИЕ ===");

    // --- simpleTask ---
    console.log("--- simpleTask ---");
    simpleTask();
    console.log("simpleTask: выполнено без ошибок");

    // --- getReviewerNumber ---
    console.log("--- getReviewerNumber ---");
    console.assert(getReviewerNumber(5, 1) === 6,
        `getReviewerNumber: ошибка — неверный номер ревьюера, ожидалось 6, получено ${getReviewerNumber(5, 1)}`);
    console.assert(getReviewerNumber(1, 2) === 3,
        `getReviewerNumber: ошибка — неверный номер ревьюера, ожидалось 3, получено ${getReviewerNumber(1, 2)}`);
    console.assert(getReviewerNumber(29, 1) === 30,
        `getReviewerNumber: ошибка — не обработана граница кратности allst, ожидалось 30, получено ${getReviewerNumber(29, 1)}`);
    console.assert(getReviewerNumber(28, 2) === 30,
        `getReviewerNumber: ошибка — не обработана граница кратности allst, ожидалось 30, получено ${getReviewerNumber(28, 2)}`);
    console.assert(getReviewerNumber(0, 0) === 30,
        `getReviewerNumber: ошибка — неверная обработка нулей (0 % 30 = 0), ожидалось 30, получено ${getReviewerNumber(0, 0)}`);
    console.assert(getReviewerNumber(30, 30) === 30,
        `getReviewerNumber: ошибка — неверная обработка кратности, ожидалось 30, получено ${getReviewerNumber(30, 30)}`);
    console.assert(getReviewerNumber(15, 10) === 25,
        `getReviewerNumber: ошибка — неверный номер ревьюера, ожидалось 25, получено ${getReviewerNumber(15, 10)}`);

    // --- getVariant ---
    console.log("--- getVariant ---");
    console.assert(getVariant(5, 10) === 5,
        `getVariant: ошибка — неверный номер варианта, ожидалось 5, получено ${getVariant(5, 10)}`);
    console.assert(getVariant(10, 10) === 10,
        `getVariant: ошибка — не обработана кратность variants, ожидалось 10, получено ${getVariant(10, 10)}`);
    console.assert(getVariant(25, 10) === 5,
        `getVariant: ошибка — неверный номер варианта, ожидалось 5, получено ${getVariant(25, 10)}`);
    console.assert(getVariant(0, 7) === 7,
        `getVariant: ошибка — неверная обработка нуля (0 % 7 = 0), ожидалось 7, получено ${getVariant(0, 7)}`);
    console.assert(getVariant(1, 1) === 1,
        `getVariant: ошибка — неверная обработка variants=1, ожидалось 1, получено ${getVariant(1, 1)}`);
    console.assert(getVariant(7, 3) === 1,
        `getVariant: ошибка — неверный номер варианта, ожидалось 1, получено ${getVariant(7, 3)}`);
    console.assert(getVariant(100, 15) === 10,
        `getVariant: ошибка — неверный номер варианта, ожидалось 10, получено ${getVariant(100, 15)}`);

    // --- calculate ---
    console.log("--- calculate ---");
    console.assert(calculate(10, 5, '+') === 15,
        `calculate: ошибка операции '+', ожидалось 15, получено ${calculate(10, 5, '+')}`);
    console.assert(calculate(10, 5, '-') === 5,
        `calculate: ошибка операции '-', ожидалось 5, получено ${calculate(10, 5, '-')}`);
    console.assert(calculate(10, 5, '*') === 50,
        `calculate: ошибка операции '*', ожидалось 50, получено ${calculate(10, 5, '*')}`);
    console.assert(calculate(10, 5, '/') === 2,
        `calculate: ошибка операции '/', ожидалось 2, получено ${calculate(10, 5, '/')}`);
    console.assert(calculate(-3, 7, '+') === 4,
        `calculate: ошибка с отрицательными числами, ожидалось 4, получено ${calculate(-3, 7, '+')}`);
    console.assert(calculate(2.5, 4, '*') === 10,
        `calculate: ошибка с дробными числами, ожидалось 10, получено ${calculate(2.5, 4, '*')}`);

    let threw = false;
    try { calculate(10, 0, '/'); } catch (e) { threw = true; }
    console.assert(threw,
        "calculate: ошибка — деление на ноль не вызывает исключение");

    threw = false;
    try { calculate(10, 5, '%'); } catch (e) { threw = true; }
    console.assert(threw,
        "calculate: ошибка — неизвестная операция '%' не вызывает исключение");

    // --- calculateArea ---
    console.log("--- calculateArea ---");
    console.assert(Math.abs(calculateArea('circle', 1) - 3.14) < 1e-9,
        `calculateArea: ошибка площади круга (r=1), ожидалось 3.14, получено ${calculateArea('circle', 1)}`);
    console.assert(Math.abs(calculateArea('circle', 10) - 314) < 1e-9,
        `calculateArea: ошибка площади круга (r=10), ожидалось 314, получено ${calculateArea('circle', 10)}`);
    console.assert(calculateArea('rectangle', 3, 4) === 12,
        `calculateArea: ошибка площади прямоугольника (3x4), ожидалось 12, получено ${calculateArea('rectangle', 3, 4)}`);
    console.assert(calculateArea('rectangle', 5, 5) === 25,
        `calculateArea: ошибка площади прямоугольника (5x5), ожидалось 25, получено ${calculateArea('rectangle', 5, 5)}`);
    console.assert(calculateArea('triangle', 6, 4) === 12,
        `calculateArea: ошибка площади треугольника (b=6, h=4), ожидалось 12, получено ${calculateArea('triangle', 6, 4)}`);
    console.assert(calculateArea('triangle', 10, 3) === 15,
        `calculateArea: ошибка площади треугольника (b=10, h=3), ожидалось 15, получено ${calculateArea('triangle', 10, 3)}`);

    threw = false;
    try { calculateArea('square', 5); } catch (e) { threw = true; }
    console.assert(threw,
        "calculateArea: ошибка — неизвестная фигура 'square' не вызывает исключение");

    // --- reverseString ---
    console.log("--- reverseString ---");
    console.assert(reverseString('hello') === 'olleh',
        `reverseString: ошибка переворота строки, ожидалось 'olleh', получено '${reverseString('hello')}'`);
    console.assert(reverseString('') === '',
        `reverseString: ошибка обработки пустой строки, ожидалась '', получено '${reverseString('')}'`);
    console.assert(reverseString('a') === 'a',
        `reverseString: ошибка обработки строки из 1 символа, ожидалось 'a', получено '${reverseString('a')}'`);
    console.assert(reverseString('12345') === '54321',
        `reverseString: ошибка переворота цифр, ожидалось '54321', получено '${reverseString('12345')}'`);
    console.assert(reverseString('abba') === 'abba',
        `reverseString: ошибка обработки палиндрома, ожидалось 'abba', получено '${reverseString('abba')}'`);
    console.assert(reverseString('Привет') === 'тевирП',
        `reverseString: ошибка переворота кириллицы, ожидалось 'тевирП', получено '${reverseString('Привет')}'`);

    // --- getRandomNumber ---
    console.log("--- getRandomNumber ---");
    for (let i = 0; i < 100; i++) {
        const r = getRandomNumber(1, 10);
        console.assert(Number.isInteger(r) && r >= 1 && r <= 10,
            `getRandomNumber: ошибка диапазона — ожидалось целое 1..10, получено ${r}`);
    }
    console.assert(getRandomNumber(5, 5) === 5,
        `getRandomNumber: ошибка при min = max, ожидалось 5, получено ${getRandomNumber(5, 5)}`);
    for (let i = 0; i < 50; i++) {
        const r = getRandomNumber(0, 1);
        console.assert(r === 0 || r === 1,
            `getRandomNumber: ошибка диапазона 0..1, получено ${r}`);
    }
    const seen = new Set();
    for (let i = 0; i < 1000; i++) seen.add(getRandomNumber(1, 3));
    console.assert(seen.has(1) && seen.has(2) && seen.has(3),
        `getRandomNumber: ошибка покрытия — не все значения 1..3 выпадают, получены ${[...seen].sort()}`);

    // --- book ---
    console.log("--- book ---");
    console.assert(book.title === "Все о котах",
        `book: ошибка поля title, ожидалось "Все о котах", получено "${book.title}"`);
    console.assert(book.author === "Лилия Тейчер",
        `book: ошибка поля author, ожидалось "Лилия Тейчер", получено "${book.author}"`);
    console.assert(book.year === 2020,
        `book: ошибка поля year, ожидалось 2020, получено ${book.year}`);
    console.assert(book.pages === 450,
        `book: ошибка поля pages, ожидалось 450, получено ${book.pages}`);
    console.assert(book.isAvailable === true,
        `book: ошибка поля isAvailable, ожидалось true, получено ${book.isAvailable}`);

    const info = book.getInfo();
    console.assert(typeof info === 'string',
        `book.getInfo: ошибка — метод должен возвращать строку, получено ${typeof info}`);
    console.assert(info.includes('Все о котах'),
        `book.getInfo: ошибка — в строке нет title, получено "${info}"`);
    console.assert(info.includes('Лилия Тейчер'),
        `book.getInfo: ошибка — в строке нет author, получено "${info}"`);
    console.assert(info.includes('2020'),
        `book.getInfo: ошибка — в строке нет year, получено "${info}"`);
    console.assert(info.includes('450'),
        `book.getInfo: ошибка — в строке нет pages, получено "${info}"`);

    // toggleAvailability вызываем ОДИН РАЗ и сохраняем результат
    const avail1 = book.toggleAvailability();
    console.assert(avail1 === false,
        `book.toggleAvailability: ошибка — после true должно стать false, получено ${avail1}`);
    console.assert(book.isAvailable === false,
        `book.toggleAvailability: ошибка — isAvailable должно стать false, получено ${book.isAvailable}`);

    const avail2 = book.toggleAvailability();
    console.assert(avail2 === true,
        `book.toggleAvailability: ошибка — после false должно стать true, получено ${avail2}`);
    console.assert(book.isAvailable === true,
        `book.toggleAvailability: ошибка — isAvailable должно стать true, получено ${book.isAvailable}`);

    // --- student ---
    console.log("--- student ---");
    console.assert(student.getAverageGrade() === 90,
        `student.getAverageGrade: ошибка — неверный средний балл, ожидалось 90, получено ${student.getAverageGrade()}`);
    console.assert(student.grades.math === 90,
        `student: ошибка поля grades.math, ожидалось 90, получено ${student.grades.math}`);
    console.assert(student.grades.programming === 95,
        `student: ошибка поля grades.programming, ожидалось 95, получено ${student.grades.programming}`);
    console.assert(student.grades.history === 85,
        `student: ошибка поля grades.history, ожидалось 85, получено ${student.grades.history}`);

    const ret = student.addGrade('physics', 100);
    console.assert(ret === student,
        "student.addGrade: ошибка — метод должен возвращать this для цепочки вызовов");
    console.assert(student.grades.physics === 100,
        `student.addGrade: ошибка — предмет не добавлен, ожидалось 100, получено ${student.grades.physics}`);
    console.assert(student.getAverageGrade() === 92.5,
        `student.getAverageGrade: ошибка — после addGrade средний неверный, ожидалось 92.5, получено ${student.getAverageGrade()}`);

    student.addGrade('chemistry', 80).addGrade('english', 70);
    console.assert(student.grades.chemistry === 80,
        `student.addGrade: ошибка цепочки — chemistry, ожидалось 80, получено ${student.grades.chemistry}`);
    console.assert(student.grades.english === 70,
        `student.addGrade: ошибка цепочки — english, ожидалось 70, получено ${student.grades.english}`);
    console.assert(Math.abs(student.getAverageGrade() - 520/6) < 1e-9,
        `student.getAverageGrade: ошибка после цепочки, ожидалось ${520/6}, получено ${student.getAverageGrade()}`);

    // --- processArrays ---
    console.log("--- processArrays ---");
    processArrays();
    console.log("processArrays: выполнено без ошибок");

    // --- taskManager ---
    console.log("--- taskManager ---");
    const initialStats = taskManager.getStats();
    console.assert(initialStats.total === 3,
        `taskManager.getStats: ошибка total, ожидалось 3, получено ${initialStats.total}`);
    console.assert(initialStats.completed === 1,
        `taskManager.getStats: ошибка completed, ожидалось 1, получено ${initialStats.completed}`);
    console.assert(initialStats.pending === 2,
        `taskManager.getStats: ошибка pending, ожидалось 2, получено ${initialStats.pending}`);
    console.assert(Math.abs(initialStats.completionRate - 1/3) < 1e-9,
        `taskManager.getStats: ошибка completionRate, ожидалось 1/3, получено ${initialStats.completionRate}`);

    const completedTasks = taskManager.getTasksByStatus(true);
    const pendingTasks = taskManager.getTasksByStatus(false);
    console.assert(completedTasks.length === 1,
        `taskManager.getTasksByStatus(true): ошибка — ожидалась 1 задача, получено ${completedTasks.length}`);
    console.assert(pendingTasks.length === 2,
        `taskManager.getTasksByStatus(false): ошибка — ожидалось 2 задачи, получено ${pendingTasks.length}`);
    console.assert(completedTasks.every(t => t.completed === true),
        "taskManager.getTasksByStatus(true): ошибка — в списке есть задачи с completed != true");
    console.assert(pendingTasks.every(t => t.completed === false),
        "taskManager.getTasksByStatus(false): ошибка — в списке есть задачи с completed != false");

    const newTask = taskManager.addTask('Новая задача', 'low');
    console.assert(typeof newTask.id === 'number',
        `taskManager.addTask: ошибка id — ожидался number, получено ${typeof newTask.id}`);
    console.assert(newTask.title === 'Новая задача',
        `taskManager.addTask: ошибка title — ожидалось 'Новая задача', получено '${newTask.title}'`);
    console.assert(newTask.priority === 'low',
        `taskManager.addTask: ошибка priority — ожидалось 'low', получено '${newTask.priority}'`);
    console.assert(newTask.completed === false,
        `taskManager.addTask: ошибка completed — ожидалось false, получено ${newTask.completed}`);
    console.assert(taskManager.tasks.length === 4,
        `taskManager.addTask: ошибка — после добавления ожидалось 4 задачи, получено ${taskManager.tasks.length}`);

    const defaultTask = taskManager.addTask('Без приоритета');
    console.assert(defaultTask.priority === 'medium',
        `taskManager.addTask: ошибка приоритета по умолчанию — ожидалось 'medium', получено '${defaultTask.priority}'`);
    console.assert(taskManager.tasks.length === 5,
        `taskManager.addTask: ошибка — после добавления ожидалось 5 задач, получено ${taskManager.tasks.length}`);

    const completed = taskManager.completeTask(newTask.id);
    console.assert(completed === newTask,
        "taskManager.completeTask: ошибка — метод должен вернуть изменённую задачу");
    console.assert(newTask.completed === true,
        `taskManager.completeTask: ошибка — задача не отмечена, получено ${newTask.completed}`);
    console.assert(taskManager.completeTask(9999) === null,
        "taskManager.completeTask: ошибка — для несуществующего id должен вернуться null");

    console.assert(taskManager.deleteTask(defaultTask.id) === true,
        "taskManager.deleteTask: ошибка — при успешном удалении должно вернуться true");
    console.assert(taskManager.tasks.length === 4,
        `taskManager.deleteTask: ошибка — после удаления ожидалось 4 задачи, получено ${taskManager.tasks.length}`);
    console.assert(taskManager.deleteTask(9999) === false,
        "taskManager.deleteTask: ошибка — для несуществующего id должно вернуться false");

    const finalStats = taskManager.getStats();
    console.assert(finalStats.total === 4,
        `taskManager.getStats: ошибка total в конце, ожидалось 4, получено ${finalStats.total}`);
    console.assert(finalStats.completed === 2,
        `taskManager.getStats: ошибка completed в конце, ожидалось 2, получено ${finalStats.completed}`);
    console.assert(finalStats.pending === 2,
        `taskManager.getStats: ошибка pending в конце, ожидалось 2, получено ${finalStats.pending}`);
    console.assert(Math.abs(finalStats.completionRate - 0.5) < 1e-9,
        `taskManager.getStats: ошибка completionRate в конце, ожидалось 0.5, получено ${finalStats.completionRate}`);

    console.log("Все расширенные тесты пройдены ✅");
}
   
   // ===== ЗАПУСК =====
   runTests();
   runExtraTests();