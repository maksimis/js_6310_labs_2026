'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let num = 99;
    let str = 'morning' ;
    let bool = true;
    let zero = null;
    let empty;
    let array = ['one', 'two', 'three'];
    let data = new Date(2026, 5, 8); //так как месяцы с 0, сентябрь по счету 8-ой месяц
    
    // 1.2 Выведите типы всех переменных
    console.log('тип данных number - ', num);
    console.log('тип данных string - ', str);
    console.log('тип данных boolean - ', bool);
    console.log('тип данных null - ', zero);
    console.log('тип данных undefined - ', empty);
    console.log('тип данных array - ', array);
    console.log('тип данных date - ', data);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    const result = (number + lab) % 30;
    return result;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    //есть колво варинатов, я знаю свой порядковый номер
    //надо поделить мой номер нацело , если остаток 0 - то мой вариант это колво вариантов, 
    // если не 0 - то мой вариант это остаток
    const result = (number % variants == 0) ? variants : number % variants;
    return result
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    let result = 0;
    if (operation == '+') result = a + b;
    else if (operation == '-') result = a - b;
    else if (operation == '*') result = a*b;
    else result = a/b;
    return result;
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    let area = 0;
    switch (figure) {
        case 'circle':
            //ожидаем одно число - радиус
            area = Math.PI*(params[0]**2);
            return area;

        case 'rectangle':
            //ожидаем два числа
            area = params.reduce((acc, n) => acc*n, 1);
            return area;
        
        case 'triangle':
            //ожидаем три числа - строны трегольника, 
            // найдем площадь по формуле Герона через полупериметр
            let [a, b, c] = params;
            const p = (a + b + c)/2;
            area = Math.sqrt(p*(p - a)*(p - b)*(p -c));
            return area
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    //так как строка - не изменяемый тип данных, переведем символы в массив и реверснем его
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    //единственный встроенный генератор Math.random() возвращает рандомное от 0 до 1
    //так как нам нужен диапазон от min до max, то будем умножать на (max - min +1)
    //для того чтобы понять на какое число из нашего конкретного диапазона указывает рандомно выпавшее число на диапазоне от 0 до 1
    return Math.floor(Math.random()*(max - min + 1)) + min; //+min для того чтобы сдвинуть границы от 0 до нашей нижней границы

};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    title : 'Dracula',
    author : 'Bram Stoker',
    year : 1897,
    pages : 390,
    availability : true,

    getInfo(){
        let answer = `Книга ${this.title}, ${this.pages} страниц, написанная писателем ${this.author} в ${this.year} году`;
        return answer;
    },

    toggleAvailability(){
        this.availability = !this.availability;
        if (this.availability == true) return console.log('Книга доступна для чтения');
        else console.log('К сожалению, книга недоступна');
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
        let grade = 0;
        let i = 0;
        for (let key in this.grades){
            grade += this.grades[key];
            i++;
        }
        return grade/i;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
        console.log(`Добавлен новый предмет ${subject} и оценка по нему ${grade}`);
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
    numbers.forEach((n) => {
        if (n > 50) console.log(` ${n},`);
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares =  numbers.map(n => n**2);
    console.log(squares);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers =  users.filter(user => user.isActive == true);
    console.log(activeUsers);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria =  users.find(user => user.name == "Виктория");
    console.log(`ID пользователя с именем "Виктория" - ${victoria.id}`);

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, n) => acc + n, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age >= 18);
    //every() встроенный метод и возвращает true если ВСЕ соответствуют условию
    // some()возвращает true если хотя бы один соответствует

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(user => user.isActive) //массив с только активными
        .map(user => user.name) //массив с именами только активных
        .sort() //массив с отсортированными именами только активных пользователей
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
        const new_id = this.tasks.length > 0 ? Math.max(this.tasks.map(n => n.id)) + 1 : 1;
        const newTask = {
            id : new_id,
            title : title,
            completed : false,
            priority : priority
        }
        this.tasks.push(newTask);

    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(n => n.id == taskId);
        if (task) task.completed = true; //проверяем нашелся ли id 
    },

    // Удаление задачи
    deleteTask(taskId) {
        //отфильтруем задачи по id, таким образом та которую нужно удалить не запишется в отфильтрованный список
        this.tasks = this.tasks.filter (n => n.id != taskId);
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        //также отфильтруем по критерию завершения задачи
        this.tasks = this.tasks.filter(n => n.completed == completed);
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
       const total = this.tasks.length;
       const completed = this.tasks.filter(n => n.complete).length;
       const pending = total - completed;
       const completionRate = total == 0 ? 0 : (completed/total) * 100;

       const stats = {
       total : total,
       completed : completed,
       pending : pending,
       completionRate : completionRate
       };
       return stats;
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    // В конструкторе принимайте и сохраняйте в this свойства:
    // make (марка), model (модель), year (год выпуска).
    class Vehicle {
        static vehicleCount = 0;
        //сохраняем свойства и увеличиваем кол-во объектов на 1 при создании нового
        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this._year = year;
            Vehicle.vehicleCount ++;
        }

        // Добавьте метод displayInfo(), который выводит в консоль информацию
        // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
        displayInfo() {
            console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            const current_year = new Date().getFullYear();
            return current_year - this._year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            const NewYear = newYear <= this._year ? newYear : 0;
            NewYear == 0 ? console.log("Новый год выпуска не может быть больше текущего") : console.log(`Установлен новый год выпуска - ${NewYear}`);
        }

        get year() {
            return this._year;
        }

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1._year - vehicle2._year);
        }

        static getTotalVehicles(){
            return Vehicle.vehicleCount;
        }

        // 6.4 Статические методы и свойства
        // Добавьте статическое свойство vehicleCount в класс Vehicle
        // для подсчета количества созданных транспортных средств.
        // (добавьте в конструктор: Vehicle.vehicleCount++;)
        // Создайте статический метод getTotalVehicles(),
        // который возвращает общее количество созданных транспортных средств.
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
            console.log(`Количество дверей в машине ${this.numDoors}`);
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
            super(make, model, year,numDoors );
            this.batteryCapacity = batteryCapacity;
        }

        // Переопределите метод displayInfo() для вывода дополнительной информации о батарее.
        displayInfo() {
            super.displayInfo();
            console.log(`Заряд батареи состовляет ${this.batteryCapacity}кВт·ч`);
        }

        // Добавьте метод calculateRange(), который рассчитывает примерный запас хода
        // (предположим, что 1 кВт·ч = 6 км).
        calculateRange() {
            return this.batteryCapacity*6;
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

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    // Тест 3.1: addTask
    const lengthBefore = taskManager.tasks.length;
    taskManager.addTask("Новая задача");
    console.assert(taskManager.tasks.length === lengthBefore + 1, "Тест на добавление задачи провален");

    // Тест 3.2: completeTask
    taskManager.completeTask(1);
    console.assert(taskManager.tasks.find(t => t.id === 1).completed === true, "Тест на завершение задачи провален");

    // Тест 3.3: deleteTask
    const lenBeforeDelete = taskManager.tasks.length;
    taskManager.deleteTask(1);
    console.assert(taskManager.tasks.length === lenBeforeDelete - 1, "Тест на удаление задачи провален");

    // Тест 3.4: getStats
    const stats = taskManager.getStats();
    console.assert(stats.total === taskManager.tasks.length, "Тест на проверку длины массива провелен");
    console.assert(typeof stats.completionRate === 'number', "Тест на проверку объема завершенных задач провелен");

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

    // Тест 4.1: Vehicle - конструктор и age
    const v1 = new Vehicle('Toyota', 'RAV4', 2015);
    console.assert(v1.make === 'Toyota' && v1.model === 'RAV4', "Тест на создание объекта класса провлен");
    console.assert(v1.age === (new Date().getFullYear() - 2015), "Тест на проверку возраста машины провален");

    // Тест 4.2: сеттер year (проверка что нельзя поставить год больше текущего)
    const yearBefore = v1.year;
    v1.year = 2106; // заведомо невалидный год 
    console.assert(v1.year === yearBefore, "Проверка на обновление года провалена");

    // Тест 4.3: Car - numDoors и honk 
    const c1 = new Car('Ford', 'Mustang', 2020, 2);
    console.assert(c1.numDoors === 2, "Проверка на количество дверей провалена");

    // Тест 4.4: ElectricCar - calculateRange
    const ec1 = new ElectricCar('Tesla', 'Model2', 2020, 4, 75);
    console.assert(ec1.calculateRange() === 75 * 6, "Проверка на мощность хода провалена");

    // Тест 4.5: compareAge
    console.assert(Vehicle.compareAge(v1, c1) === Math.abs(v1.year - c1.year), "Проверка на сравнение возраста машин провалена");

    // Тест 4.6: getTotalVehicles 
    const countBefore = Vehicle.getTotalVehicles();
    const v2 = new Vehicle('Jeep', 'Sahara', 2019);
    console.assert(Vehicle.getTotalVehicles() === countBefore + 1, "Проверка на количество транспортов провалена");

    // Тест 4.7: createVehicleFactory
    console.assert(myNewCar instanceof Car, "Тест на проверку класса провален");
    console.assert(myNewCar.make === 'BMW' && myNewCar.numDoors === undefined, "Тест на проверку добавления нового объекта провлен");



    //задание 8
    //проверка email
    console.assert(validateEmail("ivanov-ivan@mail.ru") === true, "Тест проверки почты провален");
    console.assert(validateEmail("ivanov-ivan.ru") === false, "Тест проверки почты провален");
    console.assert(validateEmail("ivanov-ivan@mail.") === false, "Тест проверки почты провален");
    console.assert(validateEmail("ivanov-ivan@mail.r") === false, "Тест проверки почты провален");

    //проверка password
    console.assert(validatePassword("Azazello777") === false, "Тест проверки пароля провален");
    console.assert(validatePassword("AZAZELLO@777") === false, "Тест проверки пароля провален");
    console.assert(validatePassword("azazello&777") === false, "Тест проверки пароля провален");
    console.assert(validatePassword("Azazello@!") === false, "Тест проверки пароля провален");
    console.assert(validatePassword("Azz*1") === false, "Тест проверки пароля провален");
    console.assert(validatePassword("Azazello*777") === true, "Тест проверки пароля провален");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();