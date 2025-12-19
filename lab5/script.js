console.log("скрипт script.js успешно подключен!"); 

// Класс для хранения данных записи (остается без изменений)
class Appointment {
    constructor(fullName, phone, email, specialty, date, insurance, newsletter, terms) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.specialty = specialty;
        this.date = date;
        this.insurance = insurance;
        this.newsletter = newsletter;
        this.terms = terms;
        this.timestamp = new Date().toLocaleString();
    }

    logToConsole() {
        console.log("=== ЗАПИСЬ НА ПРИЕМ (ДАННЫЕ ДЛЯ ОТПРАВКИ) ===");
        console.log(this);
        console.log("==============================================");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    // Если на странице с формой - добавить обработчиков!
    // Если на странице contacts есть форма <form id="appointmentForm" class="form"> ? True : null
    if (appointmentForm) {
        // создание ссылки на элемент поля ввода
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');

        // Динамическая валидация: 
        const validators = {
            fullName: (value) => value.trim().length > 2 ? '' : 'ФИО должно содержать минимум 3 символа.',
            phone: (value) => /^\+?[78][-\s(]?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(value) ? '' : 'Введите корректный номер телефона.',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Введите корректный email.'
        };
        

        // Механизм шаблонных строк - inputElement.id позволяет получить из поля id = {fullName, phone, email}
        const validateInput = (inputElement) => {
            const errorElement = document.getElementById(`${inputElement.id}Error`);
            // Обращение к конкретному правилу в словаре. Если правила нет, пусть поле будет валидным
            const validator = validators[inputElement.id];
            if (!validator) return true; 
            
            const errorMessage = validator(inputElement.value);
            // textContent - это объект span в коде со свойством textContent
            errorElement.textContent = errorMessage;
            // Этот CSS класс применяется для поля только, когда true на ошибке
            inputElement.classList.toggle('invalid', !!errorMessage); 
            return !errorMessage;
        };

        // Добавляем слушатель на ввод для каждого поля
        fullNameInput.addEventListener('input', () => validateInput(fullNameInput));
        phoneInput.addEventListener('input', () => validateInput(phoneInput));
        emailInput.addEventListener('input', () => validateInput(emailInput));
        

        appointmentForm.addEventListener('submit', function(event) {
            // отмена стандартного поведения браузера - перехват формы
            event.preventDefault();
            
            // Финальная валидация перед отправкой
            const isFullNameValid = validateInput(fullNameInput);
            const isPhoneValid = validateInput(phoneInput);
            const isEmailValid = validateInput(emailInput);
            
            if (!isFullNameValid || !isPhoneValid || !isEmailValid) {
                alert('Пожалуйста, исправьте ошибки в форме.');
                return;
            }
            
            // Собираем данные в объект
            const formData = new FormData(appointmentForm);
            const appointmentData = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                specialty: formData.get('specialty'),
                date: formData.get('date'),
                insurance: formData.get('insurance') === 'on',
                newsletter: formData.get('newsletter') === 'on',
                terms: formData.get('terms') === 'on',
                timestamp: new Date().toISOString()
            };
            
            const appointment = new Appointment(
                appointmentData.fullName, appointmentData.phone, appointmentData.email,
                appointmentData.specialty, appointmentData.date, appointmentData.insurance,
                appointmentData.newsletter, appointmentData.terms
            );
            
            appointment.logToConsole(); // Выводим данные в консоль для проверки
            
            // Отправляем данные на mock-сервер
            fetch('http://localhost:3000/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            })
            .then(response => {
                if (!response.ok) {
                    // Если сервер ответил ошибкой (например, 404 или 500)
                    throw new Error('Сетевой ответ был не в порядке.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Ответ от сервера:', data);
                alert(`Спасибо, ${appointmentData.fullName}! Ваша запись успешно отправлена.`);
                // Очистка полей формы и сообщений об ошибках
                appointmentForm.reset();
                document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
                document.querySelectorAll('.form__input.invalid').forEach(el => el.classList.remove('invalid'));
            })
            .catch(error => {
                console.error('Проблема с операцией fetch:', error);
                alert('Произошла ошибка при отправке записи. Пожалуйста, попробуйте позже.');
            });
        });
    }

    // асинхронный запрос и периодическое обновление
    
    const newsContainer = document.getElementById('news-container');

    // Если на главной странице, где есть блок для новостей
    if (newsContainer) {

        // Функция для отрисовки успешного результата
        function updateNewsList(news) {
            newsContainer.innerHTML = ''; // очистка старых новостей
            const newsList = document.createElement('ul');
            newsList.className = 'news-list';

            news.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'news-list__item';
                listItem.textContent = `[${item.date}] ${item.title}`;
                newsList.appendChild(listItem);
            });
            newsContainer.appendChild(newsList);
        }

        // вывод ошибки
        function showNewsError(error) {
            console.error('Не удалось загрузить новости:', error);
            newsContainer.innerHTML = '<p class.="error-message">Не удалось загрузить новости. Попробуйте обновить страницу.</p>';
        }
        
        const fetchNews = async () => {
            console.log('Запрашиваю новости...');
            try {
                const response = await fetch('http://localhost:3000/news');

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const news = await response.json();
                updateNewsList(news);

            } catch (error) {
                showNewsError(error);
            }
        };

        // --- Запуск периодического обновления ---
        fetchNews(); // Первичная загрузка новостей
        setInterval(fetchNews, 25000); // Обновление каждые 25 секунд
    }
});