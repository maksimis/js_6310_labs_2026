'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const name = "Adilya";
    let age = 22;
    const isStudent = true;
    let city = null;
    let job;
    // 1.2 Выведите типы всех переменных
    console.log(typeof name);
    console.log(typeof age);
    console.log(typeof isStudent);
    console.log(typeof city);
    console.log(typeof job);
}
simpleTask();

const students = 30;
// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return ((number + lab - 1) % students) + 1;
}
console.log(`Номер ревьюера: ${getReviewerNumber(7, 1)}`);


function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    const result = number % variants;
    return result === 0 ? variants : result;
}
console.log(`Номер варианта: ${getVariant(7, 4)}`);


function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "Нельзя делить на ноль";
        default: return "Неизвестная операция";    
    }
}
console.log(`Сложение 4 и 7: ${calculate(7, 4, '+')}`);
console.log(`Вычитание 4 и 7: ${calculate(7, 4, '-')}`);
console.log(`Умножение 4 и 7: ${calculate(7, 4, '*')}`);
console.log(`Деление 4 и 7: ${calculate(7, 4, '/')}`);
console.log(`Дефолт 4 и 7: ${calculate(7, 4, '=')}`);
 

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle':
            const [radius] = params;
            return Math.round(Math.PI * radius * radius);
        case 'rectangle':
            const [a, b] = params;
            return a * b;
        case 'triangle':
            const [base, height] = params;
            return (base * height) / 2;
        default:
            return 'Неизвестная фигура';
    }
}
console.log(`Площадь круга: ${calculateArea('circle', 7)}`);
console.log(`Площадь прямоугольника: ${calculateArea('rectangle', 7, 4)}`);
console.log(`Площадь треугольника: ${calculateArea('triangle', 7, 4)}`);
console.log(`Площадь квадрата: ${calculateArea('square', 7, 4)}`);


// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    return str.split('').reverse().join('');
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
console.log(`Перевёрнутая строка: ${reverseString('JavaScript')}`);
console.log(`Случайное число от 1 до 10: ${getRandomNumber(1, 10).toFixed(2)}`);


// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    book_name: 'Реинжиниринг корпорации',
    autor: 'Майкл Хаммер',
    date: 2007,
    page_count: 276,
    availability: true,
    getInfo() {
        return `Название: ${this.book_name}, Автор: ${this.autor}, Год: ${this.date}, Страниц: ${this.page_count}`;
    },

    toggleAvailability() {
        this.availability = !this.availability;  // меняем значение на противоположное
        return this.availability;                // возвращаем новое значение
    }
};
console.log(book.getInfo());
console.log(`Доступность до: ${book.availability}`);
console.log(`Доступность после: ${book.toggleAvailability()}`);


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
        const grades = Object.values(this.grades);
        let sum = 0;
        for (const grade of grades) {
            sum += grade;
        }
        return sum / grades.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        // Ваш код здесь
        this.grades[subject] = grade;
    }
};
console.log(`Средний балл: ${student.getAverageGrade()}`);
student.addGrade('physics', 88);
console.log(`Средний балл после добавления физики: ${student.getAverageGrade()}`);


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
    const squares = numbers.map(num => num * num);
    console.log(`Квадраты чисел: ${squares}`);

    // 3. Используйте filter для получения активных пользователей
    /*const activeUsers =  ваш код */
    const activeUsers = users.filter(user => user.isActive);
    console.log(`Активные юзеры: ${activeUsers.map(u => u.name).join(', ')}`);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    /*const victoria =  ваш код */
    const victoria = users.find(user => user.name == 'Виктория');
    console.log(`Найдена Виктория: ${victoria ? victoria.name : 'не найдена'}`);

    // 5. Используйте reduce для подсчета суммы всех чисел
    /*const sum =  ваш код */
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log(`Сумма чисел: ${sum}`);


    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    /*const sortedByAge =  ваш код */
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log(`Пользователи по возрасту (убыв.): ${sortedByAge.map(u => `${u.name} (${u.age})`).join(', ')}`);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    /*const allAdults =  ваш код */
    const allAdults = users.every(user => user.age > 18);
    console.log(`Все старше 18: ${allAdults}`);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    /*const activeUserNames =  ваш код */
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();
    console.log(`Активные имена по алфавиту: ${activeUserNames}`);
}

processArrays();

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        // 5.1 Добавление задачи
        let maxId = 0;
        for (const task of this.tasks) {
            if (task.id > maxId) {
                maxId = task.id;
            }
        }

        const newTask = {
            id: maxId + 1,
            title: title,
            completed: false,
            priority: priority
        };

        this.tasks.push(newTask);
    },


    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(task => task.id === taskId);
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
       const pending = total - completed;
       let completionRate
       if (total === 0) {
        completionRate = 0;
       } else {
        completionRate = (completed / total) * 100;
       }
       return {
        total: total,
        completed: completed,
        pending: pending,
        completionRate: Math.round(completionRate * 100) / 100
       };
    }
};
console.log(`Начальная статистика:`, taskManager.getStats());

taskManager.addTask("Написать отчёт", "low");
console.log(`После addTask:`, taskManager.getStats());

taskManager.completeTask(1);
console.log(`После completeTask(1):`, taskManager.getStats());

taskManager.deleteTask(3);
console.log(`После deleteTask(3):`, taskManager.getStats());

console.log(`Выполненные задачи:`, taskManager.getTasksByStatus(true));
console.log(`Невыполненные задачи:`, taskManager.getTasksByStatus(false));


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
            this._year = year;       // приватное соглашение
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
            return new Date().getFullYear() - this.year
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                console.log('Ошибка: этот год еще не наступил');
                return;
            }
            this._year = newYear
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
    class Car extends Vehicle {      // extends — говорит, что класс наследуется от другого
        constructor(make, model, year, numDoors) {
            super(make, model, year);     // вызываем конструктор родителя
            this.numDoors = numDoors;
        }

        // Переопределите метод displayInfo() так, чтобы он также выводил количество дверей.
        // Используйте super.displayInfo() для вызова метода родителя.
        displayInfo() {
            super.displayInfo()
            console.log(`Кол-во дверей: ${this.numDoors}`);
        }

        // Добавьте метод honk(), который выводит "Beep beep!".
        honk() {
            console.log('Beep beep!');
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
function getVariant(number, variants) {
    return number % variants;
}

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
        const phoneRegex = /^(?:\+7|8)(?:\s?\(\d{3}\)[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\d{10})$/;
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
    console.log("ТЕСТИРОВАНИЕ");

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
    const myNewCar = createCarFactory('BMW', 'X5', 2022, 4);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    function runPhoneTests() {
    console.log("Тесты валидации телефона");

    // Валидные форматы из задания
    console.assert(validatePhone("+7 (999) 123-45-67") === true, "Формат 1: +7 (999) 123-45-67");
    console.assert(validatePhone("8 (999) 123-45-67") === true, "Формат 2: 8 (999) 123-45-67");
    console.assert(validatePhone("89991234567") === true, "Формат 3: 89991234567");
    console.assert(validatePhone("+7(999)123-45-67") === true, "Формат 4: +7(999)123-45-67");

    // Невалидные
    console.assert(validatePhone("") === false, "Пустая строка");
    console.assert(validatePhone("abc") === false, "Буквы");
    console.assert(validatePhone("9991234567") === false, "Без +7 или 8");
    console.assert(validatePhone("+7 (999) 123-45-6") === false, "Мало цифр");
    console.assert(validatePhone("+7 (999) 123-45-678") === false, "Много цифр");
    console.assert(validatePhone("+7 999 123 45 67") === false, "Без скобок");
    console.assert(validatePhone("+7-999-123-45-67") === false, "Дефисы вместо скобок");

}

runPhoneTests();

    console.log("Все тесты пройдены!");
}

// Запуск тестов
runTests();