document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '7f7133310b638d9150eb979f3355929b';
    const searchButton = document.querySelector('.search-btn');
    const input = document.getElementById('input');

    searchButton.addEventListener('click', function () {
        const city = input.value;
        getWeatherData(city);
    });

    async function getWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            console.error('Error fetching the weather data:', error);
            alert('Перевірте правильність назви або ж спробуйте ввести англійською мовою!');
        }
    }

    function updateWeatherUI(data) {
        const cityTitle = document.querySelector('.city__title');
        const dateElement = document.querySelector('.date');
        const temperature = document.querySelector('.temperature');
        const feelsLike = document.querySelector('.feels-like');
        const mainWeatherImg = document.querySelector('.main__weather-img');
        const mainWeatherText = document.querySelector('.main__weather-text');
        const sunrise = document.querySelector('.sunrise');
        const sunset = document.querySelector('.sunset');
        const humidity = document.querySelector('.huminidy');
        const windSpeed = document.querySelector('.wind-speed');
        const windDir = document.querySelector('.wind-dir');
        const airPressure = document.querySelector('.air-press');
        const dailyForecast = document.querySelectorAll('.weather__item.daily');

        cityTitle.textContent = data.city.name;
        dateElement.textContent = new Date(data.list[0].dt_txt).toLocaleDateString('uk-UA', { month: 'long', day: 'numeric', weekday: 'long' });
        temperature.innerHTML = `${data.list[0].main.temp.toFixed(1)}&deg;C`;
        feelsLike.innerHTML = `відчувається як: ${data.list[0].main.feels_like.toFixed(1)}&deg;C`;
        mainWeatherText.textContent = data.list[0].weather[0].description;

        // Convert Unix time to human-readable time
        const sunriseTime = new Date(data.city.sunrise * 1000);
        const sunsetTime = new Date(data.city.sunset * 1000);
        sunrise.textContent = `схід сонця: ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`;
        sunset.textContent = `захід сонця: ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`;

        humidity.textContent = `вологість: ${data.list[0].main.humidity}%`;
        windSpeed.textContent = `швидкість вітру: ${data.list[0].wind.speed} m/s`;
        windDir.textContent = `напрям вітру: ${data.list[0].wind.deg}°`;
        airPressure.textContent = `Атмосферний тиск: ${data.list[0].main.pressure} hPa`;

        dailyForecast.forEach((item, index) => {
            if (index < data.list.length) {
                const dailyDate = new Date(data.list[index * 8].dt_txt);
                item.querySelector('.daily-temp').innerHTML = `${data.list[index * 8].main.temp.toFixed(1)}&deg;C`;
                item.querySelector('.daily-day').textContent = dailyDate.toLocaleDateString('uk-UA', { weekday: 'long' });
                item.querySelector('.daily-img').src = getWeatherIcon(data.list[index * 8].weather[0].icon);
            }
        });
        const weatherCard = document.querySelector('.weather__card');
        weatherCard.style.visibility = 'visible';

        // Оновлюємо зображення погоди
        const iconCode = data.list[0].weather[0].icon;
        mainWeatherImg.src = getWeatherIcon(iconCode);
    }

    function getWeatherIcon(iconCode) {
        return `http://openweathermap.org/img/wn/${iconCode}.png`;
    }
});
