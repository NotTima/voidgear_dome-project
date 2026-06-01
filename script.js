document.addEventListener('DOMContentLoaded', () => {

// === 1. КАРУСЕЛЬ (Carousel) ===
const track = document.querySelector('.carousel-track');
if (track) {
const slides = track.querySelectorAll('.carousel-slide');
const prev = document.querySelector('.carousel-btn.prev');
const next = document.querySelector('.carousel-btn.next');
let idx = 0;
const go = (dir) => {
idx = (idx + dir + slides.length) % slides.length;
track.style.transform = `translateX(-${idx * 100}%)`;
};
prev?.addEventListener('click', () => go(-1));
next?.addEventListener('click', () => go(1));
setInterval(() => go(1), 5000);
}

// === 2. ВКЛАДКИ (Tabs) ===
const tabs = document.querySelectorAll('.tab-trigger');
const panels = document.querySelectorAll('.tab-panel');
if (tabs.length) {
tabs.forEach(btn => {
btn.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
panels.forEach(p => p.classList.remove('active'));
btn.classList.add('active');
document.getElementById(btn.dataset.target)?.classList.add('active');
});
});
}

// === 3. АККОРДЕОН (Accordion) ===
document.querySelectorAll('.accordion-item').forEach(item => {
const header = item.querySelector('.accordion-header');
const body = item.querySelector('.accordion-body');
header.addEventListener('click', () => {
const isOpen = body.classList.contains('open');
document.querySelectorAll('.accordion-item').forEach(i => {
i.querySelector('.accordion-body').classList.remove('open');
i.classList.remove('active');
});
if (!isOpen) { body.classList.add('open'); item.classList.add('active'); }
});
});

// === 4. ВАЛИДАЦИЯ ФОРМЫ ===
const form = document.getElementById('contactForm');
if (form) {
form.addEventListener('submit', (e) => {
e.preventDefault();
let ok = true;
[{id:'userName', re: v => v.trim().length >= 2},
 {id:'userEmail', re: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)},
 {id:'userMsg', re: v => v.trim().length > 0}
].forEach(f => {
const el = document.getElementById(f.id);
const err = el.nextElementSibling;
el.classList.remove('error'); if(err) err.style.display = 'none';
if (!f.re(el.value)) { el.classList.add('error'); if(err) err.style.display = 'block'; ok = false; }
});
if (ok) { document.querySelector('.success-text').style.display = 'block'; form.reset(); }
});
}

// === 5. МОДАЛЬНОЕ ОКНО + КОРЗИНА (Modal) ===
const modal = document.getElementById('cartModal');
const openBtn = document.getElementById('openCartBtn');
const closeBtn = document.querySelector('.modal-close');
const list = document.getElementById('cartList');
const checkoutBtn = document.querySelector('.modal-box .submit-btn'); 
let cart = JSON.parse(localStorage.getItem('cg_cart')) || [];

// Обновление счётчика и списка товаров
const render = () => {
  if (openBtn) openBtn.textContent = `Корзина (${cart.length})`;
  if (list) list.innerHTML = cart.length === 0 
    ? '<p class="empty-msg">Корзина пуста</p>' 
    : cart.map(item => `<div class="cart-item">• ${item}</div>`).join('');
};

// Добавление товаров
document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.dataset.product;
    if (product) {
      cart.push(product);
      localStorage.setItem('cg_cart', JSON.stringify(cart));
      render();
    }
  });
});

// ОФОРМЛЕНИЕ ЗАКАЗА (сброс корзины)
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    // 1. Очищаем массив
    cart = [];
    // 2. Удаляем данные из localStorage
    localStorage.removeItem('cg_cart');
    // 3. Обновляем интерфейс
    render();
    // 4. Закрываем модальное окно
    modal.classList.remove('active');
    // 5. Уведомляем пользователя
    alert('Заказ успешно оформлен! Менеджер свяжется с вами.');
  });
}

// Открытие/закрытие модалки
if (modal && openBtn) {
  openBtn.addEventListener('click', () => { render(); modal.classList.add('active'); });
  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
} 

// Инициализация при загрузке
render();
});