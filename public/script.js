// Элементы DOM
const introSection = document.getElementById('introSection');
const mainMenu = document.getElementById('mainMenu');
const mainHeader = document.getElementById('mainHeader');
const loginIntroBtn = document.getElementById('loginIntroBtn');
const signupIntroBtn = document.getElementById('signupIntroBtn');
const contentSection = document.getElementById('contentSection');


// Создаём модальное окно для входа
function createLoginForm() {
    const form = document.createElement('div');
    form.classList.add('modal');
    form.innerHTML = `
        <form id="loginForm" class="auth-form">
            <h2>Войти</h2>
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Введите ваш email" required />
            <label for="password">Пароль:</label>
            <input type="password" id="password" placeholder="Введите ваш пароль" required />
            <button type="submit">Вход</button>
            <button type="button" id="closeLoginForm">Отмена</button>
        </form>
    `;
    document.body.appendChild(form);

    form.querySelector('#loginForm').onsubmit = async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Сохраняем токен
                alert('Вход выполнен успешно!');
                document.body.removeChild(form); // Закрываем окно входа
                showMainMenu(); // Переход в главное меню
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка соединения с сервером.');
        }
    };

    form.querySelector('#closeLoginForm').onclick = () => document.body.removeChild(form);
}

// Создаём окно для регистрации
function createSignupForm() {
    const form = document.createElement('div');
    form.classList.add('modal');
    form.innerHTML = `
        <form id="signupForm" class="auth-form">
            <h2>Создать аккаунт</h2>
            <label for="signupEmail">Email:</label>
            <input type="email" id="signupEmail" placeholder="Введите ваш email" required />
            <label for="signupPassword">Пароль:</label>
            <input type="password" id="signupPassword" placeholder="Введите пароль" required />
            <label for="confirmPassword">Подтвердите пароль:</label>
            <input type="password" id="confirmPassword" placeholder="Повторите пароль" required />
            <button type="submit">Создать</button>
            <button type="button" id="closeSignupForm">Отмена</button>
        </form>
    `;
    document.body.appendChild(form);

    form.querySelector('#signupForm').onsubmit = async (e) => {
        e.preventDefault();

        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                alert('Регистрация прошла успешно! Теперь вы можете войти в систему.');
                document.body.removeChild(form); // Закрываем окно регистрации
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка соединения с сервером.');
        }
    };

    form.querySelector('#closeSignupForm').onclick = () => document.body.removeChild(form);
}

// Логика нажатия "Вход"
loginIntroBtn.addEventListener('click', () => {
    createLoginForm(() => {
        document.body.removeChild(document.querySelector('.modal'));
        introSection.style.display = 'none';
        mainHeader.style.display = 'block';
        mainMenu.style.display = 'block';
    });
});

// Логика нажатия "Создать аккаунт"
signupIntroBtn.addEventListener('click', () => {
    createSignupForm(() => {
        document.body.removeChild(document.querySelector('.modal'));
        // Показ основного окна после успешной регистрации
        introSection.style.display = 'none';
        mainHeader.style.display = 'block';
        mainMenu.style.display = 'block';
    });
});

// Пример переключения секций в основном меню
document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('data-section') + 'Section';
        document.querySelectorAll('.content section').forEach((section) => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    });
});

// Логика для строки поиска
document.querySelector('.search-bar').addEventListener('input', (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    console.log(`Вы ввели запрос: ${searchValue}`);
    // Логика поиска сообщений будет добавлена в будущем
});


const fs = require('fs');
const usersFilePath = path.join(__dirname, 'users.json');

// Функция для чтения данных из файла users.json
function readUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения файла users.json:', error);
        return [];
    }
}

// Функция для записи данных в файл users.json
function writeUsersToFile(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Ошибка записи в файл users.json:', error);
    }
}

function showMainMenu() {
    introSection.style.display = 'none'; // Скрываем вступительное окно
    mainMenu.style.display = 'flex'; // Показываем главное меню (включая левую панель и основное пространство)
    mainHeader.style.display = 'flex'; // Отображаем заголовок сайта
    mainHeader.innerHTML = `
        <h1 class="header-title">
            <span class="gmail">Gmail</span> <span class="highlight">+bot</span>
        </h1>
    `;
}


// JavaScript для управления панелью
const sidebar = document.querySelector('.left-sidebar');
const toggleButton = document.querySelector('.sidebar-toggle');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('open'); // Переключение класса панели
});

// Дополнительная проверка email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


// script.js

// script.js

// Инициализация события при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Находим все элементы меню
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSection = document.getElementById('contentSection');

    // Добавляем обработчик события для кнопки "Входящие"
    menuItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            const selectedText = item.querySelector('.menu-text').textContent.trim();
            updateContent(selectedText);
        });
    });
});

// Функция обновления контента
function updateContent(selectedText) {
    const contentSection = document.getElementById('contentSection');
    if (contentSection) {
        contentSection.innerHTML = `
            <h2>${selectedText}</h2>
            <p>Вы выбрали раздел «${selectedText}». Здесь отображается соответствующий контент.</p>
        `;
    } else {
        console.error('Элемент contentSection не найден');
    }
}


