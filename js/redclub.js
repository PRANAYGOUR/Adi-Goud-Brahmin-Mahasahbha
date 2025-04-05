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

// ✅ Function to Load Blood Groups from Firestore
async function loadBloodGroups() {
    try {
        console.log("📡 Fetching blood group data from Firestore...");

        const querySnapshot = await db.collection("members").get();

        if (querySnapshot.empty) {
            console.error("❌ No members found in Firestore.");
            return;
        }

        const members = [];

        querySnapshot.forEach(doc => {
            const data = doc.data();
            members.push({
                name: data.Name || "Unknown",
                bloodGroup: data["Blood Group"] || "", // ✅ Correct field name
                phone: data.Phone || ""
            });
        });

        const bloodGroups = [...new Set(members.map(m => m.bloodGroup).filter(bg => bg))];
        displayBloodGroups(bloodGroups, members);
    } catch (error) {
        console.error("❌ Error loading data from Firestore:", error);
    }
}

// ✅ Function to Display Blood Group List
function displayBloodGroups(bloodGroups, members) {
    const bloodGroupListDiv = document.getElementById("bloodGroupList");
    bloodGroupListDiv.innerHTML = "";

    bloodGroups.forEach(group => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("blood-group-item");
        groupDiv.innerHTML = `<span class="blood-group-name">${group}</span>`;

        groupDiv.addEventListener("click", () => {
            displayMembersByBloodGroup(group, members);
        });

        bloodGroupListDiv.appendChild(groupDiv);
    });
}

// ✅ Function to Display Members by Selected Blood Group
function displayMembersByBloodGroup(bloodGroup, members) {
    const bloodGroupDetailsDiv = document.getElementById("bloodGroupDetails");
    bloodGroupDetailsDiv.innerHTML = `<h3>Members with Blood Group ${bloodGroup}</h3>`;

    const membersOfGroup = members.filter(m => m.bloodGroup === bloodGroup);

    if (membersOfGroup.length > 0) {
        membersOfGroup.forEach(member => {
            const memberDiv = document.createElement("div");
            memberDiv.classList.add("member-item");
            memberDiv.innerHTML = `
                <span>${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            `;
            bloodGroupDetailsDiv.appendChild(memberDiv);
        });
    } else {
        bloodGroupDetailsDiv.innerHTML = "<p>No members found with this blood group.</p>";
    }
}

// ✅ Load Blood Groups on Page Load
document.addEventListener("DOMContentLoaded", () => loadBloodGroups());
