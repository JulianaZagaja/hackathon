// Common Functions
function emergency() {
    // In a real application, this would connect to emergency services
    alert("Calling emergency services...");
    // You would implement actual emergency calling functionality here
}

// Add logo click handler
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

// Check if user is logged in as caregiver
function isCaregiver() {
    return new URLSearchParams(window.location.search).get('mode') === 'caregiver';
}

// Todo List Functionality
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

function addTask() {
    const input = document.getElementById('new-task');
    const taskText = input.value.trim();
    
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            reminderTime: new Date(Date.now() + 3600000) // Default reminder in 1 hour
        };
        
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        renderTasks();
        setReminder(task);
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[onclick*="${filter}"]`).classList.add('active');
    renderTasks();
}

function renderTasks() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;

    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
        `;
        taskList.appendChild(taskElement);
    });
}

function setReminder(task) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    
    const reminderInterval = setInterval(() => {
        if (!task.completed) {
            if (Notification.permission === 'granted') {
                new Notification('Task Reminder', {
                    body: `Don't forget to: ${task.text}`,
                    icon: 'path-to-your-icon.png'
                });
            }
        } else {
            clearInterval(reminderInterval);
        }
    }, 1800000); // Reminder every 30 minutes until completed
}

// Voice Memo Functionality
document.querySelectorAll('.memo i').forEach(button => {
    button.addEventListener('click', () => {
        alert('Playing voice memo...');
    });
});

// Family Info Functionality
function callFamily(phoneNumber) {
    alert(`Calling ${phoneNumber}...`);
    // In a real application, this would initiate a phone call
}

// Photo Album Functionality
const photos = [
    {
        id: 6,
        date: new Date('2024-05-20'),
        src: "https://media.istockphoto.com/id/657915048/photo/multi-generation-family-playing-a-board-game.jpg?s=612x612&w=0&k=20&c=vaWeSHLrFKADtQk-dRlNmIBeCBRYI6GK3QxHW8HDUSc=",
        alt: "Family Game Night",
        caption: "Weekly Family Game Night",
        people: "Everyone enjoying board games and puzzles",
        categories: ["recent", "family"]
    },
    {
        id: 5,
        date: new Date('2024-05-08'),
        src: "https://images.stockcake.com/public/f/1/2/f12b60a0-0e79-4e85-9169-7ae14c602c66_large/baking-with-grandma-stockcake.jpg",
        alt: "Baking Day",
        caption: "Cookie Baking with Grand-daughter",
        people: "Teaching Emma and Michael family recipes",
        categories: ["recent"]
    },
    {
        id: 4,
        date: new Date('2024-04-15'),
        src: "https://images.stockcake.com/public/b/3/9/b3965616-c872-4ea4-bdfe-bc3682a8a7b7_large/gardening-with-grandma-stockcake.jpg",
        alt: "Garden Day",
        caption: "Spring Garden Planting",
        people: "With Sarah and Emma",
        categories: ["recent"]
    },
    {
        id: 3,
        date: new Date('2024-03-03'),
        src: "https://familyfriendlytampabay.com/wp-content/uploads/2019/12/96908990_m-e1606604978422.jpg",
        alt: "Birthday Party",
        caption: "Emma's 9th Birthday Party",
        people: "Emma blowing out candles",
        categories: ["recent", "family"]
    },
    {
        id: 2,
        date: new Date('2023-12-25'),
        src: "https://entail-assets.com/artzabox/fit-in/680x454/shutterstock_455965297-1632384933126.jpg",
        alt: "Christmas Celebration",
        caption: "Christmas Morning Gift Opening",
        people: "Whole family gathering",
        categories: ["holidays", "family"]
    },
    {
        id: 1,
        date: new Date('2023-07-04'),
        src: "https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/bltd7de2531ef9e7421/66707cbcf5dc643008b6c8d9/picnic-mothers-day-hero.jpg?q=70&width=3840&auto=webp",
        alt: "Family Picnic",
        caption: "Family Picnic at Central Park",
        people: "With Sarah, Michael, and Emma",
        categories: ["family"]
    }
];

// Filter and sort photos when the dropdown changes
const albumFilter = document.getElementById('album-filter');
if (albumFilter) {
    albumFilter.addEventListener('change', updatePhotoDisplay);
}

function updatePhotoDisplay() {
    const filter = albumFilter.value;
    const photoGrid = document.querySelector('.photo-grid');
    if (!photoGrid) return;

    // Clear current photos
    photoGrid.innerHTML = '';

    // Filter and sort photos
    let filteredPhotos = [...photos];
    
    // Apply category filter
    if (filter !== 'all') {
        filteredPhotos = filteredPhotos.filter(photo => photo.categories.includes(filter));
    }

    // Sort by date (most recent first)
    filteredPhotos.sort((a, b) => b.date - a.date);

    // Create and append photo cards
    filteredPhotos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="${photo.alt}">
            <div class="photo-info">
                <p class="date">${photo.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p class="caption">${photo.caption}</p>
                <p class="people">${photo.people}</p>
            </div>
        `;
        photoGrid.appendChild(photoCard);
    });
}

// Initialize photo display on page load
if (document.querySelector('.photo-grid')) {
    updatePhotoDisplay();
}

// Location Functionality
let map;
let currentMarker;
let importantPlaces = {
    home: { lat: 0, lng: 0, title: 'Home' },
    hospital: { lat: 0, lng: 0, title: 'Hospital' },
    pharmacy: { lat: 0, lng: 0, title: 'Pharmacy' }
};

function initMap() {
    if (!document.getElementById('map')) return;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: currentLocation,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry",
                        "stylers": [{"color": "#f5f5f5"}]
                    }
                ]
            });

            // Add marker for current location
            currentMarker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: 'You are here',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF"
                }
            });

            // Set up important places
            setupImportantPlaces(currentLocation);
            updateCurrentAddress(currentLocation);
        });
    }
}

function setupImportantPlaces(currentLocation) {
    // In a real application, these would be stored in a database
    importantPlaces.home.lat = currentLocation.lat + 0.01;
    importantPlaces.home.lng = currentLocation.lng;
    importantPlaces.hospital.lat = currentLocation.lat;
    importantPlaces.hospital.lng = currentLocation.lng + 0.01;
    importantPlaces.pharmacy.lat = currentLocation.lat - 0.01;
    importantPlaces.pharmacy.lng = currentLocation.lng;

    Object.values(importantPlaces).forEach(place => {
        new google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: map,
            title: place.title
        });
    });
}

function updateCurrentAddress(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK') {
            document.getElementById('current-address').textContent = 
                results[0].formatted_address;
        }
    });
}

function navigateTo(destination) {
    const place = importantPlaces[destination];
    if (place && map) {
        map.setCenter({ lat: place.lat, lng: place.lng });
        map.setZoom(18);
    }
}

function refreshLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            if (currentMarker) {
                currentMarker.setPosition(newLocation);
            }
            
            map.setCenter(newLocation);
            updateCurrentAddress(newLocation);
        });
    }
}

// Initialize functionality based on current page
window.onload = function() {
    // Initialize map if on location page
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Initialize tasks if on todo page
    if (document.querySelector('.task-list')) {
        renderTasks();
    }
};
