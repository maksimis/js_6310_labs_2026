'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    // 1.2 Выведите типы всех переменных

    const number = 42;
    const string = "JavaScript";
    const boolean = true;
    const object = {name: "Анна"};
    const array = [1, 2, 3];
    const nothing = null;
    const undefinedValue = undefined;

    console.log("Тип number:", typeof number);
    console.log("Тип string:", typeof string);
    console.log("Тип boolean:", typeof boolean);
    console.log("Тип object:", typeof object);
    console.log("Тип array:", typeof array);
    console.log("Тип null:", typeof nothing);
    console.log("Тип undefined:", typeof undefinedValue);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    let groupSize = 30;

    let otvet= (lab + number) % groupSize;

    if (otvet == 0) {
        return groupSize;
    } else {
        return otvet;
    }
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
            if (b === 0) return "Деление на ноль";
            return a / b;
        default:
            return "Неизвестная операция";
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'triangle':
            if (params.length < 2) {
                console.log("Ошибка: для треугольника нужно 2 числа!");
                return "Ошибка";
            }
            // Проверяем, что числа положительные
            if (params[0] <= 0 || params[1] <= 0) {
                console.log("Ошибка: стороны должны быть больше 0!");
                return "Ошибка";
            }
            return 0.5 * (params[0]*params[1]);
        case 'rectangle':
            if (params.length < 2) {
                console.log("Ошибка: для прямоугольника нужно 2 числа!");
                return "Ошибка";
            }
            if (params[0] <= 0 || params[1] <= 0) {
                console.log("Ошибка: стороны должны быть больше 0!");
                return "Ошибка";
            }
            return params[0]*params[1];
        case 'circle':
            if (params.length < 1) {
                console.log("Ошибка: для круга нужно ввести радиус!");
                return "Ошибка";
            }
            if (params[0] <= 0) {
                console.log("Ошибка: радиус должен быть больше 0!");
                return "Ошибка";
            }
            return Math.PI * params[0]*params[0];

        default:
            console.log("Ошибка: неизвестная фигура!");
            return "Неизвестная фигура";
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    let revStr = "";
    for (let i = str.length - 1; i >= 0; i--) {
        revStr = revStr + str[i];
    }
    return revStr;
};

const getRandomNumber = (min, max) => {
    let sluchaynoe = Math.random();

    let raznica = max - min;

    let itog = Math.floor(sluchaynoe * raznica) + min;

    return itog;
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    title: "Мастер и Маргарита",
    author: "М.А. Булгаков",
    year: 1967,
    pages: 480,
    isAvailable: true,

    getInfo() {
        return `Название: "${this.title}", Автор: ${this.author}, Год: ${this.year}, Страниц: ${this.pages}`;
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
        let gradesArray = Object.values(this.grades);
        for (let i = 0; i < gradesArray.length; i++) {
            sum += gradesArray[i];
        }
        return sum / gradesArray.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        if (!subject || subject.trim() === "") {
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
    numbers.forEach(num => {
        if (num > 50) {
            console.log(num);
        }
    });

    // 2. Используйте map для создания массива квадратов чисел
    /*const squares =  ваш код */
    const squares = numbers.map(num => num ** 2);

    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */
    const activeUsers = users.filter(user => user.isActive);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */
    const victoria = users.find(user => user.name === "Виктория");

    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */
    const sum = numbers.reduce((acc, num) => acc + num, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    /*const sortedByAge =  ваш код */
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    /*const allAdults =  ваш код */
    const allAdults = users.every(user => user.age > 18);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    /*const activeUserNames =  ваш код */
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
        const maxId = this.tasks.reduce((max, task) => task.id > max ? task.id : max, 0);
        const newTask = {
            id: maxId + 1,
            title: title,
            completed: false,
            priority: priority
        };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find((task) => task.id === taskId);
        if (!task) {
            return null;
        }
        task.completed = true;
        return task;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        const index = this.tasks.findIndex((task) => task.id === taskId);
        if (index === -1) {
            return false;
        }
        this.tasks.splice(index, 1);
        return true;
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
        const completed = this.tasks.filter((task) => task.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : completed / total;
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
            console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
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
    const createVehicleFactory = (VehicleClass) => (...args) => {
        return new VehicleClass(...args);
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
 * Вариант 3: Валидация номера телефона (российский формат)
 * Поддерживает форматы:
 * - +7 (999) 123-45-67
 * - 8 (999) 123-45-67
 * - 89991234567
 * - +7(999)123-45-67
 */
function validatePhone(phone) {
    const phoneRegex = /^(?:\+7|8)(?:[\s-]?\(\d{3}\)|[\s-]?\d{3})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    return phoneRegex.test(phone);
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(27, 1) === 28, "Тест получения ревьюера (студент 27) провален");

    // Тест 2: getVariant
    console.assert(getVariant(27, 4) === 3, "Тест getVariant провален");
    console.assert(getVariant(28, 4) === 4, "Тест getVariant (кратный) провален");
    console.assert(getVariant(5, 10) === 5, "Тест getVariant (меньше variants) провален");

    // Тест 3: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора (+) провален");
    console.assert(calculate(10, 5, '-') === 5, "Тест калькулятора (-) провален");
    console.assert(calculate(10, 5, '*') === 50, "Тест калькулятора (*) провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора (/) провален");
    console.assert(calculate(10, 0, '/') === "Деление на ноль", "Тест деления на ноль провален");
    console.assert(calculate(10, 5, '%') === "Неизвестная операция", "Тест неизвестной операции провален");

    // Тест 4: calculateArea
    console.assert(calculateArea('circle', 5) === Math.PI * 25, "Тест площади круга провален");
    console.assert(calculateArea('rectangle', 4, 6) === 24, "Тест площади прямоугольника провален");
    console.assert(calculateArea('triangle', 4, 6) === 12, "Тест площади треугольника провален");
    console.assert(calculateArea('square', 4) === "Неизвестная фигура", "Тест неизвестной фигуры провален");

    // Тест 5: reverseString
    console.assert(reverseString('hello') === 'olleh', "Тест reverseString провален");
    console.assert(reverseString('') === '', "Тест reverseString (пустая строка) провален");

    // Тест 6: getRandomNumber
    const rnd = getRandomNumber(1, 10);
    console.assert(rnd >= 1 && rnd <= 10, "Тест getRandomNumber провален");
    const rnd2 = getRandomNumber(5, 5);
    console.assert(rnd2 === 5, "Тест getRandomNumber (min === max) провален");

    // Тест 7: book
    console.assert(book.getInfo().includes("Мастер и Маргарита"), "Тест book.getInfo провален");
    console.assert(book.toggleAvailability() === false, "Тест book.toggleAvailability (1) провален");
    console.assert(book.toggleAvailability() === true, "Тест book.toggleAvailability (2) провален");

    // Тест 8: student
    console.assert(student.getAverageGrade() === 90, "Тест student.getAverageGrade провален");
    console.assert(student.addGrade("physics", 88) === "Сделано", "Тест student.addGrade (успех) провален");
    console.assert(student.addGrade("", 50) === "Пустое название", "Тест student.addGrade (пустое имя) провален");
    console.assert(student.addGrade("chemistry", 150) === "Нужно число от 0 до 100", "Тест student.addGrade (некорректная оценка) провален");

    // Тест 9: processArrays (вызов для демонстрации)
    processArrays();

    // Тест 10: taskManager.getStats
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager.getStats (total) провален");
    console.assert(taskManager.getStats().completed === 1, "Тест taskManager.getStats (completed) провален");
    console.assert(taskManager.getStats().pending === 2, "Тест taskManager.getStats (pending) провален");

    // Тест 11: taskManager.addTask
    const beforeAdd = taskManager.getStats().total;
    const newTask = taskManager.addTask("Тестовая задача", "low");
    console.assert(taskManager.getStats().total === beforeAdd + 1, "Тест taskManager.addTask (total) провален");
    console.assert(newTask.title === "Тестовая задача", "Тест taskManager.addTask (title) провален");
    console.assert(newTask.priority === "low", "Тест taskManager.addTask (priority) провален");
    console.assert(newTask.completed === false, "Тест taskManager.addTask (completed) провален");

    // Тест 12: taskManager.completeTask
    const completedTask = taskManager.completeTask(newTask.id);
    console.assert(completedTask !== null, "Тест taskManager.completeTask (найден) провален");
    console.assert(completedTask.completed === true, "Тест taskManager.completeTask (статус) провален");
    console.assert(taskManager.completeTask(9999) === null, "Тест taskManager.completeTask (не найден) провален");

    // Тест 13: taskManager.getTasksByStatus
    console.assert(Array.isArray(taskManager.getTasksByStatus(true)), "Тест getTasksByStatus (массив) провален");
    console.assert(taskManager.getTasksByStatus(true).length === 2, "Тест getTasksByStatus (completed=true) провален");
    console.assert(taskManager.getTasksByStatus(false).length === 2, "Тест getTasksByStatus (completed=false) провален");

    // Тест 14: taskManager.deleteTask
    const beforeDelete = taskManager.getStats().total;
    console.assert(taskManager.deleteTask(1) === true, "Тест taskManager.deleteTask (успех) провален");
    console.assert(taskManager.getStats().total === beforeDelete - 1, "Тест taskManager.deleteTask (total) провален");
    console.assert(taskManager.deleteTask(9999) === false, "Тест taskManager.deleteTask (не найден) провален");

    // Тест 15: классы и наследование
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

    // Тест 16: Vehicle.age
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), "Тест Vehicle.age провален");

    // Тест 17: Vehicle.year (сеттер с валидацией)
    const yearTest = new Vehicle('Year', 'Test', 2020);
    yearTest.year = 2050; // не должен измениться — год больше текущего
    console.assert(yearTest.year === 2020, "Тест сеттера year (не должен меняться) провален");
    yearTest.year = 2019; // должен измениться
    console.assert(yearTest.year === 2019, "Тест сеттера year (должен меняться) провален");

    // Тест 18: Vehicle.compareAge
    const v1 = new Vehicle('A', 'B', 2010);
    const v2 = new Vehicle('C', 'D', 2015);
    console.assert(Vehicle.compareAge(v1, v2) === 5, "Тест Vehicle.compareAge провален");
    console.assert(Vehicle.compareAge(v2, v1) === 5, "Тест Vehicle.compareAge (обратный порядок) провален");

    // Тест 19: Vehicle.getTotalVehicles
    console.assert(typeof Vehicle.getTotalVehicles() === 'number', "Тест Vehicle.getTotalVehicles провален");
    console.assert(Vehicle.getTotalVehicles() > 0, "Тест Vehicle.getTotalVehicles (больше нуля) провален");

    // Тест 20: createVehicleFactory (каррирование)
    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022, 4);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();
    console.assert(myNewCar instanceof Car, "Тест createVehicleFactory (Car) провален");
    console.assert(myNewCar.make === 'BMW', "Тест createVehicleFactory (make) провален");

    const createECarFactory = createVehicleFactory(ElectricCar);
    const myNewECar = createECarFactory('Nissan', 'Leaf', 2023, 4, 100);
    console.assert(myNewECar instanceof ElectricCar, "Тест createVehicleFactory (ElectricCar) провален");

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    // Тест 21: validatePhone (вариант 3 — твой)
    console.assert(validatePhone("+7 (999) 123-45-67") === true, "Тест телефона 1 провален");
    console.assert(validatePhone("8 (999) 123-45-67") === true, "Тест телефона 2 провален");
    console.assert(validatePhone("89991234567") === true, "Тест телефона 3 провален");
    console.assert(validatePhone("+7(999)123-45-67") === true, "Тест телефона 4 провален");
    console.assert(validatePhone("+79991234567") === true, "Тест телефона 5 провален");
    console.assert(validatePhone("abc") === false, "Тест телефона 6 провален");
    console.assert(validatePhone("") === false, "Тест телефона 7 провален");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();
