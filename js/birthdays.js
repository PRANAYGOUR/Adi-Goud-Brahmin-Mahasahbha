// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.appspot.com",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// ✅ Initialize Firebase (Prevent multiple initializations)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ✅ Define Correct Field Name (Check Firestore)
const dobFieldName = "Date of birth"; // Ensure Firestore has this exact field name

async function loadBirthdays(selectedMonth = "") {
    try {
        console.log("📡 Fetching birthday data from Firestore...");

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        const querySnapshot = await db.collection("members").get();

        if (querySnapshot.empty) {
            console.error("❌ No members found in Firestore.");
            return;
        }

        console.log("🔥 Firestore Data:", querySnapshot.docs.map(doc => doc.data()));

        const birthdays = querySnapshot.docs
            .map(doc => {
                const data = doc.data();
                if (!data[dobFieldName]) {
                    console.warn("⚠️ Missing DOB for:", data.Name || "Unknown");
                    return null;
                }

                let dobParts = data[dobFieldName].split(/[-/]/);
                if (dobParts.length !== 3) {
                    console.error("❌ Invalid DOB format:", data[dobFieldName]);
                    return null;
                }

                const day = String(parseInt(dobParts[0], 10)).padStart(2, "0");
                const month = String(parseInt(dobParts[1], 10)).padStart(2, "0");

                return {
                    name: data.Name || "Unknown",
                    phone: data.Phone || "",
                    dob: `${day}.${month}`,
                    day,
                    month,
                    monthOnly: month
                };
            })
            .filter(member => member !== null);

        console.log("🎉 Processed Birthdays:", birthdays);

        displayBirthdays(birthdays, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("❌ Error loading data from Firestore:", error);
    }
}

// ✅ Function to Display Birthdays
function displayBirthdays(birthdays, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayBirthdays");
    const birthdayListDiv = document.getElementById("birthdayList");

    todayDiv.innerHTML = "";
    birthdayListDiv.innerHTML = "";

    let todayBirthdays = birthdays.filter(member => member.dob === todayMonthDay);
    let monthBirthdays = birthdays.filter(member => !selectedMonth || member.monthOnly === selectedMonth);

    if (todayBirthdays.length > 0) {
        todayDiv.innerHTML = todayBirthdays.map(member => `
            <div class="birthday-item">
                <span>${member.dob} - ${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            </div>
        `).join("");
    } else {
        todayDiv.innerHTML = "<p>No birthdays today.</p>";
    }

    if (monthBirthdays.length > 0) {
        birthdayListDiv.innerHTML = monthBirthdays.map(member => `
            <div class="birthday-item">
                <span>${member.dob} - ${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            </div>
        `).join("");
    } else {
        birthdayListDiv.innerHTML = "<p>No birthdays found for this month.</p>";
    }
}

// ✅ Function to Filter by Month
function filterByMonth() {
    const selectedMonth = document.getElementById("monthSelect").value;
    loadBirthdays(selectedMonth);
}

// ✅ Go Back Function
function goBack() {
    window.history.back();
}

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", () => loadBirthdays());
