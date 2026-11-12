'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let chislo = 13;
    let bool = false;
    let stroka = "strokaaaa";
    let massiv = [1,2, 3];
    let pusto = null;
    let neopredeleno = undefined; 
    // 1.2 Выведите типы всех переменных
    console.log("Типы переменных:");
    console.log(`chislo: ${typeof chislo}`);
    console.log(`bool: ${typeof bool}`);
    console.log(`stroka: ${typeof stroka}`);
    console.log(`massiv: ${typeof massiv}`); // Объект (массив)
    console.log(`bolshoyint: ${typeof bolshoyint}`);
    console.log(`pusto: ${typeof pusto}`); // Объект (особенность JS)
    console.log(`neOpredeleno: ${typeof neOpredeleno}`);
    console.log(`obekt: ${typeof obekt}`);
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    return (number + lab)%30;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества вариантов
    return (number % variants) || variants
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    switch(operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Ошибка: Деление на ноль';
        default: return 'Неизвестная операция';
    }
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    switch(figure) {
        case 'circle': 
            // params[0] - радиус
            return Math.PI * params[0] ** 2;
        case 'rectangle': 
            // params[0] - ширина, params[1] - высота
            return params[0] * params[1];
        case 'triangle': 
            // params[0] - основание, params[1] - высота
            return (params[0] * params[1]) / 2;
        default: 
            return 'Неизвестная фигура';
    }
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    return str.split('').reverse().join('');
    // Функция возвращает перевернутую строку
    
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    // Функция возвращает случайное число между min и max
};

// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    title: "Изучаем JavaScript",
    author: "Итан Браун",
    year: 2017,
    pages: 368,
    isAvailable: true,
    getInfo() {
        return `Название: ${this.title}, Автор: ${this.author}, Год: ${this.year}, Страниц: ${this.pages}`;
    },

    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
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
        const scores = Object.values(this.grades);
        if (scores.length === 0) return 0;
        return scores.reduce((sum, grade) => sum + grade, 0) / scores.length;
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
    numbers.forEach(num => {
        if (num > 50) console.log(num);
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
        .sort();

    // Возвращаем результаты для возможности проверки, если понадобится
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
        if (task) task.completed = true;
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
        /* 5.5 Статистика возвращает объект:
        total,completed,pending,completionRate*/
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : (completed / total) * 100;
        
        return { total, completed, pending, completionRate };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    class Vehicle {
        static vehicleCount = 0; // Инициализация счетчика

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year;
            Vehicle.vehicleCount++;
        }

        displayInfo() {
            console.log(`Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`);
        }

        get age() {
            return new Date().getFullYear() - this.year;
        }

        set year(newYear) {
            const currentYear = new Date().getFullYear();
            if (newYear > currentYear) {
                console.log(`Год выпуска не может быть из будущего. Установлен текущий год (${currentYear}).`);
                this._year = currentYear;
            } else {
                this._year = newYear;
            }
        }

        get year() {
            return this._year;
        }

        static compareAge(vehicle1, vehicle2) {
            return Math.abs(vehicle1.year - vehicle2.year);
        }

        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    class Car extends Vehicle {
        constructor(make, model, year, numDoors = 4) { // Значение по умолчанию для дверей
            super(make, model, year);
            this.numDoors = numDoors;
        }

        displayInfo() {
            super.displayInfo();
            console.log(`Количество дверей: ${this.numDoors}`);
        }

        honk() {
            console.log("Beep beep!");
        }
    }

    class ElectricCar extends Car {
        constructor(make, model, year, numDoors, batteryCapacity) {
            super(make, model, year, numDoors);
            this.batteryCapacity = batteryCapacity;
        }

        displayInfo() {
            super.displayInfo();
            console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
        }

        calculateRange() {
            return this.batteryCapacity * 6;
        }
    }

    // ===== ЗАДАНИЕ 7: Каррирование =====
    // Создайте функцию createVehicleFactory, которая возвращает функцию
    // для создания транспортных средств определенного типа (каррирование).
    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        return new vehicleType(make, model, year,);
    };

    return { Vehicle, Car, ElectricCar, createVehicleFactory };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====
/*
Задание (по вариантам):
1. Изучите функции с регулярными выражениями по своему варианту
На защите вы должны суметь объяснить структуру регулярного выражения.
2. Напишите тесты, покрывающие все различные варианты. Обратите внимание: тесты должны обеспечивать полное покрытие, но не быть дублирующимися.
3. Если предложенное регулярное выражение некорректно, вы можете исправить его.

/**
 * Вариант 3: Валидация номера телефона (российский формат)
 * Поддерживает форматы:
 * - +7 (999) 123-45-67
 * - 8 (999) 123-45-67
 * - 89991234567
 * - +7(999)123-45-67
 */
function validatePhone(phone) {
    const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    return phoneRegex.test(phone);
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("\n=== ТЕСТИРОВАНИЕ ===");

    // Тест 1: getReviewerNumber
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");

    // Тест 2: calculate
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален (+) ");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора провален (/)");

    // Тест 3: taskManager
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    taskManager.addTask("Новая задача");
    console.assert(taskManager.getStats().total === 4, "Тест добавления задачи провален");

    // Тест 4: классы и наследование
    const { Vehicle, Car, ElectricCar, createVehicleFactory } = taskClasses();
    
    console.log("\n--- Тестирование Vehicle ---");
    const vehicle = new Vehicle('Toyota', 'Camry', 2015);
    vehicle.displayInfo();
    console.log(`Возраст: ${vehicle.age} лет`);

    console.log("\n--- Тестирование Car ---");
    const car = new Car('Honda', 'Civic', 2018, 4);
    car.displayInfo();
    car.honk();

    console.log("\n--- Тестирование ElectricCar ---");
    const electricCar = new ElectricCar('Tesla', 'Model 3', 2020, 4, 75);
    electricCar.displayInfo();
    console.log(`Запас хода: ${electricCar.calculateRange()} км`);

    console.log("\n--- Тестирование возраста и геттеров ---");
    const testVehicle = new Vehicle('Test', 'Model', 2010);
    console.assert(testVehicle.age === (new Date().getFullYear() - 2010), 'Тест возраста провален');
    const futureVehicle = new Vehicle('Future', 'Model', 2050);
    console.assert(futureVehicle.year === new Date().getFullYear(), 'Тест сеттера года провален');

    console.log("\n--- Тестирование Фабрики ---");
    const createCarFactory = createVehicleFactory(Car);
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log(`Всего создано транспортных средств: ${Vehicle.getTotalVehicles()}`);
    console.assert(Vehicle.getTotalVehicles() === 6, "Тест счетчика транспортных средств провален");

    // Тест 5: Регулярные выражения (Вариант 3)
    console.log("\n--- Тестирование Валидации Телефона ---");
    console.assert(validatePhone("+7 (999) 123-45-67") === true, "Тест рег. выражения 1 провален");
    console.assert(validatePhone("8 (999) 123-45-67") === true, "Тест рег. выражения 2 провален");
    console.assert(validatePhone("89991234567") === true, "Тест рег. выражения 3 провален");
    console.assert(validatePhone("+7(999)123-45-67") === true, "Тест рег. выражения 4 провален");
    console.assert(validatePhone("+7 999 123 45 67") === true, "Тест рег. выражения 5 провален");
    console.assert(validatePhone("+1 999 123-45-67") === false, "Тест рег. выражения 6 провален (не РФ)");
    console.assert(validatePhone("79991234567") === false, "Тест рег. выражения 7 провален (без +)");
    
    console.log("\nВсе тесты пройдены! ✅");
}

// Запуск тестов
runTests();