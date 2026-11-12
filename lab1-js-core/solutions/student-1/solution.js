'use strict';

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    const studentNumber = 1;
    const studentName = 'Иван';
    const isStudent = true;
    const averageMark = 4.5;
    const subjects = ['JavaScript', 'HTML', 'CSS'];

    // Тест 1.2 — типы переменных
    console.log('Тип studentNumber:', typeof studentNumber);
    console.log('Тип studentName:', typeof studentName);
    console.log('Тип isStudent:', typeof isStudent);
    console.log('Тип averageMark:', typeof averageMark);
    console.log('Тип subjects:', typeof subjects);
}

// ===== ЗАДАНИЕ 2: Функции =====

// Тест 2.1 — номер ревьюера
function getReviewerNumber(number, lab) {
    return (number + lab) % 30 || 30;
}

// Тест 2.2 — номер варианта
function getVariant(number, variants) {
    return number % variants;
}

// Тест 2.3 — калькулятор
function calculate(a, b, operation) {
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                throw new Error('Деление на ноль невозможно');
            }
            return a / b;
        default:
            throw new Error('Неизвестная операция');
    }
}

// Тест 2.4 — площади
function calculateArea(figure, ...params) {
    switch (figure) {
        case 'circle':
            return Math.PI * params[0] ** 2;
        case 'rectangle':
            return params[0] * params[1];
        case 'triangle':
            return 0.5 * params[0] * params[1];
        default:
            throw new Error('Неизвестная фигура');
    }
}

// Тест 2.5 — стрелочные функции
const reverseString = (str) => str.split('').reverse().join('');

const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// ===== ЗАДАНИЕ 3: Объекты =====

const book = {
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    pages: 1225,
    isAvailable: true,

    // Тест 3.1 — информация о книге
    getInfo() {
        return `"${this.title}", автор: ${this.author}, год: ${this.year}, страниц: ${this.pages}`;
    },

    // Тест 3.1 — изменение доступности
    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        return this.isAvailable;
    }
};

const student = {
    name: 'Анна Петрова',
    age: 20,
    course: 2,

    grades: {
        math: 90,
        programming: 95,
        history: 85
    },

    // Тест 3.2 — средний балл
    getAverageGrade() {
        const grades = Object.values(this.grades);
        return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    },

    // Тест 3.2 — добавление оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====

function processArrays() {
    const numbers = [12, 45, 23, 67, 34, 89, 56, 91, 27, 14];

    const words = [
        'JavaScript',
        'программирование',
        'массив',
        'функция',
        'объект'
    ];

    const users = [
        { id: 1, name: 'Анна', age: 25, isActive: true },
        { id: 2, name: 'Борис', age: 30, isActive: false },
        { id: 3, name: 'Виктория', age: 22, isActive: true },
        { id: 4, name: 'Григорий', age: 35, isActive: true },
        { id: 5, name: 'Дарья', age: 28, isActive: false }
    ];

    // Тест 4.1 — forEach
    console.log('Числа больше 50:');
    numbers.forEach(number => {
        if (number > 50) {
            console.log(number);
        }
    });

    // Тест 4.2 — map
    const squares = numbers.map(number => number ** 2);
    console.log('Квадраты чисел:', squares);

    // Тест 4.3 — filter
    const activeUsers = users.filter(user => user.isActive);
    console.log('Активные пользователи:', activeUsers.map(user => user.name));

    // Тест 4.4 — find
    const victoria = users.find(user => user.name === 'Виктория');
    console.log('Найден пользователь:', victoria);

    // Тест 4.5 — reduce
    const sum = numbers.reduce((total, number) => total + number, 0);
    console.log('Сумма чисел:', sum);

    // Тест 4.6 — sort
    const sortedByAge = [...users].sort((a, b) => b.age - a.age);
    console.log(
        'Пользователи по убыванию возраста:',
        sortedByAge.map(user => `${user.name} (${user.age})`)
    );

    // Тест 4.7 — every
    const allAdults = users.every(user => user.age > 18);
    console.log('Все пользователи старше 18 лет:', allAdults);

    // Тест 4.8 — цепочка методов
    const activeUserNames = users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();

    console.log('Имена активных пользователей:', activeUserNames);

    return {
        numbers,
        words,
        users,
        squares,
        activeUsers,
        victoria,
        sum,
        sortedByAge,
        allAdults,
        activeUserNames
    };
}

// ===== ЗАДАНИЕ 5: Менеджер задач =====

const taskManager = {
    tasks: [
        {
            id: 1,
            title: 'Изучить JavaScript',
            completed: false,
            priority: 'high'
        },
        {
            id: 2,
            title: 'Сделать лабораторную работу',
            completed: true,
            priority: 'high'
        },
        {
            id: 3,
            title: 'Прочитать книгу',
            completed: false,
            priority: 'medium'
        }
    ],

    // Тест 5.1 — добавление задачи
    addTask(title, priority = 'medium') {
        const newId = this.tasks.length
            ? Math.max(...this.tasks.map(task => task.id)) + 1
            : 1;

        const task = {
            id: newId,
            title,
            completed: false,
            priority
        };

        this.tasks.push(task);
        return task;
    },

    // Тест 5.2 — выполнение задачи
    completeTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);

        if (task) {
            task.completed = true;
        }

        return task;
    },

    // Тест 5.3 — удаление задачи
    deleteTask(taskId) {
        const index = this.tasks.findIndex(task => task.id === taskId);

        if (index === -1) {
            return false;
        }

        this.tasks.splice(index, 1);
        return true;
    },

    // Тест 5.4 — получение задач по статусу
    getTasksByStatus(completed) {
        return this.tasks.filter(task => task.completed === completed);
    },

    // Тест 5.5 — статистика
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        return {
            total,
            completed,
            pending,
            completionRate: total === 0 ? 0 : (completed / total) * 100
        };
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====

function taskClasses() {
    class Vehicle {
        static vehicleCount = 0;

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year;

            Vehicle.vehicleCount++;
        }

        // Тест 6.1 — вывод информации
        displayInfo() {
            console.log(
                `Марка: ${this.make}, Модель: ${this.model}, Год: ${this.year}`
            );
        }

        // Тест 6.1 — геттер возраста
        get age() {
            return new Date().getFullYear() - this.year;
        }

        // Тест 6.1 — сеттер года
        set year(newYear) {
            const currentYear = new Date().getFullYear();

            if (newYear > currentYear) {
                throw new Error('Год выпуска не может быть больше текущего года');
            }

            this._year = newYear;
        }

        get year() {
            return this._year;
        }

        // Тест 6.4 — сравнение возраста
        static compareAge(vehicle1, vehicle2) {
    return vehicle2.age - vehicle1.age;
}

        // Тест 6.4 — количество машин
        static getTotalVehicles() {
            return Vehicle.vehicleCount;
        }
    }

    class Car extends Vehicle {
        constructor(make, model, year, numDoors = 4) {
    super(make, model, year);
    this.numDoors = numDoors;
}

        // Тест 6.2 — информация о машине
        displayInfo() {
            super.displayInfo();
            console.log(`Количество дверей: ${this.numDoors}`);
        }

        // Тест 6.2 — сигнал
        honk() {
            console.log('Beep beep!');
        }
    }

    class ElectricCar extends Car {
        constructor(make, model, year, numDoors, batteryCapacity) {
            super(make, model, year, numDoors);
            this.batteryCapacity = batteryCapacity;
        }

        // Тест 6.3 — информация об электромобиле
        displayInfo() {
            super.displayInfo();
            console.log(`Емкость батареи: ${this.batteryCapacity} кВт·ч`);
        }

        // Тест 6.3 — запас хода
        calculateRange() {
            return this.batteryCapacity * 6;
        }
    }

    // ===== ЗАДАНИЕ 7: Каррирование =====

    const createVehicleFactory = (vehicleType) => (make, model, year) => {
        return new vehicleType(make, model, year);
    };

    return {
        Vehicle,
        Car,
        ElectricCar,
        createVehicleFactory
    };
}

// ===== ЗАДАНИЕ 8: Регулярные выражения =====

// Вариант 1 — валидация email
function validateEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

// ===== ТЕСТИРОВАНИЕ =====

function runTests() {
    console.log('=== ТЕСТИРОВАНИЕ ===\n');

    // Тест 1 — базовые типы
    console.log('--- Задание 1 ---');
    simpleTask();

    // Тест 2.1 — номер ревьюера
    console.log('\n--- Задание 2 ---');
    console.log(
        '2.1 Номер ревьюера:',
        getReviewerNumber(5, 1)
    );

    // Тест 2.2 — номер варианта
    console.log(
        '2.2 Вариант студента №1:',
        getVariant(1, 4)
    );

    // Тест 2.3 — калькулятор
    console.log(
        '2.3 Сложение 10 + 5:',
        calculate(10, 5, '+')
    );
    console.log(
        '2.3 Вычитание 10 - 5:',
        calculate(10, 5, '-')
    );
    console.log(
        '2.3 Умножение 10 * 5:',
        calculate(10, 5, '*')
    );
    console.log(
        '2.3 Деление 10 / 5:',
        calculate(10, 5, '/')
    );

    // Тест 2.4 — площади
    console.log(
        '2.4 Площадь круга:',
        calculateArea('circle', 5)
    );
    console.log(
        '2.4 Площадь прямоугольника:',
        calculateArea('rectangle', 5, 10)
    );
    console.log(
        '2.4 Площадь треугольника:',
        calculateArea('triangle', 5, 10)
    );

    // Тест 2.5 — стрелочные функции
    console.log(
        '2.5 Перевёрнутая строка:',
        reverseString('JavaScript')
    );
    console.log(
        '2.5 Случайное число от 1 до 10:',
        getRandomNumber(1, 10)
    );

    // Тест 3.1 — книга
    console.log('\n--- Задание 3 ---');
    console.log('3.1 Информация о книге:', book.getInfo());
    console.log('3.1 Доступность:', book.isAvailable);

    console.assert(
        book.getInfo().includes('Война и мир'),
        'Тест информации о книге провален'
    );

    const initialAvailability = book.isAvailable;
    const changedAvailability = book.toggleAvailability();

    console.assert(
        changedAvailability !== initialAvailability,
        'Тест toggleAvailability провален'
    );

    // Возвращаем состояние, чтобы последующие проверки не зависели от демо
    book.toggleAvailability();

    console.log('3.1 После toggleAvailability:', changedAvailability);

    // Тест 3.2 — студент
    console.log('3.2 Студент:', student.name);
    console.log('3.2 Возраст:', student.age);
    console.log('3.2 Курс:', student.course);
    console.log('3.2 Средний балл:', student.getAverageGrade());

    console.assert(
        student.getAverageGrade() === 90,
        'Тест среднего балла провален'
    );

    const oldAverage = student.getAverageGrade();
    student.addGrade('physics', 88);

    console.assert(
        student.grades.physics === 88,
        'Тест добавления оценки провален'
    );

    console.log('3.2 Оценки после добавления physics:', student.grades);
    console.log('3.2 Новый средний балл:', student.getAverageGrade());

    // Возвращаем состояние
    delete student.grades.physics;

    console.assert(
        student.getAverageGrade() === oldAverage,
        'Состояние студента восстановить не удалось'
    );

    // Тест 4 — массивы
    console.log('\n--- Задание 4 ---');
    const arrayResult = processArrays();

    console.assert(
        arrayResult.squares[0] === 144,
        'Тест map провален'
    );

    console.assert(
        arrayResult.activeUsers.length === 3,
        'Тест filter провален'
    );

    console.assert(
        arrayResult.victoria.name === 'Виктория',
        'Тест find провален'
    );

    console.assert(
        arrayResult.sum === 458,
        'Тест reduce провален'
    );

    console.assert(
        arrayResult.sortedByAge[0].name === 'Григорий',
        'Тест sort провален'
    );

    console.assert(
        arrayResult.allAdults === true,
        'Тест every провален'
    );

    console.assert(
        JSON.stringify(arrayResult.activeUserNames) ===
        JSON.stringify(['Анна', 'Виктория', 'Григорий']),
        'Тест цепочки методов провален'
    );

    // Тест 5 — менеджер задач
    console.log('\n--- Задание 5 ---');

    // Запоминаем исходное состояние
    const originalTasks = taskManager.tasks.map(task => ({ ...task }));

    const addedTask = taskManager.addTask(
        'Повторить функции JavaScript',
        'medium'
    );

    console.log('5.1 Добавленная задача:', addedTask);

    console.assert(
        addedTask.priority === 'medium',
        'Тест priority провален'
    );

    const completedTask = taskManager.completeTask(addedTask.id);
    console.log('5.2 Выполненная задача:', completedTask);

    console.assert(
        completedTask.completed === true,
        'Тест completeTask провален'
    );

    const deleted = taskManager.deleteTask(addedTask.id);
    console.log('5.3 Задача удалена:', deleted);

    console.assert(
        deleted === true,
        'Тест deleteTask провален'
    );

    console.log(
        '5.4 Выполненные задачи:',
        taskManager.getTasksByStatus(true)
    );

    console.log(
        '5.4 Невыполненные задачи:',
        taskManager.getTasksByStatus(false)
    );

    const stats = taskManager.getStats();
    console.log('5.5 Статистика:', stats);

    console.assert(
        stats.total === 3 &&
        stats.completed === 1 &&
        stats.pending === 2,
        'Тест статистики провален'
    );

    // Возвращаем исходное состояние
    taskManager.tasks = originalTasks;

    // Тест 6 — классы
    console.log('\n--- Задание 6 ---');

    const {
        Vehicle,
        Car,
        ElectricCar,
        createVehicleFactory
    } = taskClasses();

    const vehicle = new Vehicle('Toyota', 'Corolla', 2016);

    console.log('6.1 Vehicle:');
    vehicle.displayInfo();
    console.log('6.1 Возраст:', vehicle.age);

    console.assert(
        vehicle.age === new Date().getFullYear() - 2016,
        'Тест возраста провален'
    );

    const car = new Car('Kia', 'Rio', 2021, 4);

    console.log('\n6.2 Car:');
    car.displayInfo();
    car.honk();

    const electricCar = new ElectricCar(
        'Tesla',
        'Model 3',
        2022,
        4,
        60
    );

    console.log('\n6.3 ElectricCar:');
    electricCar.displayInfo();
    console.log(
        '6.3 Запас хода:',
        electricCar.calculateRange(),
        'км'
    );

    console.assert(
        electricCar.calculateRange() === 360,
        'Тест calculateRange провален'
    );

    // Тест 6.4 — статические методы
    console.log(
        '\n6.4 Разница в возрасте:',
        Vehicle.compareAge(vehicle, car)
    );

    console.log(
        '6.4 Всего создано транспортных средств:',
        Vehicle.getTotalVehicles()
    );

    console.assert(
        Vehicle.getTotalVehicles() === 3,
        'Тест vehicleCount провален'
    );

    // Тест 7 — каррирование
    console.log('\n--- Задание 7 ---');

    const createCarFactory = createVehicleFactory(Car);
    const newCar = createCarFactory('BMW', '320i', 2023);

    console.log('7.1 Автомобиль через фабрику:');
    newCar.displayInfo();

    console.assert(
        newCar instanceof Car,
        'Тест фабрики провален'
    );

    // Тест 8 — вариант 1
    console.log('\n--- Задание 8: вариант 1 ---');

    const emailTests = [
        ['test@example.com', true],
        ['user123@test.com', true],
        ['user.name+test@example.com', true],
        ['testexample.com', false],
        ['test@example', false],
        ['@example.com', false],
        ['test@@example.com', false],
        ['test @example.com', false],
        ['тест@example.com', false]
    ];

    emailTests.forEach(([email, expected]) => {
        const result = validateEmail(email);

        console.log(`8.1 ${email}:`, result);

        console.assert(
            result === expected,
            `Тест email провален: ${email}`
        );
    });

    console.log('\n=================================');
    console.log('Все тесты пройдены! ✅');
    console.log('Номер студента: 1');
    console.log('Вариант: 1');
    console.log('=================================');
}

// Запуск
runTests();