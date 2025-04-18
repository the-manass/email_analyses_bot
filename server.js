const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';
const USERS_FILE = './users.json';

app.use(cors());
app.use(bodyParser.json());

// Загружаем пользователей из файла
const loadUsers = () => {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// Сохраняем пользователей в файл
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Маршрут для регистрации
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны!' });
    }

    const users = loadUsers();
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль
    users.push({ email, password: hashedPassword });
    saveUsers(users);

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
});

// Маршрут для входа
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны!' });
    }

    const users = loadUsers();
    const user = users.find((user) => user.email === email);

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден!' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Неверный пароль!' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Успешный вход!', token });
});
const path = require('path');

// Подключение статических файлов (например, index.html, script.js, style.css)
app.use(express.static(path.join(__dirname, 'public')));

// Обработка запроса на корневой маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Добавлена проверка email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Изменение в маршруте регистрации
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: 'Некорректный email.' });
    }
});

module.exports = app;
