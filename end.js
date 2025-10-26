const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// 1. عرض النتيجة النهائية
finalScore.innerText = mostRecentScore;

// 2. تحميل المستخدم الحالي
const userString = localStorage.getItem('quizUser');
let currentUser = null;

if (userString) {
    currentUser = JSON.parse(userString);
}

// 3. حفظ النتيجة تلقائياً (لو في مستخدم وفي نتيجة)
if (currentUser && mostRecentScore) {
    saveHighScore(currentUser.username, mostRecentScore, currentUser.profilePic);
}

function saveHighScore(username, scoreValue, profilePic) {
    // تحميل قايمة النتائج القديمة
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    // إنشاء النتيجة الجديدة (مع الصورة)
    const score = {
        score: scoreValue,
        name: username,
        pic: profilePic // إضافة الصورة
    };

    // إضافة النتيجة الجديدة
    scores.push(score);

    // ترتيب تنازلي (من الأعلى للأقل)
    scores.sort((a, b) => b.score - a.score);

    // الاكتفاء بأعلى 5 نتايج فقط
    scores.splice(5);

    // حفظ القائمة المحدثة في localStorage
    localStorage.setItem('scores', JSON.stringify(scores));
}