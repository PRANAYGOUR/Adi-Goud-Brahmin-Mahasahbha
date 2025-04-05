// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.firebasestorage.app",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// 🔥 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🟢 Convert Name to Title Case
function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// 🟢 Load Members from Firestore
// 🟢 Load Members from Firestore
async function loadMembers() {
    try {
        const snapshot = await db.collection("members").get();
        const members = [];

        snapshot.forEach(doc => {
            const data = doc.data();

            const name = data.Name ? String(data.Name).trim() : "";
            const phone = data.Phone ? String(data.Phone).trim() : "";

            if (name && phone) {
                members.push({
                    name: toTitleCase(name),
                    phone: phone
                });
            }
        });

        // 🔹 Sort Alphabetically
        members.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: 'base' }));

        displayMembers(members);
    } catch (error) {
        console.error("❌ Error loading members:", error);
    }
}

// 🟢 Display Members List
function displayMembers(members) {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    members.forEach(member => {
        const div = document.createElement("div");
        div.classList.add("member-item");
        div.textContent = `${member.name}`;
        div.addEventListener("click", () => {
            window.location.href = `profile.html?name=${encodeURIComponent(member.name)}&phone=${encodeURIComponent(member.phone)}`;
        });
        memberList.appendChild(div);
    });

    window.allMembers = members;  // 🔹 Store for search function
}

// 🟢 Search Members
function filterNames() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    window.allMembers.forEach(member => {
        if (member.name.toLowerCase().includes(searchInput) || member.phone.includes(searchInput)) {
            const div = document.createElement("div");
            div.classList.add("member-item");
            div.textContent = `${member.name}`;
            div.addEventListener("click", () => {
                window.location.href = `profile.html?name=${encodeURIComponent(member.name)}&phone=${encodeURIComponent(member.phone)}`;
            });
            memberList.appendChild(div);
        }
    });
}

// 🟢 Load Members on Page Load
document.addEventListener("DOMContentLoaded", loadMembers);
