# Drinky 

A web application for tracking drinking sessions, whether at a pub or outdoors. This application uses the browser's geolocation API to mark locations on a map where drinking sessions occur, allowing users to track the details of each session such as the number of drinks, duration, cost, and vibe. All session data is stored in the browser's local storage to maintain persistence across sessions.

![image](https://github.com/user-attachments/assets/6e7fdec8-d6d6-4a3c-8d7b-41df8dc48256)

## Features

- **Track Drinking Sessions**: Add new drinking sessions with details like location (pub or outdoor), number of drinks, duration, and additional specifics like price or vibe.
- **Geolocation and Mapping**: Utilizes the browser's geolocation to get the user's current location and place markers on a map.
- **Interactive Map**: Click on the map to log new drinking sessions or select a session from the list to navigate to its location.
- **Persistent Data**: All data is saved in the browser's local storage, ensuring no data is lost between sessions.
- **Dynamic Form Handling**: The form adjusts dynamically based on whether the session is at a pub or outdoors, displaying relevant fields.

## Demo

Check out the live demo of the project at: [Drinky](https://horlesq.github.io/Drinky/)

This application is a modified version of a project teached in ['The Complete JavaScript Course 2024: From Zero to Expert!'](https://www.udemy.com/course/the-complete-javascript-course/?couponCode=ST10MT8624)

## Usage

- **Adding a Drinking Session**:
  -  Click on the map to open the session form.
  -  Fill in the form fields (number of drinks, duration, price, or vibe depending on the location type).
  -  Submit the form to log the session.
- **Viewing and Interacting with Sessions**:
  -  Sessions are displayed as markers on the map. Click a marker to view details.
  -  A list of all sessions is shown below the map. Click on a session in the list to move the map to that session's location.
- **Switching Between Session Types**:
  -  Use the dropdown menu in the form to toggle between "Pub" and "Outdoor" sessions. The form will dynamically adjust to show relevant fields for each type.
**Resetting the Application**:
  -  To reset all data, use the reset function available in the console to clear local storage and refresh the application.

## Technologies

- HTML5
- CSS
- JavaScript (ES6+)
- [Leaflet.js](https://leafletjs.com/): An open-source library for interactive maps.

## Installation

To run this project locally, follow these steps:
1. **Clone the repository**:
```bash
git clone https://github.com/horlesq/drinky.git
```
2. **Navigate to the project directory**:
```bash
cd drinky
```
3. **Open index.html in your web browser**: Simply open the index.html file in your preferred web browser to start using the app.

## Contact

For any inquiries or feedback, feel free to reach out via:

- Email: adrian.horlescu@gmail.com
- Linkedin [Adrian Horlescu](https://www.linkedin.com/in/adrian-horlescu/)
- GitHub: [Horlesq](https://github.com/horlesq)

---

This application is a modified version of a project teached in ['The Complete JavaScript Course 2024: From Zero to Expert!'](https://www.udemy.com/course/the-complete-javascript-course/?couponCode=ST10MT8624)
