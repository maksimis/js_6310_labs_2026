'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    const name = "Аня"
    let age = 21
    let annaIsCool = true
    let facebookAccount = null
    let favoriteSong = undefined
    // 1.2 Выведите типы всех переменных
    console.log(typeof name)
    console.log(typeof age)
    console.log(typeof annaIsCool)
    console.log(typeof facebookAccount)
    console.log(typeof favoriteSong)
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return (number + lab - 1) % 30 + 1
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return (number - 1) % variants + 1;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
   if (operation === "+") {
    return a+b
   } else if (operation === "-") {
    return a-b
   } else if (operation === "*") {
    return a*b
   } else if (operation === "/") {
    return a/b
   }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch (figure) {
        case 'circle':
            return 3.14*params[0]*params[0]
        case 'rectangle':
            return params[0]*params[1]
        case 'triangle':
            return 0.5*params[0]*params[1]
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    let result = ""
    for (let i = str.length-1; i >= 0; i--) {
        result += str[i]
    }
    return result
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    return Math.floor(Math.random() * (max-min + 1)) + min
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    title: "Смешарики. История культовой вселенной",
    author: "Мария Корнилова",
    year: 2024,
    pages: 256,
    dostup: true,
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    getInfo() {
        return `${book.title}, ${book.author}, ${book.year}, ${book.pages}, ${book.dostup}`
    },
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    toggleAvailability() {
        if (book.dostup == true) {
            return book.dostup = false
        }
        else {
            return book.dostup = true
        }
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
        const grades = Object.values(student.grades);
        const sum = grades.reduce((acc, g) => {
                        return acc + g;
                    }, 0);
        return sum / grades.length;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        student.grades[subject] = grade
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

    console.log("Числа больше 50:");
    // 1. Используйте forEach для вывода всех чисел больше 50
    numbers.forEach((n) => {
        if (n > 50) {
             console.log(n);
        }
    })

    // 2. Используйте map для создания массива квадратов чисел
        const squares = numbers.map((k) => {
        return k*k;
        });

    // 3. Используйте filter для получения активных пользователей
        const activeUsers =  users.filter((a) => {
            return a.isActive == true
        });

    // 4. Используйте find для поиска пользователя с именем "Виктория"
        const victoria = users.find((i) => {
            return i.name == "Виктория"
        });

    // 5. Используйте reduce для подсчета суммы всех чисел
        const sum = numbers.reduce ((acc, s) => {
            return acc + s;
        }, 0);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
        const sortedByAge = users.sort ((a, b) => {
            return b.age - a.age;
        })

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
        const allAdults = users.every ((v) => {
            return v.age > 18
        })

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
        const activeUserNames = users.filter((user) => {
            return user.isActive == true
        }).map((user) => {
            return user.name;
        }).sort()
};

// ===== ЗАДАНИЕ 5: Менеджер задач =====
const taskManager = {
    tasks: [
        { id: 1, title: "Изучить JavaScript", completed: false, priority: "high" },
        { id: 2, title: "Сделать лабораторную работу", completed: true, priority: "high" },
        { id: 3, title: "Прочитать книгу", completed: false, priority: "medium" }
    ],

    addTask(title, priority = "medium") {
        // 5.1 Добавление задачи
        taskManager.tasks.push({ id: taskManager.tasks[taskManager.tasks.length -1].id + 1, title: title, completed: false, priority: priority })
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = taskManager.tasks.find((i) => {
        return i.id === taskId;
    });
    task.completed = true;
    },

    // Удаление задачи
    deleteTask(taskId) {
        taskManager.tasks = taskManager.tasks.filter((d) => {
        return d.id !== taskId;
    });
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        const spisokZadach = taskManager.tasks.filter((z) => {
        return z.completed === completed;
    });
    return spisokZadach
    },

    getStats() {
        /* 5.5 Статистика возвращает объект:
        total,
        completed,
        pending,
        completionRate
        */
        const total = taskManager.tasks.length;
        const completed = taskManager.getTasksByStatus(true).length;
        const pending = taskManager.getTasksByStatus(false).length;
        const completionRate = (completed / total) * 100;

        return {
            total: total,
            completed: completed,
            pending: pending,
            completionRate: completionRate
        }
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
            console.log(`марка: ${this.make}, модель: ${this.model}, год: ${this._year}`);
        }

        // Добавьте геттер age, который возвращает возраст транспортного средства
        // (текущий год минус год выпуска). Используйте new Date().getFullYear().
        get age() {
            return new Date().getFullYear() - this._year;
        }

        // Добавьте сеттер для года выпуска с проверкой: год не может быть больше текущего.
        set year(newYear) {
            const proverka = new Date().getFullYear();
            if (newYear <= proverka) {
                this._year = newYear;
            }
        }

        get year() {
            return this._year;
        }

        // Добавьте статический метод compareAge(vehicle1, vehicle2),
        // который возвращает разницу в возрасте между двумя транспортными средствами.
        static compareAge(vehicle1, vehicle2) {
            return vehicle1.age - vehicle2.age;
        }

        static getTotalVehicles() {
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
            console.log(`дверей ${this.numDoors}`);
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
            console.log(`батарея ${this.batteryCapacity}`);
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
    const createVehicleFactory = (vehicleType) => (...params) => {
        return new vehicleType(...params);
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
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");

    console.assert(getVariant(5, 4) === 1, "Тест провален");
    console.assert(getVariant(4, 4) === 4, "Тест провален");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(29, 1) === 30, "Тест получения ревьюера провален");
    console.assert(getReviewerNumber(30, 1) === 1, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, "+") === 15, "неверно, 10 + 5 = 15");
    console.assert(calculate(10, 5, "-") === 5, "неверно, 10 - 5 = 5");
    console.assert(calculate(10, 5, "*") === 50, "неверно, 10 * 5 = 50");
    console.assert(calculate(10, 5, "/") === 2, "неверно, 10 / 5 = 2");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");

    console.assert(taskManager.getStats().completed === 1, "выполнена 1 задача");
    console.assert(taskManager.getStats().pending === 2, "невыполненно 2 задачи");

    taskManager.addTask("сделать сальто", "high");
    console.assert(taskManager.tasks.length === 4, "теперь есть 4 задачи");

    taskManager.completeTask(3);
    console.assert(taskManager.tasks.find(t => t.id === 3).completed === true, "задача 3 выполнена");

    taskManager.deleteTask(1);
    console.assert(taskManager.tasks.length === 3, "должно остаться 3 задачи");

    const completed = taskManager.getTasksByStatus(true);
    console.assert(completed.every(t => t.completed === true), "все задачи выполнены");

    console.assert(student.getAverageGrade() === 90, "ср.балл изначально 90");
    student.addGrade("english", 50);
    console.assert(student.grades.english === 50, "нет оценки по english");
    console.assert(student.getAverageGrade() === 80, "ср.балл должен стать 80");

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

    // Добавьте остальные тесты...

    console.assert(validateEmail("test@mail.ru") === true, "должен быть true");
    console.assert(validateEmail("user.name+tag@mail.ru") === true, "должен быть true");
    console.assert(validateEmail("user123@mail.ru") === true, "должен быть true");
    console.assert(validateEmail("a@b.co") === true, "должен быть true");

    console.assert(validateEmail("testmail.ru") === false, "нет @");
    console.assert(validateEmail("@mail.ru") === false, "нет имени");
    console.assert(validateEmail("test@") === false, "нет домена и зоны после");
    console.assert(validateEmail("test@.ru") === false, "пустой домен");
    console.assert(validateEmail("test@mail") === false, "нет точки и зоны после домена");
    console.assert(validateEmail("test@mail.r") === false, "1 буква после точки");
    console.assert(validateEmail("тест@mail.ru") === false, "русские буквы");
    console.assert(validateEmail("t est@mail.ru") === false, "пробел");

    console.log("Все тесты пройдены! ✅");
}

// Запуск тестов
runTests();