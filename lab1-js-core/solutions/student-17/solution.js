'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных
    let a = "Хеллоу";
    let b = 17;
    let d = { name: "Саша" };
    let j = true;
    let n = null;
    let m;
    let r = [1, 2, 3];

    console.log("a - ", typeof a);
    console.log("b - ", typeof b);
    console.log("d - ", typeof d);
    console.log("j - ", typeof j);
    console.log("n - ", typeof n);
    console.log("m - ", typeof m);
    console.log("r - ", typeof r);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    let stud = 30;
    let sum = number + lab;
    let rev = sum % stud;
    return rev;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    let vr = number % variants;
    if (vr === 0) {
        vr = variants;
    }
    return vr;
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
        if (b === 0) {
            return "Деление на ноль";
        }
        return a / b;
    } else {
        return "Неизвестная операция";
    }
}
function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
        switch (figure) {
        case 'circle': {
            let radius = params[0];
            if (radius <= 0) {
                return "Радиус должен быть положительным";
            }
            return Math.PI * radius * radius;
        }
        case 'rectangle': {
            let width = params[0];
            let height = params[1];
            if (width <= 0 || height <= 0) {
                return "Стороны должны быть положительными";
            }
            return width * height;
        }
        case 'triangle': {
            let base = params[0];
            let height = params[1];
            if (base <= 0 || height <= 0) {
                return "Основание и высота должны быть положительными";
            }
            return 0.5 * base * height;
        }
        default:
            return "Неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    let r = "";
    for (let i = str.length - 1; i >= 0; i--) {
        r = r + str[i];
    }
    return r;
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    let random = Math.random();
    let res = Math.floor(random * (max - min + 1)) + min;
    return res;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    title: "Убийство в «Восточном экспрессе»",
    author: "Агата Кристи",
    year: 1933,
    pages: 317,
    isAvailable: true,

    getInfo: function() {
        let info = "Книга: " + this.title + ", автор: " + this.author +
                   ", год: " + this.year + ", страниц: " + this.pages;
        return info;
    },

    toggleAvailability: function() {
        if (this.isAvailable === true) {
            this.isAvailable = false;
        } else {
            this.isAvailable = true;
        }
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
            sum = sum + this.grades[subject];
            count = count + 1;
        }
        if (count === 0) {
            return 0;
        }
        return sum / count;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        if (subject === "" || typeof subject !== "string") {
            return "Пустое название";
        }
        if (typeof grade !== "number" || grade < 0 || grade > 100) {
            return "Нужно число от 0 до 100";
        }
        this.grades[subject] = grade;
        return "Сделано";
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
    numbers.forEach(function(num) {
        if (num > 50) {
            console.log(num);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    /*const squares =  ваш код */

    const squares = numbers.map(function(num) {
        return num * num;
    });
    console.log("Квадраты чисел - ", squares);

    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */

    const activeUsers = users.filter(function(user) {
        return user.isActive === true;
    });
    console.log("Активные пользователи - ", activeUsers);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */

    const victoria = users.find(function(user) {
        return user.name === "Виктория";
    });
    console.log("Виктория:", victoria);

    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */

    const sum = numbers.reduce(function(acc, num) {
        return acc + num;
    }, 0);
    console.log("Сумма - ", sum);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    /*const sortedByAge =  ваш код */

    const sortedByAge = users.slice().sort(function(a, b) {
        return b.age - a.age;
    });
    console.log("По возрасту(на убывание) - ", sortedByAge);


    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    /*const allAdults =  ваш код */

    const allAdults = users.every(function(user) {
        return user.age > 18;
    });
    console.log("Старше 18 - ", allAdults);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    /*const activeUserNames =  ваш код */

    const activeUserNames = users
        .filter(function(user) {
            return user.isActive === true;
        })
        .map(function(user) {
            return user.name;
        })
        .sort(function(a, b) {
            return a.localeCompare(b);
        });
    console.log("Имена активных по алфавиту - ", activeUserNames);
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],
    
    nextId: 4,

    addTask(title, priority = "medium") {
        // 5.1 Добавление задачи
        if (title === "" || typeof title !== "string") {
            return "Название пустое";
        }
        let newTask = {
            id: this.nextId,
            title: title,
            completed: false,
            priority: priority
        };
        this.nextId = this.nextId + 1;
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        let found = null;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === taskId) {
                found = this.tasks[i];
            }
        }
        if (found === null) {
            return "Задачи нет";
        }
        found.completed = true;
        return found;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === taskId) {
                let deleted = this.tasks[i];
                this.tasks.splice(i, 1);
                return deleted;
            }
        }
        return "Задачи нет";
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        let result = [];
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].completed === completed) {
                result.push(this.tasks[i]);
            }
        }
        return result;
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
       let total = this.tasks.length;
        let completed = 0;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].completed === true) {
                completed = completed + 1;
            }
        }
        let pending = total - completed;
        let rate = 0;
        if (total > 0) {
            rate = completed / total * 100;
        }
        let completionRate = rate.toFixed(2) + "%";
        return {
            total: total,
            completed: completed,
            pending: pending,
            completionRate: completionRate
        };
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
            this._year = year;
            Vehicle.vehicleCount = Vehicle.vehicleCount + 1;
        }

        // Добавьте метод displayInfo(), который выводит в консоль информацию
        // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
        displayInfo() {
            console.log("Марка: " + this.make + ", Модель: " + this.model + ", Год: " + this._year);
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            let now = new Date();
            let currentYear = now.getFullYear();
            return currentYear - this._year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            let now = new Date();
            let currentYear = now.getFullYear();
            if (newYear > currentYear) {
                console.log("Год не может быть больше текущего");
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
            return vehicle1.age - vehicle2.age;
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
            console.log("Количество дверей - " + this.numDoors);
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
            console.log("Ёмкость батареи - " + this.batteryCapacity + " кВт·ч");
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
    const createVehicleFactory = (vehicleType) => (make, model, year, ...extra) => {
    return new vehicleType(make, model, year, ...extra);
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
    if (typeof email !== "string") {
        return false;
    }
    if (email.length < 5) {
        return false;
    }
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

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");

    // Тест 4: классы и наследование
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Volkswagen', 'Жук', 1965);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    const car = new Car('Lamborghini', 'Aventador', 2020, 2);
    car.displayInfo();
    car.honk();

    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);

    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022, 4);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    console.log("Площадь круга:", calculateArea('circle', 5));
    console.log("Площадь прямоугольника:", calculateArea('rectangle', 4, 5));
    console.log("Площадь треугольника:", calculateArea('triangle', 6, 4));
    
    console.log("Переворот:", reverseString('hello'));
    console.log("toggleAvailability:", book.toggleAvailability());
    console.log("addGrade:", student.addGrade('physics', 88));

    console.log(`getVariant(16, 4) = ${getVariant(16, 4)}`);
    console.log(`getVariant(17, 4) = ${getVariant(17, 4)}`);
    console.log(`getVariant(18, 4) = ${getVariant(18, 4)}`);

    for (let i = 0; i < 5; i++) {
        const r = getRandomNumber(1, 10);
        console.log(`Случайное число: ${r}`);
        console.assert(r >= 1 && r <= 10, "getRandomNumber вышел за диапазон");
    }
    const addedTask = taskManager.addTask("Тестовая задача", "high");
    console.log(`Добавлена: id=${addedTask.id}, title=${addedTask.title}, priority=${addedTask.priority}`);
    console.assert(addedTask.completed === false, "Новая задача должна быть completed: false");
    console.assert(addedTask.priority === "high", "Приоритет должен быть high");

    const completedTask = taskManager.completeTask(addedTask.id);
    console.log(`Задача #${completedTask.id} completed = ${completedTask.completed}`);
    console.assert(completedTask.completed === true, "completeTask должен ставить completed: true");

    const doneTasks = taskManager.getTasksByStatus(true);
    const undoneTasks = taskManager.getTasksByStatus(false);
    console.log(`Выполненных: ${doneTasks.length}`);
    console.log(`Невыполненных: ${undoneTasks.length}`);
    console.assert(doneTasks.every(t => t.completed === true), "getTasksByStatus(true) вернул неверные задачи");
    console.assert(undoneTasks.every(t => t.completed === false), "getTasksByStatus(false) вернул неверные задачи");

    const carOld = new Vehicle('A', 'B', 2000);
    const carNew = new Vehicle('C', 'D', 2020);
    const diff = Vehicle.compareAge(carOld, carNew);
    console.log(`Разница в возрасте: ${diff} лет`);
    console.assert(diff === Math.abs(carOld.age - carNew.age), "compareAge вернул неверную разницу");
    const testCar = new Vehicle('Test', 'Model', 2015);
    console.log(`Год до изменения: ${testCar.year}`);
    testCar.year = 2010;
    console.log(`Год после изменения: ${testCar.year}`);
    console.assert(testCar.year === 2010, "Сеттер year не изменил год");
    testCar.year = 3000;
    console.log(`Год после попытки поставить 3000: ${testCar.year}`);
    console.assert(testCar.year === 2010, "Сеттер year должен отклонить год больше текущего");

    console.log(`"Passw0rd!" -> ${validatePassword("Passw0rd!")}`);
    console.log(`"password" -> ${validatePassword("password")}`);
    console.log(`"Pass1!" -> ${validatePassword("Pass1!")}`);

    console.log(`"+7 (999) 123-45-67" -> ${validatePhone("+7 (999) 123-45-67")}`);
    console.log(`"8 (999) 123-45-67" -> ${validatePhone("8 (999) 123-45-67")}`);
    console.log(`"89991234567" -> ${validatePhone("89991234567")}`);
    console.log(`"1234567890" -> ${validatePhone("1234567890")}`);


    console.log(`"15.05.2026" -> ${validateDate("15.05.2026")}`);
    console.log(`"01.01.1900" -> ${validateDate("01.01.1900")}`);
    console.log(`"32.01.2024" -> ${validateDate("32.01.2024")}`);
    console.log(`"15.13.2024" -> ${validateDate("15.13.2024")}`);

    simpleTask();

    processArrays();

    console.log("Статистика задач:", taskManager.getStats());
    console.log("book.getInfo():", book.getInfo());
    console.log("Средний балл:", student.getAverageGrade());

    console.log("Тесты email");
    console.log("test@example.com:", validateEmail("test@example.com"));
    console.log("plainaddress:", validateEmail("plainaddress"));
    console.log("user@domain:", validateEmail("user@domain"));
    console.log("a@b.cc:", validateEmail("a@b.cc"));
    console.log("user@.com:", validateEmail("user@.com"));


    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();