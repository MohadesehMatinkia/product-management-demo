const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const sortButton = document.getElementById('sort-price');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editName = document.getElementById('edit-name');
const editPrice = document.getElementById('edit-price');
const closeModal = document.getElementById('close-modal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const reportButton = document.getElementById('report-button');

let sampleProducts = [
  { id: 1, name: 'لپ‌تاپ دل', price: 25000000 },
  { id: 2, name: 'گوشی سامسونگ', price: 15000000 },
  { id: 3, name: 'تبلت اپل', price: 30000000 },
  { id: 4, name: 'هدفون سونی', price: 5000000 },
  { id: 5, name: 'کیبورد لاجیتک', price: 2000000 },
];

let sortAscending = true;
let editIndex = null;

// تابع برای تنظیم تم
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// لود تم ذخیره‌شده یا پیش‌فرض روشن
const currentTheme = localStorage.getItem('theme') || 'light';
setTheme(currentTheme);

// تغییر تم با کلیک
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

// تابع گزارش‌گیری سریع
function generateReport() {
  const totalProducts = sampleProducts.length;
  const totalPrice = sampleProducts.reduce((sum, product) => sum + product.price, 0);
  showToast(`📊 گزارش سریع: ${totalProducts} محصول با مجموع قیمت ${totalPrice.toLocaleString('fa-IR')} تومان`, 'success');
}

// رویداد برای دکمه گزارش
reportButton.addEventListener('click', generateReport);

// نمایش Toast با انیمیشن
function showToast(message, type = 'success') {
  toastMessage.textContent = message;
  toast.className = `fixed bottom-4 left-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'} text-white animate-bounce-in`;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('animate-fade-out');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('animate-fade-out'); // ریست انیمیشن برای دفعه بعد
    }, 300);
  }, 3000);
}

// نمایش محصولات
function renderProducts(products) {
  productList.innerHTML = '';
  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-3 text-gray-700 dark:text-gray-100">${product.name}</td>
      <td class="border p-3 text-gray-700 dark:text-gray-100">${product.price.toLocaleString('fa-IR')}</td>
      <td class="border p-3 flex gap-2">
        <button onclick="openEditModal(${index})" class="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition dark:bg-yellow-600 dark:hover:bg-yellow-700">ویرایش</button>
        <button onclick="deleteProduct(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition dark:bg-red-600 dark:hover:bg-red-700">حذف</button>
      </td>
    `;
    productList.appendChild(row);
  });
}

// جستجو
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  const filteredProducts = sampleProducts.filter(product =>
    product.name.includes(searchTerm)
  );
  renderProducts(filteredProducts);
});

// مرتب‌سازی
sortButton.addEventListener('click', () => {
  const sortedProducts = [...sampleProducts].sort((a, b) =>
    sortAscending ? a.price - b.price : b.price - a.price
  );
  sortAscending = !sortAscending;
  sortButton.querySelector('#sort-icon').textContent = sortAscending ? '↑' : '↓';
  renderProducts(sortedProducts);
});

// افزودن محصول
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  if (name && price > 0) {
    sampleProducts.push({ id: sampleProducts.length + 1, name, price: parseInt(price) });
    renderProducts(sampleProducts);
    form.reset();
    showToast('محصول با موفقیت اضافه شد!');
  } else {
    showToast('لطفاً نام و قیمت معتبر وارد کنید.', 'error');
  }
});

// باز کردن modal ویرایش
function openEditModal(index) {
  editIndex = index;
  editName.value = sampleProducts[index].name;
  editPrice.value = sampleProducts[index].price;
  editModal.classList.remove('hidden');
  editModal.classList.add('show');
}

// بستن modal
closeModal.addEventListener('click', () => {
  editModal.classList.remove('show');
  editModal.classList.add('hidden');
});

// ذخیره ویرایش
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = editName.value;
  const price = parseInt(editPrice.value);
  if (name && price > 0) {
    sampleProducts[editIndex] = { ...sampleProducts[editIndex], name, price };
    renderProducts(sampleProducts);
    editModal.classList.remove('show');
    editModal.classList.add('hidden');
    showToast('محصول با موفقیت ویرایش شد!');
  } else {
    showToast('لطفاً نام و قیمت معتبر وارد کنید.', 'error');
  }
});

// حذف محصول
function deleteProduct(index) {
  const productName = sampleProducts[index].name;
  sampleProducts.splice(index, 1);
  renderProducts(sampleProducts);
  showToast(`محصول "${productName}" با موفقیت حذف شد!`);
}

// لود اولیه
renderProducts(sampleProducts);