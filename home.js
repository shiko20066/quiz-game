// --- عناصر البروفايل ---
const profilePicImg = document.getElementById('profile-pic');
const changePicBtn = document.getElementById('change-pic-btn');
const fileInput = document.getElementById('file-input');
const welcomeUsername = document.getElementById('welcome-username');
const logoutBtn = document.getElementById('logoutBtn');

// --- عناصر "أعلى نتيجة" الجديدة ---
const hsBox = document.getElementById('highest-score-box'); // الخانة كلها
const hsPic = document.getElementById('hs-pic');
const hsName = document.getElementById('hs-name');
const hsLevel = document.getElementById('hs-level');
const hsValue = document.getElementById('hs-value');

// صورة افتراضية (SVG)
const DEFAULT_PIC_SVG = "https://img.freepik.com/premium-psd/3d-face-scan-icon-dark-theme_491823-341.jpg";

let currentUser = null;

// 1. أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    const userString = localStorage.getItem('quizUser');
    if (!userString) {
        window.location.assign('index.html');
        return;
    }
    currentUser = JSON.parse(userString);
    welcomeUsername.innerText = `welcome ${currentUser.username}`;
    profilePicImg.src = currentUser.profilePic || DEFAULT_PIC_SVG;
    loadHighestScore();
});

// 2. تغيير الصورة
changePicBtn.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return; 
    const reader = new FileReader();
    reader.onload = () => {
        const dataUrl = reader.result;
        profilePicImg.src = dataUrl;
        currentUser.profilePic = dataUrl;
        localStorage.setItem('quizUser', JSON.stringify(currentUser));
        loadHighestScore(); 
    };
    reader.readAsDataURL(file);
});

// 3. تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    const confirmLogout = confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟");
    if (confirmLogout) {
        localStorage.removeItem('quizUser');
        window.location.assign('index.html'); 
    }
});

// 4. تحميل أعلى نتيجة
function loadHighestScore() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    
    // لو مفيش نتايج، متعملش أي حاجة (الخانة هتفضل مخفية)
    if (scores.length > 0) {
        // لو في نتايج، هات أعلى واحدة
        const topScore = scores[0]; 
        
        // التأكد من استخدام الصورة الافتراضية لو مفيش
        hsPic.src = topScore.pic || DEFAULT_PIC_SVG;
        hsName.innerText = topScore.name;
        hsValue.innerText = topScore.score;
        
        const levelInfo = getLevelFromScore(topScore.score);
        hsLevel.innerText = levelInfo.name;
        hsLevel.style.backgroundColor = levelInfo.color;

        // إظهار الخانة
        hsBox.classList.remove('hidden');
    }
}

// 5. تحديد المستوى من النتيجة
function getLevelFromScore(score) {
    if (score <= 100) {
        return { name: 'مبتدئ', color: '#002E66' }; // أزرق
    } else if (score <= 200) {
        return { name: 'متوسط', color: '#b89c00' }; // أصفر
    } else if (score <= 300) {
        return { name: 'صعب', color: '#b80000' }; // أحمر
    } else { // 301-400
        return { name: 'مستحيل', color: '#ff0000' }; // أحمر فاقع
    }
}