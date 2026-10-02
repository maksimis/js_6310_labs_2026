'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let number = 67;
    let string = "Это строка";
    let boolean = true;
    let nullValue = null;
    let array = [1, 2, 3];
    // 1.2 Выведите типы всех переменных
    console.log(typeof number);
    console.log(typeof string);
    console.log(typeof boolean);
    console.log(typeof nullValue);
    console.log(typeof array);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    const result = (number + lab) % 30;
    return result === 0 ? 30 : result;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    const result = number % variants;
    return result === 0 ? variants : result;    
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
        switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) {
                throw new Error("Деление на ноль");
            }
            return a / b;
        default:
            throw new Error("Неизвестная операция");
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
    case 'circle': {
        const radius = params[0];
        return Math.PI * radius * radius;
    }
    case 'rectangle': {
        const width = params[0];
        const height = params[1];
        return width * height;
    }
    case 'triangle': {
        const base = params[0];
        const height = params[1];
        return 0.5 * base * height;
    }
    default:
        throw new Error("Неизвестная фигура");
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
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    pages: 1225,
    available: true,
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    getInfo() {
        return `"${this.title}", ${this.author}, ${this.year} год, ${this.pages} стр.`;
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
        const sum = values.reduce((acc, grade) => acc + grade, 0);
        return values.length > 0 ? sum / values.length : 0;
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
    numbers.forEach(num => {
        if (num > 50) {
            console.log(num);
        }
    });
    // 2. Используйте map для создания массива квадратов чисел
    /*const squares =  ваш код */
    const squares = numbers.map(num => num * num);
    console.log("Квадраты:", squares);
    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */
    const activeUsers = users.filter(user => user.isActive);
    console.log("Активные пользователи:", activeUsers);
    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */
    const victoria = users.find(user => user.name === "Виктория");
    console.log("Виктория:", victoria);
    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("Сумма:", sum);
    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    /*const sortedByAge =  ваш код */
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log("Сортировка по возрасту:", sortedByAge);
    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => user.age > 18);
    console.log("Все старше 18:", allAdults);
    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();
    console.log("Имена активных пользователей:", activeUserNames);

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
        const maxId = this.tasks.length > 0
            ? Math.max(...this.tasks.map(t => t.id))
            : 0;
        const newTask = {
            id: maxId + 1,
            title,
            completed: false,
            priority
        };
        this.tasks.push(newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            return true;
        }
        return false;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3 Ваш код здесь
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        return this.tasks.length < initialLength;
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
        const completionRate = total > 0 ? completed / total : 0;

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
            return new Date().getFullYear() - this._year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            if (newYear <= new Date().getFullYear()) {
                this._year = newYear;
            } else {
                console.log("Год не может быть больше текущего.");
            }
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
    const createVehicleFactory = (vehicleType) => (make, model, year) => {
    return new vehicleType(make, model, year);
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
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
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

    //Тест 0
    simpleTask()

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

    // Тест 5: calculateArea
    console.log("Площадь круга (r=5):", calculateArea('circle', 5).toFixed(2));
    console.log("Площадь прямоугольника (5x10):", calculateArea('rectangle', 5, 10));
    console.log("Площадь треугольника (6x4):", calculateArea('triangle', 6, 4));

    // Тест 6: Стрелочные функции
    console.log("reverseString('Hello'):", reverseString('Hello'));
    console.log("getRandomNumber(1, 10):", getRandomNumber(1, 10));

    // Тест 7: book
    console.log(book.getInfo());
    console.log("Доступность до toggle:", book.available);
    book.toggleAvailability();
    console.log("Доступность после toggle:", book.available);

    // Тест 8: student
    console.log("Средний балл:", student.getAverageGrade());
    student.addGrade('physics', 88);
    console.log("Оценки после добавления:", student.grades);
    console.log("Новый средний балл:", student.getAverageGrade());

    // Тест 9: processArrays
    processArrays();

    // Тест 10: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    console.log("Статистика:", taskManager.getStats());
    taskManager.addTask("Новая задача", "low");
    console.log("После добавления:", taskManager.getStats());
    taskManager.completeTask(1);
    console.log("После выполнения задачи 1:", taskManager.getStats());
    console.log("Незавершенные задачи:", taskManager.getTasksByStatus(false));
    taskManager.deleteTask(2);
    console.log("После удаления задачи 2:", taskManager.getStats());
    
    // Тест 11
    console.assert(validateEmail('user@example.com') === true, "Email 1 провален");
    console.assert(validateEmail('test.user+tag@domain.co') === true, "Email 2 провален");
    console.assert(validateEmail('my-email_123@sub.domain.org') === true, "Email 3 провален");
    console.assert(validateEmail('invalid') === false, "Email без @ провален");
    console.assert(validateEmail('user@') === false, "Email без домена провален");
    console.assert(validateEmail('@domain.com') === false, "Email без имени провален");
    console.assert(validateEmail('user@domain') === false, "Email без точки в домене провален");
    console.assert(validateEmail('') === false, "Пустой email провален");
    
    console.assert(validatePassword('Pass123!') === true, "Password 1 провален");
    console.assert(validatePassword('StrongP@ssw0rd') === true, "Password 2 провален");
    console.assert(validatePassword('My$ecret9') === true, "Password 3 провален");
    console.assert(validatePassword('weak') === false, "Слишком короткий пароль провален");
    console.assert(validatePassword('alllowercase1!') === false, "Пароль без заглавной провален");
    console.assert(validatePassword('ALLUPPERCASE1!') === false, "Пароль без строчной провален");
    console.assert(validatePassword('NoDigitsHere!') === false, "Пароль без цифры провален");
    console.assert(validatePassword('NoSpecial123') === false, "Пароль без спецсимвола провален");
    
    console.assert(validatePhone('+7 (999) 123-45-67') === true, "Phone 1 провален");
    console.assert(validatePhone('8 (999) 123-45-67') === true, "Phone 2 провален");
    console.assert(validatePhone('89991234567') === true, "Phone 3 провален");
    console.assert(validatePhone('+7(999)123-45-67') === true, "Phone 4 провален");
    console.assert(validatePhone('12345') === false, "Слишком короткий телефон провален");
    console.assert(validatePhone('+6 (999) 123-45-67') === false, "Неверный код страны провален");
    console.assert(validatePhone('abc') === false, "Буквы в телефоне провалены");
    
    console.assert(validateDate('05.09.2026') === true, "Date 1 провален");
    console.assert(validateDate('01.01.1900') === true, "Date 2 провален");
    console.assert(validateDate('31.12.2099') === true, "Date 3 провален");
    console.assert(validateDate('15.06.2000') === true, "Date 4 провален");
    console.assert(validateDate('32.01.2020') === false, "Неверный день провален");
    console.assert(validateDate('00.05.2020') === false, "День 00 провален");
    console.assert(validateDate('15.13.2020') === false, "Неверный месяц провален");
    console.assert(validateDate('15.00.2020') === false, "Месяц 00 провален");
    console.assert(validateDate('05.09.1899') === false, "Год до 1900 провален");
    console.assert(validateDate('05.09.2100') === false, "Год после 2099 провален");
    console.assert(validateDate('2026-09-05') === false, "Неверный формат провален");

    console.log("Все тесты пройдены! ✅");
    

}
// Запуск тестов
runTests();