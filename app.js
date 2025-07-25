
// https://firebase.google.com/docs/web/setup#available-libraries

// web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz7mj7O99oDBKKj0-P9z_7WYYvhQzQgPM",
  authDomain: "paragons-d5d19.firebaseapp.com",
  projectId: "paragons-d5d19",
  storageBucket: "paragons-d5d19.firebasestorage.app",
  messagingSenderId: "1010812706852",
  appId: "1:1010812706852:web:90ce64afec09ee715d78b1",
  measurementId: "G-7450LRH3DT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
let loginForm, profileForm, authStatus, classmatesContainer;

// Check which page we're on and initialize accordingly
65
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('login-form')) {
        // Login page
        loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    } else if (document.getElementById('profile-form')) {
        // Profile page
        profileForm = document.getElementById('profile-form');
        profileForm.addEventListener('submit', handleProfileSubmit);
        checkAuthAndLoadProfile();
    } else {
        // Homepage
        authStatus = document.getElementById('auth-status');
        classmatesContainer = document.getElementById('classmates-container');
        checkAuthAndLoadClassmates();
    }
});

// Authentication state observer
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        if (authStatus) {
            authStatus.innerHTML = `
                <span>Welcome, ${user.email}</span>
                <a href="profile.html">Edit Profile</a>
                <button onclick="logout()">Logout</button>
            `;
        }
    } else {
        // User is signed out
        if (authStatus) {
            authStatus.innerHTML = '<a href="login.html">Login</a>';
        }
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => {
            document.getElementById('login-message').textContent = error.message;
        });
}

// Handle profile submission
function handleProfileSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const profileData = {
        uid: user.uid,
        email: user.email,
        fullName: document.getElementById('full-name').value,
        bio: document.getElementById('bio').value,
        contact: document.getElementById('contact').value,
        github: document.getElementById('github').value,
        linkedin: document.getElementById('linkedin').value,
        photoUrl: document.getElementById('photo-url').value,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('profiles').doc(user.uid).set(profileData)
        .then(() => {
            document.getElementById('profile-message').textContent = 'Profile saved successfully!';
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 1500);
        })
        .catch(error => {
            document.getElementById('profile-message').textContent = error.message;
        });
}

// Check auth and load profile data
function checkAuthAndLoadProfile() {
    const user = auth.currentUser;
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    db.collection('profiles').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('full-name').value = data.fullName || '';
                document.getElementById('bio').value = data.bio || '';
                document.getElementById('contact').value = data.contact || '';
                document.getElementById('github').value = data.github || '';
                document.getElementById('linkedin').value = data.linkedin || '';
                document.getElementById('photo-url').value = data.photoUrl || '';
            }
        });
}

// Check auth and load classmates
function checkAuthAndLoadClassmates() {
    const user = auth.currentUser;
    
    if (!user) {
        // Not logged in, but we'll still show public profiles
    }
    
    db.collection('profiles').orderBy('fullName').get()
        .then(querySnapshot => {
            classmatesContainer.innerHTML = '';
            querySnapshot.forEach(doc => {
                const data = doc.data();
                createClassmateCard(data);
            });
        });
}

//JS FOR THE EYE ICON ON THE LOGIN PAGE
const togglePassword = document.getElementById('togglePassword')
const passwordInput = document.getElementById('password')
togglePassword.addEventListener('click', function(){
const type = passwordInput.getAttribute('type') === 'password' ? 'text':'password';
passwordInput.setAttribute('type', type);});
