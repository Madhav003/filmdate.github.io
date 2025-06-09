document.addEventListener('DOMContentLoaded', () => {
    const monthSelector = document.getElementById('month-selector');
    const daySelector = document.getElementById('day-selector');
    const searchButton = document.getElementById('search-button');
    const movieGrid = document.getElementById('movie-grid');
    const resultsTitle = document.getElementById('results-title');
    const loader = document.getElementById('loader');
    const noResultsMessage = document.getElementById('no-results');

    function populateDays(selectedMonth) {
        daySelector.innerHTML = '';
        const daysInMonth = new Date(2024, selectedMonth, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            daySelector.appendChild(option);
        }
    }

    async function loadMoviesForDate(month, day) {
        movieGrid.innerHTML = '';
        loader.classList.remove('hidden');
        noResultsMessage.classList.add('hidden');
        resultsTitle.textContent = `Finding movies for ${month}-${day}...`;
        const filePath = `./data/${month}-${day}.json`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) { throw new Error('No data file for this date.'); }
            const movies = await response.json();
            if (movies.length === 0) { throw new Error('Data file is empty.'); }
            resultsTitle.textContent = `Movies Released on ${month}-${day}`;
            displayMovies(movies);
        } catch (error) {
            console.warn(error.message);
            resultsTitle.textContent = `Results for ${month}-${day}`;
            noResultsMessage.classList.remove('hidden');
        } finally {
            loader.classList.add('hidden');
        }
    }

    function displayMovies(movies) {
        movies.forEach((movie, index) => {
            const movieLink = document.createElement('a');
            movieLink.classList.add('movie-card');
            movieLink.href = movie.tmdb_url;
            movieLink.target = '_blank';
            movieLink.rel = 'noopener noreferrer';
            const posterUrl = movie.poster_url ? movie.poster_url : 'https://via.placeholder.com/220x330.png?text=No+Poster';
            movieLink.innerHTML = `
                <img src="${posterUrl}" alt="Poster for ${movie.title}">
                <div class="movie-card-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date}</p>
                </div>
            `;
            movieLink.style.animationDelay = `${index * 0.05}s`;
            movieGrid.appendChild(movieLink);
        });
    }

    monthSelector.addEventListener('change', () => {
        populateDays(monthSelector.value);
    });

    searchButton.addEventListener('click', () => {
        const month = String(monthSelector.value).padStart(2, '0');
        const day = String(daySelector.value).padStart(2, '0');
        loadMoviesForDate(month, day);
    });

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    monthSelector.value = currentMonth;
    populateDays(currentMonth);
    daySelector.value = currentDay;
    searchButton.click();
});