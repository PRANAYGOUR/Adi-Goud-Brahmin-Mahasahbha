// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.appspot.com",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Redirect if not logged in
if (!localStorage.getItem("userEmail")) {
    window.location.href = "index.html"; // 🔁 redirect to login page
}

async function fetchUserProfile() {
    try {
        console.log("📡 Fetching user profile from Firestore...");

        const emailFromLocalStorage = localStorage.getItem("userEmail");
        if (!emailFromLocalStorage) throw new Error("No user email found in storage.");

        const querySnapshot = await db.collection("members")
            .where("Email", "==", emailFromLocalStorage)
            .get();

        if (querySnapshot.empty) throw new Error("User not found in Firestore.");

        const userData = querySnapshot.docs[0].data();

        // ✅ Display name
        document.getElementById("userName").textContent = userData.Name || "User";

        // ✅ Use correct 'photo' field with fallback
        const userPhotoElement = document.getElementById("userPhoto");
        const photoURL = userData.photo || "./assets/default-user.png";

        userPhotoElement.src = photoURL;
        userPhotoElement.onerror = function () {
            this.onerror = null;
            this.src = "./assets/default-user.png";
        };

        // ✅ Save name and phone to localStorage
        localStorage.setItem("userName", userData.Name);
        localStorage.setItem("userPhone", userData.Phone);

        console.log("✅ User profile loaded successfully:", userData);
    } catch (error) {
        console.error("❌ Error loading user profile:", error);
    }
}

// ✅ Logout Function
function logout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    window.location.href = "index.html";
}

// ✅ Profile View Button Click Handler
function setupProfileLink() {
    const viewProfileBtn = document.getElementById("viewProfileLink");

    if (viewProfileBtn) {
        viewProfileBtn.addEventListener("click", () => {
            const name = localStorage.getItem("userName");
            const phone = localStorage.getItem("userPhone");

            if (name && phone) {
                const encodedName = encodeURIComponent(name);
                const encodedPhone = encodeURIComponent(phone);
                window.location.href = `profile.html?name=${encodedName}&phone=${encodedPhone}`;
            } else {
                alert("User details not available. Please login again.");
            }
        });
    }
}

// ✅ Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    fetchUserProfile();
    setupProfileLink();
    document.getElementById("logoutBtn").addEventListener("click", logout);
});
