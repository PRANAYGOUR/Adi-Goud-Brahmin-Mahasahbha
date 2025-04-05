// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
  authDomain: "communitydata-647bd.firebaseapp.com",
  projectId: "communitydata-647bd",
  storageBucket: "communitydata-647bd.appspot.com",
  messagingSenderId: "594142794300",
  appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

// 🔥 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🟢 Extract Name and Phone from URL
const urlParams = new URLSearchParams(window.location.search);
const rawName = urlParams.get("name");
const rawPhone = urlParams.get("phone");

// 🟢 Validate
if (!rawName || !rawPhone) {
  console.error("❌ Missing name or phone in URL");
  document.getElementById("Name").textContent = "User not found";
} else {
  const inputName = rawName.toLowerCase().trim();
  const inputPhone = rawPhone.trim();

  db.collection("members").get()
    .then(snapshot => {
      let matchedUser = null;

      snapshot.forEach(doc => {
        const data = doc.data();
        const nameFromDB = String(data["Name"] || "").toLowerCase().trim();
        const phoneFromDB = String(data["Phone"] || "").trim();

        if (nameFromDB === inputName && phoneFromDB === inputPhone) {
          matchedUser = data;
        }
      });

      if (!matchedUser) {
        console.error("❌ No matching user found");
        document.getElementById("Name").textContent = "User not found";
        return;
      }

      // ✅ Display Data with Correct Field Names
      document.getElementById("Name").textContent = matchedUser["Name"] || "N/A";
      document.getElementById("Father").textContent = matchedUser["Father"] || "N/A";
      document.getElementById("blood").textContent = matchedUser["Blood Group"] || "N/A";
      document.getElementById("occupation").textContent = matchedUser["Occupation"] || "N/A";
      document.getElementById("email").textContent = matchedUser["Email"] || "N/A";
      document.getElementById("phone").textContent = matchedUser["Phone"] || "N/A";

      // 📅 Format DOB
      const rawDob = matchedUser["Date of birth"];
      if (rawDob && rawDob.includes("-")) {
        document.getElementById("dob").textContent = rawDob;
      } else {
        document.getElementById("dob").textContent = rawDob || "N/A";
      }

      // 🖼️ Profile Photo
      const photoUrl = matchedUser["photo"];
      document.getElementById("Photo").src = photoUrl || "default.jpg";

      // 🔗 Contact Links
      if (matchedUser["Phone"]) {
        document.getElementById("whatsapp-link").href = `https://wa.me/${matchedUser["Phone"]}`;
        document.getElementById("phone-link").href = `tel:${matchedUser["Phone"]}`;
      }
      if (matchedUser["Email"]) {
        document.getElementById("email-link").href = `mailto:${matchedUser["Email"]}`;
      }
    })
    .catch(error => {
      console.error("❌ Error fetching user data:", error);
      document.getElementById("Name").textContent = "Error loading profile";
    });
}

// 🔙 Back Button
document.getElementById("backButton").addEventListener("click", () => {
  window.history.back();
});
