// Firebase configuration (Ensure this is in your main Firebase config file)
const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.firebasestorage.app",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to get Google Drive images properly formatted
const getGoogleDriveImage = (url) => {
    const match = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}=s220` : url;
};

// Load Office Bearers from Firestore
document.addEventListener("DOMContentLoaded", loadOfficeBearers);

async function loadOfficeBearers() {
    const officeBearersDiv = document.getElementById("officeBearersList");
    officeBearersDiv.innerHTML = "<p>Loading office bearers...</p>";

    try {
        console.log("📡 Fetching data from Firestore...");
        const querySnapshot = await db.collection("officebearers").get();

        if (querySnapshot.empty) {
            officeBearersDiv.innerHTML = "<p>No office bearers found.</p>";
            console.error("❌ No data found in Firestore");
            return;
        }

        officeBearersDiv.innerHTML = ""; // Clear loading message

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.name || "Unknown";
            const designation = data.designation || "N/A";
            const phone = data.phone || "N/A";
            const email = data.email || "N/A";
            const photoUrl = getGoogleDriveImage(data.photo); // Convert Google Drive link

            const div = document.createElement("div");
            div.classList.add("office-bearer-item");
            div.innerHTML = `
                <img src="${photoUrl}" class="profile-pic" onerror="this.src='./icons/logo.png';">
                <div class="info">
                    <h3>${name}</h3>
                    <p><strong>${designation}</strong></p>
                    <p>📞 <a href="tel:${phone}">${phone}</a></p>
                    <p>✉ <a href="mailto:${email}">${email}</a></p>
                </div>
            `;

            officeBearersDiv.appendChild(div);
        });

    } catch (error) {
        officeBearersDiv.innerHTML = "<p>Error fetching data.</p>";
        console.error("❌ Error fetching data from Firestore:", error);
    }
}
