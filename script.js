const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Script Loaded Successfully!");

  // 🏷️ ট্যাব পরিবর্তনের ফাংশন
  window.showTab = function (tabId) {
    console.log(`🔄 Switched to tab: ${tabId}`);
    document.querySelectorAll(".tab").forEach(tab => {
      tab.style.display = "none";
    });

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.style.display = "block";
      console.log(`✅ Showing tab: ${tabId}`);
    } else {
      console.error(`❌ Tab ${tabId} not found!`);
    }
  };

  // 🎯 কোর্স ডিটেইলস দেখানো
  document.querySelectorAll(".course-btn").forEach(button => {
    button.addEventListener("click", function () {
      const courseName = this.getAttribute("data-course");
      console.log(`📌 ${courseName} কোর্সের বাটনে ক্লিক করা হয়েছে!`);

      const courseDetails = {
        'ওয়েব ডেভেলপমেন্ট': `<b>🌐 এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>HTML, CSS, এবং JavaScript</li>
          <li>রেস্পন্সিভ ওয়েব ডিজাইন</li>
          <li>ফ্রন্টএন্ড ফ্রেমওয়ার্ক (Bootstrap, Tailwind)</li>
        </ul>`,

        'গ্রাফিক ডিজাইন': `<b>🎨 এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>Adobe Photoshop ও Illustrator</li>
          <li>লোগো, ব্যানার ও ব্র্যান্ডিং ডিজাইন</li>
          <li>UI/UX ডিজাইন বেসিক</li>
        </ul>`,

        'ডিজিটাল মার্কেটিং': `<b>📢 এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>SEO এবং Google Ads</li>
          <li>Facebook & Instagram Marketing</li>
          <li>Email Marketing & Automation</li>
        </ul>`,

        'অফিস অ্যাপলিকেশন': `<b>💻 এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>Microsoft Word, Excel, PowerPoint</li>
          <li>Data Analysis & Reporting</li>
          <li>Advanced Excel & Formulas</li>
        </ul>`,

        'ডাটাবেস ম্যানেজমেন্ট': `<b>🗄️ এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>SQL & Database Design</li>
          <li>Microsoft Access & MySQL</li>
          <li>Data Backup & Security</li>
        </ul>`,

        'লার্নিং ইংলিশ': `<b>📝 এই কোর্সে আপনি শিখবেন:</b>
        <ul>
          <li>Basic to Advanced English Grammar</li>
          <li>Speaking & Writing Skills</li>
          <li>Professional Email Writing</li>
        </ul>`
      };

      if (courseDetails[courseName]) {
        document.getElementById("course-title").innerText = courseName;
        document.getElementById("course-description").innerHTML = courseDetails[courseName];
        console.log("✅ কোর্সের তথ্য আপডেট হয়েছে!");

        // 📌 Courses লুকিয়ে, Course Details দেখানো
        showTab("course-details");
      } else {
        console.error(`❌ ${courseName} কোর্সের তথ্য পাওয়া যায়নি!`);
      }
    });
  });

  // 🔙 "কোর্সে ফিরে যান" বাটনের ইভেন্ট হ্যান্ডলার
  document.getElementById("course-details").querySelector("button").addEventListener("click", function () {
    console.log("🔙 কোর্স লিস্টে ফিরে যাওয়া হচ্ছে...");
    showTab("courses");
  });

  // 🔰 প্রথমে শুধু হোম সেকশন দেখানো
  showTab("home");
});


// 📥 নিবন্ধন প্রক্রিয়া
const registerForm = document.getElementById('register-form');

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const preferredCourse = document.getElementById('preferred-course').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (name.length < 3) {
    alert("⚠️ নাম কমপক্ষে ৩ অক্ষরের হতে হবে!");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("❌ বৈধ ইমেইল লিখুন!");
    return;
  }
  if (password.length < 6) {
    alert("🔑 পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!");
    return;
  }
  if (password !== confirmPassword) {
    alert('❌ পাসওয়ার্ড মিলছে না!');
    return;
  }

  // 🔄 ফর্ম সাবমিট করার জন্য ডাটা প্রস্তুত
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("preferredCourse", preferredCourse);
  formData.append("password", password);

  try {
    const response = await fetch("register.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      alert(`🎉 ${name}, আপনার নিবন্ধন সফল হয়েছে!`);
      registerForm.reset();
      showTab('login');
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (error) {
    console.error("❌ নিবন্ধন ত্রুটি:", error);
    alert("⚠️ সার্ভার সংযোগ সমস্যা! পরে আবার চেষ্টা করুন।");
  }
});



// 🔑 লগইন প্রক্রিয়া
const loginForm = document.getElementById('login-form');

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const response = await fetch("login.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      alert(`🎉 স্বাগতম, ${result.name}!`);
      localStorage.setItem("loggedInUser", JSON.stringify(result.user));

      // প্রোফাইল তথ্য আপডেট
      document.getElementById('profile-name').textContent = result.user.name;
      document.getElementById('profile-email').textContent = result.user.email;
      document.getElementById('profile-course').textContent = result.user.preferredCourse;

      showTab('profile'); // প্রোফাইল পেজে নিয়ে যাবে
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (error) {
    console.error("❌ লগইন ত্রুটি:", error);
    alert("⚠️ সার্ভার সংযোগ সমস্যা! পরে আবার চেষ্টা করুন।");
  }
});


// 🚪 লগআউট ফাংশন
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem("loggedInUser");
  alert("🚪 আপনি লগআউট করেছেন!");
  showTab('login');
});