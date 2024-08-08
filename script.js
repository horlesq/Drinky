'use strict';

class DrinkingSession {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, number, duration) {
    this.coords = coords; // [lat, lng]
    this.number = number;
    this.duration = duration; // in hours
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.location[0].toUpperCase()}${this.location.slice(
      1
    )} drinking session on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;

    this.shortDescription = `${this.location[0].toUpperCase()}${this.location.slice(
      1
    )} drinking`;
  }
}

class PubDrinking extends DrinkingSession {
  location = 'pub';
  constructor(coords, number, duration, price) {
    super(coords, number, duration);
    this.price = price;
    this._setDescription();
  }
}

class OutdoorDrinking extends DrinkingSession {
  location = 'outdoor';
  constructor(coords, number, duration, vibe) {
    super(coords, number, duration);
    this.vibe = vibe;
    this._setDescription();
  }
}

//** APPLICATION */

const form = document.querySelector('.form');
const containerDrinks = document.querySelector('.drinks');
const inputLocation = document.querySelector('.form__input--location');
const inputNumber = document.querySelector('.form__input--number');
const inputDuration = document.querySelector('.form__input--duration');
const inputPrice = document.querySelector('.form__input--price');
const inputVibe = document.querySelector('.form__input--vibe');

class App {
  #map;
  #mapZoom = 13;
  #mapEvent;
  #drinkingSessions = [];

  constructor() {
    // Get user position
    this.#getPosition();

    // Get data from local storage
    this.#getLocalStorage();

    // Event handlers
    form.addEventListener('submit', this.#newSession.bind(this));
    inputLocation.addEventListener('change', this.#toggleVibeField);
    containerDrinks.addEventListener('click', this.#moveToPopup.bind(this));
  }

  // Get user position
  #getPosition() {
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
    }
  }

  // Load map
  #loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoom);

    // Display map
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this.#showForm.bind(this));

    // Display existing markers
    this.#drinkingSessions.forEach(drink => {
      this.#renderSessionMarker(drink);
    });
  }

  // Display form
  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputNumber.focus();
  }

  // Toggle between pub and outdoor form
  #toggleVibeField() {
    inputVibe.closest('.form__row').classList.toggle('form__row--hidden');
    inputPrice.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Create new session
  #newSession(e) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const positivInputs = (...inputs) => inputs.every(input => input > 0);

    e.preventDefault();

    // Get form data
    const drinkLocation = inputLocation.value;
    const drinkNumber = +inputNumber.value;
    const drinkDuration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let drinkingSession;

    // If activity - pub drinking - create pub session
    if (drinkLocation === 'pub') {
      const drinkPrice = +inputPrice.value;
      // Check data validity
      if (
        !validInputs(drinkNumber, drinkDuration, drinkPrice) ||
        !positivInputs(drinkNumber, drinkDuration, drinkPrice)
      )
        return alert('Inputs must be positive numbers!');

      drinkingSession = new PubDrinking(
        [lat, lng],
        drinkNumber,
        drinkDuration,
        drinkPrice
      );
    }

    // If activity - outdoor drinking - create outdoor session
    if (drinkLocation === 'outdoor') {
      const drinkVibe = inputVibe.value;
      // Check data validity
      if (
        !validInputs(drinkNumber, drinkDuration) ||
        !positivInputs(drinkNumber, drinkDuration)
      )
        return alert('Inputs must be positive numbers!');

      drinkingSession = new OutdoorDrinking(
        [lat, lng],
        drinkNumber,
        drinkDuration,
        drinkVibe
      );
    }

    // Add new object to session array
    this.#drinkingSessions.push(drinkingSession);

    // Render session on map
    this.#renderSessionMarker(drinkingSession);

    // Render session on list
    this.#renderSessionList(drinkingSession);

    // Clear form inputs & Hide form
    inputDuration.value = inputNumber.value = inputPrice.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => ((form.style.display = 'grid'), 1000));

    // Set local storage for all sessions
    this.#setLocalStorage();
  }

  // Display session as markers on map
  #renderSessionMarker(drinkingSession) {
    L.marker(drinkingSession.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${drinkingSession.location}-popup`,
        })
      )
      .setPopupContent(
        `${drinkingSession.location === 'pub' ? '🍻' : '🥤'} ${
          drinkingSession.shortDescription
        }`
      )
      .openPopup();
  }

  // Display session on drinks list
  #renderSessionList(drinkingSession) {
    let html = `
        <li class="session session--${drinkingSession.location}" data-id="${
      drinkingSession.id
    }">
          <h2 class="session__title">${drinkingSession.description}</h2>
            <div class="session__details">
                <span class="session__icon">${
                  drinkingSession.location === 'pub' ? '🍻' : '🥤'
                }</span>
                <span class="session__value">${drinkingSession.number}</span>
                <span class="session__unit">drinks</span>
            </div>
            <div class="session__details">
                <span class="session__icon">⏱</span>
                <span class="session__value">${drinkingSession.duration}</span>
                <span class="session__unit">hours</span>
            </div>
    `;

    if (drinkingSession.location === 'pub')
      html += `
            <div class="session__details">
                <span class="session__icon">💸</span>
                <span class="session__value">${drinkingSession.price}</span>
                <span class="session__unit">euros spent</span>
            </div>
        </li>
        `;

    if (drinkingSession.location === 'outdoor')
      html += `
            <div class="session__details">
                <span class="session__icon">💫</span>
                <span class="session__value">${drinkingSession.vibe}</span>
                <span class="session__unit">vibe</span>
            </div>
        </li>
        `;

    form.insertAdjacentHTML('afterend', html);
  }

  // Click on list element - move to respective marker on map
  #moveToPopup(e) {
    const drinkEl = e.target.closest('.session');
    if (!drinkEl) return;

    const session = this.#drinkingSessions.find(
      drink => drink.id === drinkEl.dataset.id
    );

    this.#map.setView(session.coords, this.#mapZoom, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  // Store sessions in local storage
  #setLocalStorage() {
    localStorage.setItem('sessions', JSON.stringify(this.#drinkingSessions));
  }

  // Retrieve data from local storage
  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('sessions'));

    if (!data) return;

    this.#drinkingSessions = data;
    this.#drinkingSessions.forEach(drink => {
      this.#renderSessionList(drink);
    });
  }

  // Delete sessions data from local storage
  reset() {
    localStorage.removeItem('sessions');
    location.reload();
  }
}

const app = new App();
