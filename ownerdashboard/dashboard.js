// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPyEBGDaOFeWNI7HnYkBLK8oD-wqJYALk",
    authDomain: "car-rental-d2e24.firebaseapp.com",
    projectId: "car-rental-d2e24",
    storageBucket: "car-rental-d2e24.appspot.com",
    messagingSenderId: "1027982200496",
    appId: "1:1027982200496:web:992fca28f5a0b8cee79847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const availableCarsElement = document.querySelector('.box-info li:nth-child(1) h3');
const ongoingRentalsElement = document.querySelector('.box-info li:nth-child(2) h3');
const totalEarningsElement = document.querySelector('.box-info li:nth-child(3) h3');

// Load dashboard data
async function loadDashboardData() {
    try {
        // Get available cars count
        const carsQuery = query(collection(db, 'cars'));
        const carsSnapshot = await getDocs(carsQuery);
        availableCarsElement.textContent = carsSnapshot.size;

        // Get ongoing rentals
        const rentalsQuery = query(
            collection(db, 'rentals'),
            where('status', '==', 'ongoing')
        );
        const rentalsSnapshot = await getDocs(rentalsQuery);
        ongoingRentalsElement.textContent = rentalsSnapshot.size;

        // Calculate total earnings
        let total = 0;
        const completedRentalsQuery = query(
            collection(db, 'rentals'),
            where('status', '==', 'completed')
        );
        const completedRentalsSnapshot = await getDocs(completedRentalsQuery);
        completedRentalsSnapshot.forEach(doc => {
            const rental = doc.data();
            total += rental.totalAmount || 0;
        });
        totalEarningsElement.textContent = `Rs ${total}`;

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Setup realtime listeners for data updates
function setupRealtimeListeners() {
    // Listen for changes in rentals
    const rentalsQuery = query(collection(db, 'rentals'));
    onSnapshot(rentalsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified" || change.type === "removed") {
                loadDashboardData(); // Refresh dashboard data
            }
        });
    });

    // Listen for changes in cars
    const carsQuery = query(collection(db, 'cars'));
    onSnapshot(carsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified" || change.type === "removed") {
                loadDashboardData(); // Refresh dashboard data
            }
        });
    });
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loadDashboardData();
        setupRealtimeListeners();
    } else {
        // User is signed out, redirect to login
        window.location.href = '../login/owner.html';
    }
});

// Handle logout
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = '../login/owner.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}

// Handle dark mode toggle
const switchMode = document.getElementById('switch-mode');
if (switchMode) {
    switchMode.addEventListener('change', function () {
        document.body.classList.toggle('dark');
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    const user = auth.currentUser;
    if (user) {
        loadDashboardData();
        setupRealtimeListeners();
    }
});
