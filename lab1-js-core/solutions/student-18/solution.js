'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let boo = true;
    const value = null;
    let obj = {};
    let defined = undefined;
    let numb = 42;
    let bi = 90071992547409922n;
    const str = "Привет";
    const sym = Symbol("n");
    // 1.2 Выведите типы всех переменных
    console.log("type:", typeof boo);
    console.log("type null:", typeof value === 'object' && value === null);
    console.log("tybe object:", typeof obj === 'object' && obj !== 'null');
    console.log("type:", typeof defined);
    console.log("type:", typeof numb);
    console.log("type:", typeof bi);
    console.log("type:", typeof str);
    console.log("type:", typeof sym);
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
    switch(operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) return "Ошибка: На ноль делить нельзя";
            return a / b;
        default:
            return `Не удалось определить операцию: "${operation}"`;
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch(figure) {
        case "circle": {
            const [radius] = params;
            if (params.length !==1 || radius <= 0) {
                return "Ошибка: Требуется один положительный радиус";
            }
            return Math.PI * radius ** 2;
        }

        case "rectangle": {
            const [width, height] = params;
            if (params.length !== 2 || width <= 0 || height <= 0) {
                return "Ошибка: Требуется две положительные стороны";
            }
            return width * height;
        }

        case "triangle": {
            const [base, height] = params;
            if (params.length !== 2 || base <= 0 || height <= 0) {
                return "Ошибка: Требуется положительное основание и высота";
            }
            return (base * height) / 2;
        }

        default:
            return `Неизвестная фигура: ${figure}`;
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
    title: "Название книги",
    author: "Имя автора",
    year: 1950,
    pages: 250,
    isAvailable: true,

    getInfo() {
        return `Название книги: "${this.title}", Имя автора: ${this.author}, Год выпуска: ${this.year}, Количество страниц: ${this.pages}`;
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
        const allGrades = Object.values(this.grades);

        let sum = 0;
        for (let i = 0; i < allGrades.length; i++) {
            sum += allGrades[i];
        }

        return sum / allGrades.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
        return `Добавлен предмет ${subject} с оценкой ${grade}`;
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
        const maxID = this.tasks.length > 0 
            ? Math.max(...this.tasks.map(t => t.id)) 
            : 0;
            
        const newTask = {
            id: maxID + 1,
            title: title,
            completed: false,
            priority: priority
        };
        
        this.tasks.push(newTask);
        return `Задача "${newTask.title}" добавлена, ID задачи: ${newTask.id}`;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            return `Задача "${task.title}" выполнена`;
        }
        return `Задача с ID ${taskId} не найдена`;
    },

    // Удаление задачи
    deleteTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        if (this.tasks.length < initialLength) {
            return `Задача с ID ${taskId} удалена`;
        }
        return `Задача с ID ${taskId} не найдена`;
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter(t => t.completed === completed);
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
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        return {
            total,
            completed,
            pending,
            completionRate: `${completionRate}%`
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
            this._year = year;
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
            if (newYear <= new Date().getFullYear()) this._year = newYear;
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
        constructor(make, model, year, numDoors) {
            super(make, model, year);
            this.numDoors = numDoors;
        }

        // Переопределите метод displayInfo() так, чтобы он также выводил количество дверей.
        // Используйте super.displayInfo() для вызова метода родителя.
        displayInfo() {
            super.displayInfo();
            console.log(`Дверей: ${this.numDoors}`);
        }

        // Добавьте метод honk(), который выводит "Beep beep!".
        honk() {
            console.log("Бибип (сигналит типа)");
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
            console.log(`Батарея: ${this.batteryCapacity} кВт·ч`);
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
    console.log();

    // Тест 1: getReviewerNumber & getVariant
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.log(`Ревьюер номер ${getReviewerNumber(18, 1)}`);
    console.log(`Вариант номер ${getVariant(18, 4)}`);
    console.log();
    simpleTask();
    console.log();
    processArrays();
    console.log();

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест калькулятора (-) провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест калькулятора (*) провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора (/) провален");
    console.assert(calculate(10, 0, '/') === "Ошибка: На ноль делить нельзя", "Тест деления на ноль провален");
    console.assert(calculate(10, 5, '%') === 'Не удалось определить операцию: "%"', "Тест неверной операции провален");
    
    console.assert(calculateArea("circle", 10) === Math.PI * 100, "Тест площади круга провален");
    console.assert(calculateArea("rectangle", 5, 3) === 15, "Тест площади прямоугольника провален");
    console.assert(calculateArea("triangle", 6, 4) === 12, "Тест площади треугольника провален");

    console.assert(calculateArea("circle", -5).includes("Ошибка"), "Тест отрицательного радиуса провален");
    console.assert(calculateArea("circle").includes("Ошибка"), "Тест круга без параметров провален");
    console.assert(calculateArea("rectangle", 5).includes("Ошибка"), "Тест нехватки сторон провален");
    console.assert(calculateArea("triangle", -6, 4).includes("Ошибка"), "Тест отрицательного основания тр-ка провален");
    console.assert(calculateArea("square", 5).includes("Неизвестная фигура"), "Тест неизвестная фигура провален");
    
    console.log(`Рандомное число: ${getRandomNumber(1, 100)}`);
    console.log();
    console.assert(reverseString("hello") === "olleh", "reverseString провален");
    console.assert(reverseString("") === "", "reverseString пустой строки провален");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    
    taskManager.addTask("Новая тестовая задача", "low");
    console.assert(taskManager.getStats().total === 4, "Добавление задачи провалено");
    
    taskManager.completeTask(1);
    console.assert(taskManager.getStats().completed === 2, "Завершение задачи провалено");
    
    taskManager.deleteTask(4);
    console.assert(taskManager.getStats().total === 3, "Удаление задачи провалено");

    console.assert(
        book.getInfo() === 'Название книги: "Название книги", Имя автора: Имя автора, Год выпуска: 1950, Количество страниц: 250', "book.getInfo провален"
    );
    console.assert(book.toggleAvailability() === false, "book.toggleAvailability false провален");
    console.assert(book.toggleAvailability() === true, "book.toggleAvailability true провален");
    console.assert(student.getAverageGrade() === 90, "student.getAverageGrade провален");
    console.assert(
        student.addGrade("physics", 88) === "Добавлен предмет physics с оценкой 88",
        "student.addGrade провален"
    );

    // Тест 4: классы и наследование
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);
    console.log();
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();
    console.log();
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);
    console.log();
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');
    
    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();
    console.log();
    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());
    console.assert(Vehicle.getTotalVehicles() === 5, "Тест getTotalVehicles провален");
    console.assert(Vehicle.compareAge(vehicle, testVehicle) === 5, "Тест Vehicle.compareAge провален");

    vehicle.year = 2020;
    console.assert(vehicle.year === 2020, "Тест валидного знач-я провален");
    vehicle.year = 3000; // дб заигнорено
    console.assert(vehicle.year === 2020, "Тест невалид. знач-я провален");

    console.assert(electricCar.calculateRange() === 450, "Тест электр. кар провален");

    // Тест 5: taskManager
    taskManager.addTask("Новая тестовая задача", "low");
    console.assert(taskManager.getStats().total === 4, "Добавление задачи провалено");
    
    taskManager.completeTask(1);
    console.assert(taskManager.getStats().completed === 2, "Завершение задачи провалено");
    
    const pendingTasks = taskManager.getTasksByStatus(false);
    console.assert(pendingTasks.length === 2, "Фильтрация по статусу провалена");
    
    taskManager.deleteTask(4);
    console.assert(taskManager.getStats().total === 3, "Удаление задачи провалено");
    
    // Тест 6: Массивы
    const testNumbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];
    const testUsers = [
        { id: 1, name: "Анна", age: 25, isActive: true },
        { id: 2, name: "Борис", age: 30, isActive: false }
    ];
    
    console.assert(testNumbers.map(n => n ** 2)[0] === 144, "Тест массивов map провален");
    console.assert(testNumbers.filter(n => n > 50).length === 4, "Тест массивов filter провален");
    console.assert(testNumbers.reduce((acc, n) => acc + n, 0) === 458, "Тест массивов reduce провален");
    console.assert(testUsers.every(u => u.age > 18) === true, "Тест массивов every провален");
    console.assert(testUsers.find(u => u.name === "Анна").id === 1, "Тест массивов find провален");
    
    // Тест 7: Регулярные выражения
    console.assert(validateEmail("test@example.com") === true, "Тест Regex: валидный email провален");
    console.assert(validateEmail("invalid-email") === false, "Тест Regex: невалидный email провален");
    
    console.assert(validatePassword("StrongPass1!") === true, "Тест Regex: валидный пароль провален");
    console.assert(validatePassword("weakpass") === false, "Тест Regex: невалидный пароль провален");
    
    console.assert(validatePhone("+79991234567") === true, "Тест Regex: валидный номер телефона провален");
    console.assert(validatePhone("+7(999)123-45-67") === true, "Тест Regex: валидный номер телефона провален");
    console.assert(validatePhone("89991234567") === true, "Тест Regex: валидный номер телефона провален");
    console.assert(validatePhone("1234567890") === false, "Тест Regex: невалидный телефон провален");
    
    console.assert(validateDate("25.12.2023") === true, "Тест Regex: валидная дата провалена");
    console.assert(validateDate("32.01.2023") === false, "Тест Regex: невалидная дата (день) провалена");
    console.assert(validateDate("15.13.2023") === false, "Тест Regex: невалидная дата (месяц) провалена");
    
    console.log();
    console.log("Все тесты пройдены! ✅");  
}

// Запуск тестов
runTests();