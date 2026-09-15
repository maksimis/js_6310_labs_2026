'use strict'

// ===== ЗАДАНИЕ 1: Базовые операции =====
function simpleTask() {
    // 1.1 Объявите переменные разных типов (не менее 5)
    let num = 26;
    let str = "Hello World!";
    let isChecked = true;
    let bigNum = 123456789n;
    let arr = [1, 2, 3]; 

    // 1.2 Выведите типы всех переменных
    console.log("Задание 1: Базовые операции. Типы данных:");
    console.log("num -", typeof num);
    console.log("str -", typeof str);
    console.log("isChecked -", typeof isChecked);
    console.log("bigNum -", typeof bigNum);
    console.log("arr -", typeof arr);

    return true;
}

// ===== ЗАДАНИЕ 2: Функции =====
function getReviewerNumber(number, lab) {
    // 2.1 Функция определяющая номер ревьюера для вашей группы по вашему номеру и номеру лабораторной работы
    let rev_num = (number + lab) % 30;
    console.log("\nЗадание 2.1. Номер ревьюера:", rev_num);
    return rev_num;
}

function getVariant(number, variants) {
    // 2.2 Функция определяющая номер варианта, исходя из количества 
    let my_var_num = number % variants;
    if (my_var_num === 0)
    {
        my_var_num = variants;
    }
    console.log("\nЗадание 2.2. Номер варианта:", my_var_num);
    return my_var_num;
}

function calculate(a, b, operation) {
    // 2.3 Напишите функцию калькулятор, калькулятор обрабатывает следующие операции: +, -, *, /
    let res = 0;
    if (operation == "+"){
        res = a + b
    } 
    else if(operation == "-") {
        res = a - b;
    }
    else if(operation == "*") {
        res = a * b;
    }
    else if(operation == "/") {
        res = a / b;
    }
    console.log(`\nЗадание 2.3. Калькулятор: ${a + " " + operation + " " + b} =`, res);
    return res;
}

function calculateArea(figure, ...params) {
    // 2.4 Напишите функцию для определения площади фигур 'circle', 'rectangle', 'triangle'
    // Используйте switch.
    let area = 0;
    switch(figure)
    {
        case 'circle':
            const r = params[0];
            if (r <= 0)
            {
                console.log('\nЗадание 2.4. Радиус должен быть положительным числом');
                return;
            }
            else {
                area = Math.PI * (r ** 2);
                console.log(`\nЗадание 2.4. Площадь круга с радиусом ${r + ": " + area.toFixed(2)}`);
            }
            break;
        case 'rectangle':
            const a = params[0];
            const b = params[1];
            if ((a <= 0) || (b <= 0)){
                console.log('\nЗадание 2.4. Стороны прямогольника должны быть положительными числами');
            }
            else {
                area = a * b;
                console.log(`\nЗадание 2.4. Площадь прямоугольника ${a + "x" + b + ": " + area.toFixed(2)}`);
            }
            break;
        case 'triangle':
            const c = params[0];
            const h = params[1];
            if ((c <= 0) || (h <= 0)){
                console.log('\nЗадание 2.4. Сторона и(или) высота трегольника должны быть положительными числами');
            }
            else {
                area = (c * h) / 2;
                console.log(`\nЗадание 2.4. Площадь прямоугольника с высотой - ${h + " и стороной " + c + ": " + area.toFixed(2)}`);
            }
            break;
        default:
            console.log("\nЗадание 2.4. Неизвестная фигура");
            break;
    }
    return area;
}

// 2.5 Стрелочные функции
const reverseString = (str) => {
    // Функция возвращает перевернутую строку
    let reverse = str.split('').reverse().join('');
    console.log(`\nЗадание 2.5.1. ${str + " - " + reverse}`);
    return reverse;
};

const getRandomNumber = (min, max) => {
    // Функция возвращает случайное число между min и max
    let rand_number = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`\nЗадание 2.5.2. Случайное число от ${min} до ${max}: ${rand_number}`);
    return rand_number;
};
// ===== ЗАДАНИЕ 3: Объекты =====
const book = {
    // 3.1 Создайте объект "книга" с полями для хранения заголовка, автора,
    // года выпуска, количества страниц, и доступности
    // объект должен иметь два метода getInfo возвращает одной строкой информацию о названии книги, авторе, годе выпуска, количестве страниц
    // метод toggleAvailability - который меняет значение доступности и возвращает его
    title: "Ставок больше нет",
    author: "Жан-Поль Сартр",
    year: 1947,
    pages: 160,
    isAvailable: true,

    getInfo() {
        let info = `"${this.title}" (${this.author}), ${this.year} г., ${this.pages} стр.`;
        console.log("\nЗадание 3.1. Информация о книге:", info);
        return info;
    },

    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
        console.log("\nДоступность книги:", this.isAvailable);
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
        const arr_grades = Object.values(this.grades); 
        let sum = 0;
        for (let i = 0; i < arr_grades.length; i++) {
            sum += arr_grades[i];
        }
        const avg = sum / arr_grades.length;
        console.log("\nЗадание 3.2. Средний балл студента:", avg);
        return avg;
    },

    // Метод для добавления новой оценки
    addGrade(subject, grade) {
        this.grades[subject] = grade;
        console.log("\nДобавлена оценка:", subject, "=", grade);
    }
};

// ===== ЗАДАНИЕ 4: Массивы =====
function processArrays() {
    console.log("\nЗадание 4. Массивы:");
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
        if (num > 50) 
            console.log(num);
    });

    // 2. Используйте map для создания массива квадратов чисел
    const squares = numbers.map(num => {
        return num * num;
    });
    console.log("Квадраты чисел:", squares);

    // 3. Используйте filter для получения активных пользователей
    const activeUsers = users.filter(user => {
        return user.isActive === true;
    });
    console.log("Активные пользователи:", activeUsers);

    // 4. Используйте find для поиска пользователя с именем "Виктория"
    const victoria = users.find(user => {
        return user.name === "Виктория";
    });
    console.log("Найден пользователь Виктория:", victoria);

    // 5. Используйте reduce для подсчета суммы всех чисел
    const sum = numbers.reduce((acc, num) => {
        return acc + num;
    });
    console.log("Сумма всех чисел:", sum);

    // 6. Используйте sort для сортировки пользователей по возрасту (по убыванию)
    const sortedByAge = users.slice().sort((a, b) => {
        return b.age - a.age;
    });
    console.log("Пользователи по возрасту (убывание):", sortedByAge);

    // 7. Используйте метод для проверки, все ли пользователи старше 18 лет
    const allAdults = users.every(user => {
        return user.age > 18;
    });
    console.log("Все ли пользователи старше 18 лет:", allAdults);

    // 8. Создайте цепочку методов:
    //    - отфильтровать активных пользователей
    //    - преобразовать в массив имен
    //    - отсортировать по алфавиту
    const activeUserNames = users
        .filter(user => { return user.isActive; })
        .map(user => { return user.name; })
        .sort();
    console.log("Имена активных пользователей (по алфавиту):", activeUserNames);
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
        let maxId = 0;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id > maxId) {
                maxId = this.tasks[i].id;
            }
        }

        const newTask = {
            id: maxId + 1,
            title: title,
            completed: false,
            priority: priority
        };

        this.tasks.push(newTask);
        console.log("\nЗадание 5.1. Добавлена задача:", newTask);
        return newTask;
    },

    completeTask(taskId) {
        // 5.2 Отметка выполнения
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            console.log("\nЗадание 5.2. Задача", taskId, "выполнена");
            return true;
        }
        console.log("\nЗадание 5.2. Задача", taskId, "не найдена");
        return false;
    },

    // Удаление задачи
    deleteTask(taskId) {
        // 5.3
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            console.log("\nЗадание 5.3. Задача", taskId, "удалена");
            return true;
        }
        console.log("\nЗадание 5.3. Задача", taskId, "не найдена");
        return false;
    },

    // Получение списка задач по статусу
    getTasksByStatus(completed) {
        // 5.4
        const result = this.tasks.filter(t => t.completed === completed);
        console.log("\nЗадание 5.4. Задачи со статусом =", completed, ":", result);
        return result;
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
        const completionRate = total === 0 ? 0 : (completed / total) * 100;

        const stats = {
            total: total,
            completed: completed,
            pending: pending,
            completionRate: completionRate
        };
        console.log("\nЗадание 5.5. Статистика:", stats);
        return stats;
    }
};

// ===== ЗАДАНИЕ 6: Классы и наследование =====
function taskClasses() {
    // 6.1 Базовый класс Vehicle
    // В конструкторе принимайте и сохраняйте в this свойства:
    // make (марка), model (модель), year (год выпуска).
    class Vehicle {
        static vehicleCount = 0;  // 6.4 статическое свойство

        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this._year = year;
            Vehicle.vehicleCount++;
        }

        // Добавьте метод displayInfo(), который выводит в консоль информацию
        // о транспортном средстве в формате: "Марка: [make], Модель: [model], Год: [year]".
        displayInfo() {
            console.log(`\nЗадание 6.1. Марка: ${this.make}, Модель: ${this.model}, Год: ${this._year}`);
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
                console.log("Ошибка: год не может быть больше текущего");
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
            console.log(`\nЗадание 6.2. Количество дверей: ${this.numDoors}`);
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
            console.log(`\nЗадание 6.3. Емкость батареи: ${this.batteryCapacity} кВт·ч`);
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
        console.log("\nЗадание 7. Создание транспорта типа:", vehicleType);
        if (vehicleType === "vehicle") return new Vehicle(make, model, year);
        if (vehicleType === "car") return new Car(make, model, year, 4);
        if (vehicleType === "electric") return new ElectricCar(make, model, year, 4, 75);
        return null;
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
    const result = passwordRegex.test(password);
    console.log(`\nЗадание 8.2. Пароль "${password}" -`, result ? "валидный" : "невалидный");
    return result;
}

// ===== ТЕСТИРОВАНИЕ =====
function runTests() {
    console.log("=== ТЕСТИРОВАНИЕ ===");
    
    // Задание 1
    console.assert(simpleTask(), "Тест получения типов данных провален");

    // Задание 2
    console.assert(getReviewerNumber(5, 1) === 6, "Тест получения ревьюера провален");
    console.assert(getVariant(32, 6) === 2, "Тест вариант провален");
    console.assert(calculate(10, 5, '+') === 15, "Тест калькулятора провален");
    console.assert(calculate(10, 5, '/') === 2, "Тест калькулятора (/) провален");
    console.assert(calculateArea('rectangle', 4, 6) === 24, "Тест площадь фигуры провален");
    console.assert(calculateArea('circle', 1) > 3, "Тест площадь круга провален");
    console.assert(reverseString('шорох') === 'хорош', "Тест перевернуть строку провален");
    console.assert(getRandomNumber(10, 20), "Тест рандомное число провален");

    // Задание 3
    console.assert(book.getInfo().includes("Ставок больше нет"), "Тест book.getInfo провален");
    console.assert(book.toggleAvailability() === false, "Тест toggleAvailability провален");
    console.assert(student.getAverageGrade() === 90, "Тест среднего балла провален");
    student.addGrade("physics", 80);
    console.assert(student.grades.physics === 80, "Тест добавления оценки провален");

    // Задание 4
    processArrays(); // просто проверяем, что не падает

    // Задание 5
    console.assert((taskManager.getStats() || {}).total === 3, "Тест taskManager провален");
    const newTask = taskManager.addTask("Новая задача", "low");
    console.assert(newTask.id === 4, "Тест addTask провален");
    console.assert(taskManager.completeTask(1) === true, "Тест completeTask провален");
    console.assert(taskManager.deleteTask(2) === true, "Тест deleteTask провален");

    // Задание 6
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

    const createCarFactory = createVehicleFactory("car");
    const myNewCar = createCarFactory('BMW', 'X5', 2022);
    console.log('Создан новый автомобиль:');
    myNewCar.displayInfo();

    console.log('Всего создано транспортных средств:', Vehicle.getTotalVehicles());

    // Задание 8
    // Валидные пароли
    console.assert(validatePassword("Password1!") === true, "Пароль валидный");
    console.assert(validatePassword("MyP@ssw0rd") === true, "Пароль валидный");

    // Невалидные: длина
    console.assert(validatePassword("Aa1!") === false, "Слишком короткий");
    console.assert(validatePassword("") === false, "Пустая строка");

    // Невалидные: нет заглавной
    console.assert(validatePassword("password1!") === false, "Нет заглавной буквы");

    // Невалидные: нет строчной
    console.assert(validatePassword("PASSWORD1!") === false, "Нет строчной буквы");

    // Невалидные: нет цифры
    console.assert(validatePassword("Password!") === false, "Нет цифры");

    // Невалидные: нет спецсимвола
    console.assert(validatePassword("Password1") === false, "Нет спецсимвола");

    // Невалидные: недопустимые символы
    console.assert(validatePassword("Password 1!") === false, "Пробел не разрешён");
    console.assert(validatePassword("Password1!ы") === false, "Русская буква не разрешена");
    console.assert(validatePassword("Password1!?") === false, "? не разрешен");

    // Невалидные 
    console.assert(validatePassword("12345678") === false, "Только цифры");
    console.assert(validatePassword("!!!!!!!!") === false, "Только спецсимволы");
    console.assert(validatePassword("aaaaaaaa") === false, "Только строчные");

    console.log("Все тесты пройдены! ✅");

}

// Запуск тестов
runTests();