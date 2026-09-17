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

const getRandomNumber = (min, max) =>
    // Функция возвращает случайное число между min и max
    Math.floor(Math.random() * (max - min + 1)) + min;

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
        "date invalid: неверный разделитель")

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();
