// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.firebasestorage.app",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Handle Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim().toLowerCase();
    let phone = document.getElementById("phone").value.trim();
    let messageBox = document.getElementById("message");
    let verifyButton = document.querySelector("button");

    messageBox.innerHTML = "";
    verifyButton.textContent = "Verifying...";
    verifyButton.disabled = true;

    // Clear session data
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    try {
        console.log("📡 Fetching data from Firestore...");

        const snapshot = await db.collection("members").get();

        let isValid = false;
        let userName = "";

        snapshot.forEach((doc) => {
            const data = doc.data();
            const docEmail = (data.Email || "").toLowerCase().trim();
            const docPhone = String(data.Phone || "").trim();  // ✅ FIXED: Ensuring .trim() works

            if (email === docEmail && phone === docPhone) {
                isValid = true;
                userName = data.Name || "User";
            }
        });

        if (isValid) {
            console.log("✅ Login success for:", email);

            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", userName);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);
        } else {
            console.log("❌ Invalid login for:", email);
            messageBox.innerHTML = "<p class='error-message'>❌ Invalid Email or Phone Number.</p>";
        }

    } catch (error) {
        console.error("❌ Error:", error);
        messageBox.innerHTML = `<p class='error-message'>${error.message}</p>`;
    } finally {
        verifyButton.textContent = "Verify";
        verifyButton.disabled = false;
    }
});
