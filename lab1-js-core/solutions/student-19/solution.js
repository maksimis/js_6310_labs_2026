'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const sampleString = "sample";
    const sampleNumber = 123;
    const sampleBool = true;
    const sampleNull = null;
    const sampleSymbol = Symbol("o");
    // 1.2 Выведите типы всех переменных
    console.log("Тип sampleString:", typeof(sampleString));
    console.log("Тип sampleNumber:", typeof(sampleNumber));
    console.log("Тип sampleBool:", typeof(sampleBool));
    console.log("Тип sampleNull:", typeof(sampleNull));
    console.log("Тип sampleSymbol:", typeof(sampleSymbol));
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return (number + lab) % 30;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    const variant = number % variants;
    return variant === 0 ? variants : variant;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "Ошибка: деление на ноль";
        default: return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle':
            return Math.PI * Math.pow(params[0], 2); // params[0] = radius
        case 'rectangle':
            return params[0] * params[1]; // width, height
        case 'triangle':
            return 0.5 * params[0] * params[1]; // base, height
        default:
            return "Неизвестная фигура";
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
    title: "1984",
    author: "Джордж Оруэлл",
    year: 1949,
    pages: 328,
    isAvailable: true,
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    getInfo() {
        return `"${this.title}" автора ${this.author}, ${this.year} год, ${this.pages} стр.`;
    },
    // метод toggleAvailability - который меняет значение доступности и возвращает его
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
        return values.reduce((sum, grade) => sum + grade, 0) / values.length;
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
    numbers.forEach(n => {
        if (n > 50) console.log(n);
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(n => n * n);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(u => u.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(u => u.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, n) => acc + n, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(u => u.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(u => u.isActive)
        .map(u => u.name)
        .sort();
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
        const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        this.tasks.push({ id: newId, title, completed: false, priority });
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
        }
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        this.tasks = this.tasks.filter(t => t.id !== taskId);
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter(t => t.completed === completed);
    },

    getStats() {
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
        static vehicleCount = 0;
        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year; // вызывает сеттер
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
                throw new Error("Год не может быть больше текущего");
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
    const phoneRegex = /^(\+7|8)[\s-]?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
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

    // 1
    simpleTask();

    // 4
    processArrays();
    
    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");

    // Тест 3: taskManager
    console.log("\n--- Тестирование taskManager ---");

    // 1. Тест addTask (добавление с приоритетом по умолчанию)
    taskManager.addTask("Купить молоко");
    console.assert(taskManager.tasks.length === 4, "addTask: не увеличилась длина массива");
    const newTask = taskManager.tasks.find(t => t.title === "Купить молоко");
    console.assert(newTask !== undefined, "addTask: задача не найдена в массиве");
    console.assert(newTask.id === 4, "addTask: неверно сгенерирован ID (ожидался 4)");
    console.assert(newTask.priority === "medium", "addTask: неверный приоритет по умолчанию");
    console.assert(newTask.completed === false, "addTask: новая задача должна быть не выполнена");

    // 2. Тест addTask (добавление с явным приоритетом)
    taskManager.addTask("Срочная задача", "high");
    const urgentTask = taskManager.tasks.find(t => t.title === "Срочная задача");
    console.assert(urgentTask.priority === "high", "addTask: неверно установлен явный приоритет");
    console.assert(taskManager.tasks.length === 5, "addTask: длина массива должна быть 5");

    // 3. Тест completeTask (успешное выполнение)
    // Изначально задача с id: 1 была completed: false
    taskManager.completeTask(1);
    const task1 = taskManager.tasks.find(t => t.id === 1);
    console.assert(task1.completed === true, "completeTask: не изменил статус на true");

    // 4. Тест completeTask (несуществующий ID - не должно ломать код)
    taskManager.completeTask(999);
    console.assert(taskManager.tasks.length === 5, "completeTask: вызов с несуществующим ID изменил длину массива");

    // 5. Тест deleteTask
    // Удаляем задачу с id: 3 ("Прочитать книгу")
    taskManager.deleteTask(3);
    console.assert(taskManager.tasks.length === 4, "deleteTask: длина массива не уменьшилась");
    console.assert(!taskManager.tasks.some(t => t.id === 3), "deleteTask: задача с id 3 все еще существует в массиве");
    
    // Проверка, что удалилась именно та задача, а другие остались
    console.assert(taskManager.tasks.some(t => t.id === 1), "deleteTask: ошибочно удалил другую задачу (id 1)");
    console.assert(taskManager.tasks.some(t => t.id === 2), "deleteTask: ошибочно удалил другую задачу (id 2)");

    // 6. Тест getTasksByStatus
    // После изменений: выполнены (true) -> id 1, id 2. Не выполнены (false) -> id 4, id 5
    const completedTasks = taskManager.getTasksByStatus(true);
    console.assert(completedTasks.length === 2, "getTasksByStatus(true): неверное количество выполненных задач");
    console.assert(completedTasks.every(t => t.completed === true), "getTasksByStatus(true): в массиве есть невыполненные задачи");

    const pendingTasks = taskManager.getTasksByStatus(false);
    console.assert(pendingTasks.length === 2, "getTasksByStatus(false): неверное количество невыполненных задач");
    console.assert(pendingTasks.every(t => t.completed === false), "getTasksByStatus(false): в массиве есть выполненные задачи");

    // 7. Тест getStats (проверка актуальной статистики после всех изменений)
    // Всего: 4, Выполнено: 2, В ожидании: 2, Процент: 50%
    const stats = taskManager.getStats();
    console.assert(stats.total === 4, "getStats: неверный total");
    console.assert(stats.completed === 2, "getStats: неверный completed");
    console.assert(stats.pending === 2, "getStats: неверный pending");
    console.assert(stats.completionRate === 50, "getStats: неверный completionRate");

    console.log("✅ Тесты taskManager успешно пройдены!");

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

    console.log("\n=== ТЕСТИРОВАНИЕ ВАЛИДАЦИИ ТЕЛЕФОНА ===\n");

    // --- 1. Корректные номера (должны пройти) ---
    console.log("--- 1. Корректные номера (должны пройти) ---");
    
    // Форматы из задания
    console.assert(validatePhone("+7 (999) 123-45-67") === true, "+7 с пробелами и скобками");
    console.assert(validatePhone("8 (999) 123-45-67") === true, "8 с пробелами и скобками");
    console.assert(validatePhone("89991234567") === true, "8 без разделителей");
    console.assert(validatePhone("+7(999)123-45-67") === true, "+7 со скобками без пробелов");
    
    // Дополнительные корректные форматы
    console.assert(validatePhone("+79991234567") === true, "+7 без разделителей");
    console.assert(validatePhone("8 999 123 45 67") === true, "8 только с пробелами");
    console.assert(validatePhone("+7 999 123 45 67") === true, "+7 только с пробелами");
    console.assert(validatePhone("+7-999-123-45-67") === true, "+7 только с дефисами");
    console.assert(validatePhone("8-999-123-45-67") === true, "8 только с дефисами");
    console.assert(validatePhone("+7(999)1234567") === true, "+7 со скобками, без пробелов после");
    console.assert(validatePhone("8(999)1234567") === true, "8 со скобками, без пробелов после");
    console.assert(validatePhone("+7 999 123-45-67") === true, "Смешанный формат: пробелы и дефисы");
    console.assert(validatePhone("8 999 123-45-67") === true, "Смешанный формат с 8");
    console.assert(validatePhone("+7(999) 123-45-67") === true, "Скобки без пробела перед, с пробелом после");
    console.assert(validatePhone("+7 (999)123-45-67") === true, "Пробел перед скобкой, без пробела после");
    console.assert(validatePhone("+7(999) 123 45 67") === true, "Скобки и пробелы");
    console.assert(validatePhone("8(999) 123 45 67") === true, "8 со скобками и пробелами");
    
    // Разные коды операторов
    console.assert(validatePhone("+7(900)123-45-67") === true, "Код 900");
    console.assert(validatePhone("+7(999)000-00-00") === true, "Все нули");
    console.assert(validatePhone("+7(111)111-11-11") === true, "Все единицы");

    console.log("\n--- 2. Некорректные номера (НЕ должны пройти) ---");
    
    // Пустые и граничные значения
    console.assert(validatePhone("") === false, "Пустая строка");
    console.assert(validatePhone(" ") === false, "Только пробел");
    console.assert(validatePhone("+7") === false, "Только код страны");
    console.assert(validatePhone("+7 (") === false, "Неполный номер со скобкой");
    
    // Неправильный код страны
    console.assert(validatePhone("+6 (999) 123-45-67") === false, "Неправильный код страны (+6)");
    console.assert(validatePhone("+1 (999) 123-45-67") === false, "Американский код (+1)");
    console.assert(validatePhone("7 (999) 123-45-67") === false, "Код 7 без плюса");
    console.assert(validatePhone("9 (999) 123-45-67") === false, "Код 9");
    console.assert(validatePhone("+77 (999) 123-45-67") === false, "Двойная 7 после плюса");
    console.assert(validatePhone("+78 (999) 123-45-67") === false, "Два символа после плюса");
    
    // Неправильное количество цифр
    console.assert(validatePhone("+7 (99) 123-45-67") === false, "Код оператора из 2 цифр");
    console.assert(validatePhone("+7 (9999) 123-45-67") === false, "Код оператора из 4 цифр");
    console.assert(validatePhone("+7 (999) 12-45-67") === false, "Первая группа из 2 цифр");
    console.assert(validatePhone("+7 (999) 1234-45-67") === false, "Первая группа из 4 цифр");
    console.assert(validatePhone("+7 (999) 123-4-67") === false, "Вторая группа из 1 цифры");
    console.assert(validatePhone("+7 (999) 123-456-67") === false, "Вторая группа из 3 цифр");
    console.assert(validatePhone("+7 (999) 123-45-6") === false, "Последняя группа из 1 цифры");
    console.assert(validatePhone("+7 (999) 123-45-678") === false, "Последняя группа из 3 цифр");
    console.assert(validatePhone("+7 (999) 123-45-6789") === false, "Слишком длинный номер");
    console.assert(validatePhone("+7 (999) 123") === false, "Слишком короткий номер");
    
    // Пробелы в неправильных местах
    console.assert(validatePhone(" +7 (999) 123-45-67") === false, "Пробел в начале");
    console.assert(validatePhone("+7 (999) 123-45-67 ") === false, "Пробел в конце");
    console.assert(validatePhone("+7  (999) 123-45-67") === false, "Двойной пробел");
    console.assert(validatePhone("+7 (999)  123-45-67") === false, "Двойной пробел после скобки");
    console.assert(validatePhone("+7 (999) 123-45--67") === false, "Двойной дефис");
    console.assert(validatePhone("+7 (999) 123--45-67") === false, "Двойной дефис в середине");
    
    // Неправильные скобки
    console.assert(validatePhone("+7 ((999)) 123-45-67") === false, "Двойные скобки");
    console.assert(validatePhone("+7 (999) (123) 45-67") === false, "Лишние скобки в середине");
    
    // Буквы и кириллица
    console.assert(validatePhone("+7 (999) 123-45-6a") === false, "Буква в конце");
    console.assert(validatePhone("+7 (99a) 123-45-67") === false, "Буква в коде оператора");
    console.assert(validatePhone("+7 (999) abc-45-67") === false, "Буквы вместо цифр");
    console.assert(validatePhone("+а (999) 123-45-67") === false, "Кириллический плюс");
    console.assert(validatePhone("+7 (999) 123-45-67а") === false, "Кириллическая буква в конце");
    
    // Специальные символы
    console.assert(validatePhone("+7 (999) 123-45-67!") === false, "Восклицательный знак в конце");
    console.assert(validatePhone("+7 (999) 123-45-67#") === false, "Решётка в конце");
    console.assert(validatePhone("+7 (999) 123-45-67*") === false, "Звёздочка в конце");
    console.assert(validatePhone("+7 (999) 123-45-67.") === false, "Точка в конце");
    console.assert(validatePhone("+7 (999) 123-45-67,") === false, "Запятая в конце");
    console.assert(validatePhone("+7 (999) 123/45/67") === false, "Слэши вместо дефисов");
    console.assert(validatePhone("+7 (999) 123_45_67") === false, "Подчёркивания вместо дефисов");
    
    // Неправильные разделители
    console.assert(validatePhone("+7 (999) 123.45.67") === false, "Точки вместо дефисов");
    console.assert(validatePhone("+7 (999) 123,45,67") === false, "Запятые вместо дефисов");
    console.assert(validatePhone("+7 (999) 123/45-67") === false, "Смешанные неправильные разделители");

    console.log("\n=== ТЕСТИРОВАНИЕ ТЕЛЕФОНА ЗАВЕРШЕНО ===\n");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();