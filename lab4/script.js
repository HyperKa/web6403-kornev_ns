// Класс для хранения данных записи на прием
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

    // Метод форматированного вывода в консоль
    logToConsole() {
        console.log("=== ЗАПИСЬ НА ПРИЕМ ===");
        console.log(`ФИО: ${this.fullName}`);
        console.log(`Телефон: ${this.phone}`);
        console.log(`Email: ${this.email}`);
        console.log(`Специализация: ${this.getSpecialtyName(this.specialty)}`);
        console.log(`Дата: ${this.date}`);
        console.log(`Страховка: ${this.insurance ? 'Да' : 'Нет'}`);
        console.log(`Рассылка: ${this.newsletter ? 'Да' : 'Нет'}`);
        console.log(`Согласие: ${this.terms ? 'Да' : 'Нет'}`);
        console.log(`Время записи: ${this.timestamp}`);
        console.log("========================");
    }

    // Вспомогательный метод для получения названия специализации
    getSpecialtyName(specialtyKey) {
        const specialties = {
            'cardiologist': 'Кардиолог',
            'therapist': 'Терапевт',
            'surgeon': 'Хирург',
            'neurologist': 'Невролог'
        };
        return specialties[specialtyKey] || 'Не указана';
    }
}

// Обработчик отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(event) {
            // Отмена перезагрузки страницы
            event.preventDefault();
            
            // Получаем данные из формы
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const specialty = document.getElementById('specialty').value;
            const date = document.getElementById('date').value;
            const insurance = document.getElementById('insurance').checked;
            const newsletter = document.getElementById('newsletter').checked;
            const terms = document.getElementById('terms').checked;
            
            // Создаем объект записи
            const appointment = new Appointment(
                fullName, phone, email, specialty, date, insurance, newsletter, terms
            );
            
            // Выводим данные в консоль
            appointment.logToConsole();
            
            // Показываем сообщение об успешной записи
            alert(`Спасибо, ${fullName}! Ваша запись на ${date} принята. Данные отправлены в консоль.`);
            
            // Очищаем форму
            appointmentForm.reset();
        });
    }
});