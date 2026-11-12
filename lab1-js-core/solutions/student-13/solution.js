'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных
    const name = "Акакий";
    const age = 20;
    const isStudent = true;
    let city;
    const book = { title: "JavaScript" };

    console.log(typeof name);
    console.log(typeof age);
    console.log(typeof isStudent);
    console.log(typeof city);
    console.log(typeof book);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return (number + lab - 1) % 30 + 1;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return (number - 1) % variants + 1;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return a / b;
        default:
            return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
     switch (figure) {
        case "circle":
            return Math.PI * params[0] * params[0];
        case "rectangle":
            return params[0] * params[1];
        case "triangle":
            return params[0] * params[1] / 2;
        default:
            return "Неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    return str.split("").reverse().join("");
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    return min + Math.random() * (max - min);
    //Math.random() выдаёт дробное число от 0 включительно до 1 не включительно.
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    year: 1943,
    pages: 96,
    available: true,
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    getInfo() {
        return `${this.title}, ${this.author}, ${this.year}, ${this.pages} стр.`;
    },
    // метод toggleAvailability - который меняет значение доступности и возвращает его
     toggleAvailability() {
        this.available = !this.available;
        return this.available;
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
        let sum = 0
        for (const grade of values){
            sum += grade;
        }
        return sum / values.length;
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

    numbers.forEach((number) => {
        if (number > 50) {
            console.log(number);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    /*const squares =  ваш код */
    const squares = numbers.map((number) => number * number);

    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */
    const activeUsers = users.filter((user) => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */
    const victoria = users.find((user) => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */
    const sum = numbers.reduce((total, number) => total + number, 0);

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
    const activeUserNames = users
        .filter((user) => user.isActive)
        .map((user) => user.name)
        .sort((a, b) => a.localeCompare(b, "ru"));

    // Возвращаем результаты для проверки в runTests().
    return { squares, activeUsers, victoria, sum, sortedByAge, allAdults, activeUserNames };
    

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
        const task = {
            id: this.nextId,
            title: title,
            completed: false,
            priority: priority
        };

        this.tasks.push(task);
        this.nextId += 1;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find((task) => task.id === taskId);

        if (task) {
            task.completed = true;
        }
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4 Ваш код здесь
        return this.tasks.filter((task) => task.completed === completed);
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
       const total = this.tasks.length;
        const completed = this.getTasksByStatus(true).length;
        const pending = total - completed;

        let completionRate = 0;

        if (total > 0) {
            completionRate = completed / total * 100;
        }

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
            // ..
            this.make = make;
            this.model = model;
            this.year = year;

            Vehicle.vehicleCount += 1;
        }
        
        // Добавьте метод displayInfo(), который выводит в консоль информацию
        // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
        displayInfo() {
            console.log(
                `Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`
            );
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            return new Date().getFullYear() - this.year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            if (newYear > new Date().getFullYear()) {
                throw new Error("Год выпуска не может быть больше текущего");
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
        return new vehicleType(make, model, year); // Замените {} на выражение
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
Номер варианта = (Ваш номер - 1) % Общее количество вариантов + 1
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



// ===== ТЕСТИРОВАНИЕ =====
// Сохраняем вывод функции, чтобы сравнить его с ожидаемым.
function captureOutput(action) {
    const output = [];
    const originalLog = console.log;
    console.log = (...args) => output.push(args.join(" "));
    try {
        action();
    } finally {
        console.log = originalLog;
    }
    return output;
}

// При неверном результате останавливаем тесты с объяснением.
function check(condition, message) {
    if (!condition) throw new Error(message);
}

function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");
    // Задание 1. Базовые операции
    check(captureOutput(simpleTask).join(",") === "string,number,boolean,undefined,object", "1: типы переменных");

    console.log("[ОК] Задание 1. Базовые операции");

    // Задание 2. Функции
    check(calculate(10, 5, "+") === 15, "2.3: сложение");
    check(getReviewerNumber(13, 1) === 14, "2.1: ревьюер студента 13");
    check(getReviewerNumber(29, 1) === 30, "2.1: последний ревьюер — 30, не 0");
    check(getReviewerNumber(30, 1) === 1, "2.1: переход к первому студенту");
    check(getVariant(4, 4) === 4, "2.2: последний вариант — 4, не 0");
    check(getVariant(13, 4) === 1, "2.2: вариант студента 13");
    check(calculate(10, 5, "-") === 5, "2.3: вычитание");
    check(calculate(10, 5, "*") === 50, "2.3: умножение");
    check(calculate(10, 5, "/") === 2, "2.3: деление");
    check(calculate(10, 5, "?") === "Неизвестная операция", "2.3: неизвестная операция");
    check(calculateArea("circle", 2) === Math.PI * 4, "2.4: площадь круга");
    check(calculateArea("rectangle", 4, 5) === 20, "2.4: площадь прямоугольника");
    check(calculateArea("triangle", 10, 4) === 20, "2.4: площадь треугольника");
    check(calculateArea("unknown", 2) === "Неизвестная фигура", "2.4: неизвестная фигура");
    check(reverseString("кот") === "ток", "2.5: переворот строки");
    check(reverseString("") === "", "2.5: пустая строка");
    const randomNumber = getRandomNumber(-5, 10);
    check(randomNumber >= -5 && randomNumber < 10, "2.5: случайное число в диапазоне");

    console.log("[ОК] Задание 2. Функции");

    // Задание 3. Объекты
    check(book.getInfo() === "Маленький принц, Антуан де Сент-Экзюпери, 1943, 96 стр.", "3.1: информация о книге");
    check(book.toggleAvailability() === false && book.available === false, "3.1: книга недоступна");
    check(book.toggleAvailability() === true && book.available === true, "3.1: книга снова доступна");
    check(student.getAverageGrade() === 90, "3.2: исходный средний балл");
    student.addGrade("physics", 100);
    check(student.grades.physics === 100 && student.getAverageGrade() === 92.5, "3.2: новая оценка");
    student.addGrade("math", 60);
    check(Object.keys(student.grades).length === 4 && student.getAverageGrade() === 85, "3.2: замена оценки");
    // Возвращаем исходные данные после проверки.
    student.grades.math = 90;
    delete student.grades.physics;

    console.log("[ОК] Задание 3. Объекты");

    // Задание 4. Массивы
    let arrays;
    const arrayOutput = captureOutput(() => { arrays = processArrays(); });
    check(arrayOutput.slice(1, 5).join(",") === "67,89,56,91", "4.1: вывод чисел больше 50");
    check(arrays.squares.join(",") === "144,2025,529,4489,1156,7921,3136,8281,729,196", "4.2: квадраты");
    check(arrays.activeUsers.map(user => user.id).join(",") === "1,3,4", "4.3: активные пользователи");
    check(arrays.victoria.id === 3 && arrays.victoria.name === "Виктория", "4.4: поиск Виктории");
    check(arrays.sum === 458, "4.5: сумма чисел");
    check(arrays.sortedByAge.map(user => user.age).join(",") === "35,30,28,25,22", "4.6: убывание возраста");
    check(arrays.allAdults === true, "4.7: все старше 18");
    check(arrays.activeUserNames.join(",") === "Анна,Виктория,Григорий", "4.8: имена по алфавиту");

    console.log("[ОК] Задание 4. Массивы");

    // Задание 5. Менеджер задач
    check(taskManager.getStats().total === 3, "5.5: исходное количество задач");
    const savedTasks = taskManager.tasks.map(task => ({ ...task }));
    const savedNextId = taskManager.nextId;
    check(taskManager.getStats().completed === 1 && taskManager.getStats().pending === 2, "5.5: исходная статистика");
    taskManager.addTask("Тестовая задача");
    const addedTask = taskManager.tasks[3];
    check(taskManager.tasks.length === 4 && addedTask.id === 4, "5.1: добавление задачи");
    check(addedTask.title === "Тестовая задача" && addedTask.priority === "medium" && !addedTask.completed, "5.1: поля новой задачи");
    taskManager.completeTask(4);
    taskManager.completeTask(4);
    check(taskManager.getTasksByStatus(true).map(task => task.id).join(",") === "2,4", "5.2/5.4: завершение и выполненные задачи");
    check(taskManager.getTasksByStatus(false).map(task => task.id).join(",") === "1,3", "5.4: невыполненные задачи");
    check(taskManager.getStats().completionRate === 50, "5.5: половина выполнена");
    taskManager.deleteTask(2);
    check(taskManager.tasks.map(task => task.id).join(",") === "1,3,4", "5.3: удаление по id");
    taskManager.addTask("Срочная задача", "high");
    check(taskManager.tasks[3].id === 5 && taskManager.tasks[3].priority === "high", "5.1: уникальный id после удаления и заданный приоритет");
    taskManager.completeTask(999);
    taskManager.deleteTask(999);
    check(taskManager.tasks.length === 4 && taskManager.getStats().completed === 1, "5.2/5.3: неизвестный id");
    taskManager.tasks = [];
    check(JSON.stringify(taskManager.getStats()) === '{"total":0,"completed":0,"pending":0,"completionRate":0}', "5.5: пустой список");
    taskManager.tasks = savedTasks;
    taskManager.nextId = savedNextId;

    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);

    const car = new Car('Honda', 'Civic', 2018, 4);

    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);

    const testVehicle = new Vehicle('Test', 'Model', 2010);

    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);

    console.log("[ОК] Задание 5. Менеджер задач");

    // Задание 6. Классы и наследование
    check(testVehicle.age === new Date().getFullYear() - 2010, "6.1: возраст транспорта");
    check(vehicle.make === "Toyota" && vehicle.model === "Camry" && vehicle.year === 2015, "6.1: поля транспорта");
    check(captureOutput(() => vehicle.displayInfo()).join("\n") === "Марка: Toyota, Модель: Camry, Год: 2015", "6.1: вывод транспорта");
    check(car instanceof Vehicle && car.numDoors === 4, "6.2: наследование и двери");
    check(captureOutput(() => car.displayInfo()).join("\n") === "Марка: Honda, Модель: Civic, Год: 2018\nКоличество дверей: 4", "6.2: вывод автомобиля");
    check(captureOutput(() => car.honk()).join("") === "Beep beep!", "6.2: сигнал");
    check(electricCar instanceof Car && electricCar instanceof Vehicle && electricCar.batteryCapacity === 75, "6.3: наследование и батарея");
    check(captureOutput(() => electricCar.displayInfo()).join("\n") === "Марка: Tesla, Модель: Model 3, Год: 2020\nКоличество дверей: 4\nЁмкость батареи: 75 кВт·ч", "6.3: вывод электромобиля");
    check(electricCar.calculateRange() === 450, "6.3: запас хода");
    check(Vehicle.compareAge(car, electricCar) === 2 && Vehicle.compareAge(electricCar, car) === -2 && Vehicle.compareAge(car, car) === 0, "6.1: разница возрастов");
    const currentYear = new Date().getFullYear();
    vehicle.year = currentYear;
    check(vehicle.year === currentYear && vehicle.age === 0, "6.1: изменение года и возраста");
    let futureYearRejected = false;
    try {
        vehicle.year = currentYear + 1;
    } catch (error) {
        futureYearRejected = true;
    }
    check(futureYearRejected && vehicle.year === currentYear, "6.1: будущий год отклонён без изменения объекта");
    check(Vehicle.vehicleCount === 5 && Vehicle.getTotalVehicles() === 5, "6.4: общий счётчик");

    console.log("[ОК] Задание 6. Классы и наследование");

    // Задание 7. Каррирование
    const factory = createVehicleFactory(Vehicle);
    check(typeof factory === "function" && Vehicle.getTotalVehicles() === 5, "7: выбор класса не создаёт объект");
    const factoryVehicle = factory("Test", "Factory", 2021);
    check(factoryVehicle instanceof Vehicle && factoryVehicle.make === "Test" && factoryVehicle.model === "Factory" && factoryVehicle.year === 2021, "7: объект выбранного класса");
    const secondVehicle = factory("Other", "Model", 2022);
    check(secondVehicle !== factoryVehicle && Vehicle.getTotalVehicles() === 7, "7: повторное использование фабрики");
    check(myNewCar instanceof Car && myNewCar.make === "BMW" && myNewCar.year === 2022, "7: фабрика автомобиля");

    console.log("[ОК] Задание 7. Каррирование");

    // Задание 8. Регулярные выражения
    // Правильные адреса
    check(validateEmail("user@example.com") === true, "Обычный email");
    check(validateEmail("a@b.co") === true, "Короткий email");
    check(validateEmail("Anna09._%+-@mail-test.example.COM") === true, "Разрешённые символы и поддомен");
    // Отсутствующие части
    check(validateEmail("") === false, "Пустая строка");
    check(validateEmail("userexample.com") === false, "Нет @");
    check(validateEmail("user@@example.com") === false, "Двойной @");
    check(validateEmail("@example.com") === false, "Нет имени");
    check(validateEmail("user@.com") === false, "Нет имени домена");
    // Неправильное окончание
    check(validateEmail("user@example.c") === false, "Окончание слишком короткое");
    check(validateEmail("user@example.c2") === false, "Цифра в окончании");

    // Запрещённые символы
    check(validateEmail("user name@example.com") === false, "Пробел в имени");
    check(validateEmail("анна@example.com") === false, "Кириллица в имени");
    check(validateEmail("user@my_mail.com") === false, "Подчёркивание в домене");
    check(validateEmail(" user@example.com") === false, "Пробел в начале");

    check(validateEmail("user@example") === false, "Нет точки в домене");
    check(validateEmail("user@example.") === false, "Нет окончания домена");
    check(validateEmail("user!@example.com") === false, "Запрещённый символ в имени");
    check(validateEmail("user@почта.com") === false, "Кириллица в домене");
    check(validateEmail("user@example.рф") === false, "Кириллица в окончании");
    check(validateEmail("user@my mail.com") === false, "Пробел в домене");
    check(validateEmail("user@example.com ") === false, "Пробел в конце");
    // Фиксируем особенности исходного regex, не изменяя его.
    check(validateEmail("us..er@example.com") === true, "Исходный regex допускает двойные точки в имени");
    check(validateEmail("user@exam..ple.com") === true, "Исходный regex допускает двойные точки в домене");
    check(validateEmail("user@-example.com") === true, "Исходный regex допускает дефис в начале домена");

    console.log("[ОК] Задание 8. Регулярные выражения");
    console.log("Все тесты пройдены.");
}

runTests();
