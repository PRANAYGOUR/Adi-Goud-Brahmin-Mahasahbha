// ✅ Firebase config
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

async function loadAnniversaries(selectedMonth = "") {
    try {
        console.log("📡 Fetching data from Firestore...");
        const snapshot = await db.collection("members").get();
        
        let anniversaries = [];
        const anniversaryField = "Anniversary date"; // 🟢 Make sure this matches Firestore field exactly

        snapshot.forEach(doc => {
            const data = doc.data();
            const name = data.Name || "Unknown";

            if (!data[anniversaryField]) {
                console.warn(`⚠️ Missing Anniversary for: ${name}`);
                return;
            }

            let parts = data[anniversaryField].split("-");
            if (parts.length !== 3) parts = data[anniversaryField].split("/");

            if (parts.length !== 3) {
                console.warn(`⚠️ Malformed Anniversary for: ${name} -> ${data[anniversaryField]}`);
                return;
            }

            const day = parts[0].padStart(2, "0");
            const month = parts[1].padStart(2, "0");

            console.log(`✅ Parsed Anniversary for ${name}: Day=${day}, Month=${month}`);

            anniversaries.push({
                name: name,
                phone: data.Phone || "",
                anniversary: `${day}.${month}`, // Format: DD.MM
                day: parseInt(day, 10),
                month: parseInt(month, 10),
                monthOnly: month
            });
        });

        anniversaries.sort((a, b) => a.month === b.month ? a.day - b.day : a.month - b.month);
        console.log("🎉 Sorted Anniversaries:", anniversaries);

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        displayAnniversaries(anniversaries, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("❌ Error loading data from Firestore:", error);
    }
}

function displayAnniversaries(anniversaries, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayAnniversaries");
    const anniversaryListDiv = document.getElementById("anniversaryList");
    todayDiv.innerHTML = "";
    anniversaryListDiv.innerHTML = "";

    let hasTodayAnniversaries = false;
    let hasMonthAnniversaries = false;

    anniversaries.forEach(member => {
        const isToday = member.anniversary === todayMonthDay;
        const isMatchingMonth = !selectedMonth || member.monthOnly === selectedMonth;

        if (isToday || isMatchingMonth) {
            const div = document.createElement("div");
            div.classList.add("anniversary-item");
            div.innerHTML = `
                <span>${member.anniversary} - ${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            `;

            if (isToday) {
                todayDiv.appendChild(div);
                hasTodayAnniversaries = true;
            } else {
                anniversaryListDiv.appendChild(div);
                hasMonthAnniversaries = true;
            }
        }
    });

    if (!hasTodayAnniversaries) {
        todayDiv.innerHTML = "<p>No anniversaries today.</p>";
    }

    if (!hasMonthAnniversaries) {
        anniversaryListDiv.innerHTML = "<p>No anniversaries found for this month.</p>";
    }
}

function filterByMonth() {
    const selectedMonth = document.getElementById("monthSelect").value;
    loadAnniversaries(selectedMonth);
}

function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", () => loadAnniversaries());
