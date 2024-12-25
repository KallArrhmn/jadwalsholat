document.addEventListener('DOMContentLoaded', function() {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const loading = document.querySelector('.loading');
    const currentYearElement = document.getElementById('current-year');

    // Set the current year in the footer
    currentYearElement.textContent = new Date().getFullYear();

    searchButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            fetchCityCoordinates(city);
        } else {
            alert('Masukkan nama kota.');
        }
    });

    function fetchCityCoordinates(city) {
        loading.style.display = 'flex';
        fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const {
                        lat,
                        lon
                    } = data[0];
                    fetchPrayerSchedule(lat, lon);
                } else {
                    alert('Kota tidak ditemukan.');
                    loading.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching city coordinates:', error);
                loading.style.display = 'none';
            });
    }

    function fetchPrayerSchedule(lat, lon) {
        fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displaySchedule(data.data.timings);
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
                loading.style.display = 'none';
            });
    }

    function displaySchedule(schedule) {
        scheduleContainer.innerHTML = '';
        const prayerNames = {
            Imsak: 'Imsak',
            Fajr: 'Shubuh',
            Sunrise: 'Terbit',
            Dhuhr: 'Dzuhur',
            Asr: 'Ashar',
            Maghrib: 'Maghrib',
            Isha: 'Isya',
            Sunset: 'Matahari Terbenam',
            Midnight: 'Tengah Malam'
        };

        for (const [prayer, time] of Object.entries(schedule)) {
            if (prayerNames[prayer]) {
                const prayerElement = document.createElement('div');
                prayerElement.classList.add('prayer-item');
                prayerElement.innerHTML = `<strong>${prayerNames[prayer]}</strong>: ${time}`;
                scheduleContainer.appendChild(prayerElement);
            }
        }
    }

    // Hide the loading animation after the initial load with a delay
    window.addEventListener('load', function() {
        setTimeout(function() {
            loading.style.display = 'none';
        }, 1000); // Adjust the delay as needed
    });
});