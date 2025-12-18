// مصفوفة المعدات (يتم استعادتها من ذاكرة المتصفح)
let assets = JSON.parse(localStorage.getItem('myAssets')) || [];

const listContainer = document.getElementById('dailyChecklist');
const rateDisplay = document.getElementById('completionRate');
const dateDisplay = document.getElementById('currentDate');

// عرض التاريخ الحالي
dateDisplay.innerText = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// وظيفة رسم القائمة
function renderList() {
    const today = new Date().toLocaleDateString();
    let doneCount = 0;
    listContainer.innerHTML = '';

    assets.forEach(asset => {
        const isDone = asset.lastCheck === today;
        if(isDone) doneCount++;

        listContainer.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center shadow-sm ${isDone ? 'inspected' : 'not-inspected'}">
                <div>
                    <h6 class="mb-0 fw-bold">${asset.name}</h6>
                    <small class="text-muted">${isDone ? '✅ تم الفحص' : '🔴 مطلوب الفحص'}</small>
                </div>
                <div class="d-flex align-items-center">
                    ${!isDone ? `<button onclick="confirmCheck(${asset.id})" class="btn btn-sm btn-success me-3">تأكيد الفحص</button>` : ''}
                    <button onclick="removeAsset(${asset.id})" class="btn-delete">حذف</button>
                </div>
            </div>`;
    });

    // تحديث النسبة المئوية
    const rate = assets.length ? Math.round((doneCount / assets.length) * 100) : 0;
    rateDisplay.innerText = rate + "%";
}

// إضافة معدة جديدة
function handleBtnAdd() {
    const nameInput = document.getElementById('assetNameInput');
    if(nameInput.value.trim() !== "") {
        assets.push({ id: Date.now(), name: nameInput.value, lastCheck: null });
        saveData();
        nameInput.value = "";
        // إغلاق المودال برمجياً
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAssetModal'));
        modal.hide();
    }
}

// تأكيد الفحص لليوم
function confirmCheck(id) {
    const today = new Date().toLocaleDateString();
    assets = assets.map(a => a.id === id ? {...a, lastCheck: today} : a);
    saveData();
}

// حذف معدة
function removeAsset(id) {
    if(confirm("هل أنت متأكد من إزالة هذه المعدة نهائياً من النظام؟")) {
        assets = assets.filter(a => a.id !== id);
        saveData();
    }
}

// حفظ البيانات في الذاكرة
function saveData() {
    localStorage.setItem('myAssets', JSON.stringify(assets));
    renderList();
}

// التشغيل الأول
renderList();
