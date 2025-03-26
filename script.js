// Firebase Configuration (Your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyC1Lc1QGUf8-QZv0_aDbCb5-bQLbl7aL7U",
    authDomain: "workout-tracker-d1e86.firebaseapp.com",
    projectId: "workout-tracker-d1e86",
    storageBucket: "workout-tracker-d1e86.firebasestorage.app",
    messagingSenderId: "869399078280",
    appId: "1:869399078280:web:116627e28adb552706063d",
    measurementId: "G-8V6GQVFWHQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Log Out
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html"; // Redirect to login page
    });
}

// Load Workout History
function loadWorkoutHistory() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first!");
        return;
    }

    db.collection("workouts").where("userId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .get()
        .then((snapshot) => {
            let historyDiv = document.getElementById("history");
            historyDiv.innerHTML = "<h3>Your Workout History:</h3>";
            snapshot.forEach(doc => {
                const data = doc.data();
                historyDiv.innerHTML += `<p>${data.exercise} - ${data.weight} lbs x ${data.reps} reps</p>`;
            });
        });
}

// Load Workouts for Each Day
function loadWorkout(day) {
    const container = document.getElementById("workout-list");
    container.innerHTML = `<h3>Workout for Day ${day}</h3>`;
    const workouts = {
        1: ["Bench Press - 4x5", "Overhead Press - 4x5", "Weighted Dips - 3x6-8"],
        2: ["Deadlifts - 4x5", "Weighted Pull-Ups - 4x6-8", "Bent Over Rows - 3x8-10"],
        3: ["Squats - 4x5", "Romanian Deadlifts - 3x8-10", "Leg Press - 3x12"],
        4: ["Incline Dumbbell Press - 4x8-10", "Machine Shoulder Press - 4x10-12", "Chest Flys - 3x12-15"],
        5: ["Lat Pulldown - 4x10-12", "Seated Cable Row - 3x10-12", "Hammer Curls - 3x12-15"],
        6: ["Bulgarian Split Squats - 3x10-12", "Seated Calf Raises - 4x12-15", "Hamstring Curls - 3x12-15"]
    };

    workouts[day].forEach(exercise => {
        container.innerHTML += `<div><h4>${exercise}</h4>
            <input type="number" placeholder="Weight"> 
            <input type="number" placeholder="Reps"></div>`;
    });
}

// Save Workout Data
function saveWorkout() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in!");
        return;
    }

    const workoutData = [];
    document.querySelectorAll("#workout-list div").forEach(div => {
        const exercise = div.querySelector("h4").textContent;
        const weight = div.querySelector("input[placeholder='Weight']").value || "N/A";
        const reps = div.querySelector("input[placeholder='Reps']").value || "N/A";
        workoutData.push({ exercise, weight, reps });
    });

    db.collection("workouts").add({ userId: user.uid, workoutData, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => alert("Workout saved!"))
        .catch(error => console.error(error));
}
