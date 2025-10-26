const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const registerBtn = document.getElementById('registerBtn');
const usernameError = document.getElementById('usernameError');

// 1. التحقق أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    const existingUser = localStorage.getItem('quizUser');
    if (existingUser) {
        // لو المستخدم مسجل قبل كده، انقله فوراً للصفحة الرئيسية
        window.location.assign('home.html');
    }
});

// 2. عند الضغط على زر التسجيل
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // امنع الفورم من الإرسال

    const username = usernameInput.value.trim(); // .trim() عشان نشيل المسافات

    if (!username) {
        // لو مدخلش اسم
        usernameError.classList.remove('hidden');
        return;
    }

    // إنشاء حساب مستخدم جديد (محلي)
    const newUser = {
        username: username,
        profilePic: null // لسه محطش صورة
    };

    // حفظ المستخدم في الـ localStorage
    localStorage.setItem('quizUser', JSON.stringify(newUser));

    // إخفاء الخطأ (لو كان ظاهر)
    usernameError.classList.add('hidden');

    // نقله للصفحة الرئيسية
    window.location.assign('home.html');
});