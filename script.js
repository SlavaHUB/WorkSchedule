/**
 * ГРАФИК НА СЕНТЯБРЬ 2025 — Левченко М.С.
 * Значение: строка "HH:MM-HH:MM" — рабочее время; "В" — выходной; ""/null — нет данных.
 *
 * Ниже внесены примеры (часть дат заполнена). Замените/дополните по необходимости.
 */
const schedule = {
  year: 2025,
  month: 9, // сентябрь
  days: {
    // Пример заполнения:
    1: "09:00-18:00",
    2: "В",          // пример
    3: "В",
    4: "11:00-20:00",
    5: "10:00-19:000",
    6: "12:00-21:00",
    7: "10:00-19:00",
    8: "09:00-18:00",          // пример
    9: "В",          // пример
    10: "В",
    11: "12:00-21:00",
    12: "12:00-21:00",
    13: "09:00-18:00",
    14: "11:00-20:00",
    15: "В",
    16: "11:00-20:00",
    17: "11:00-20:00",
    18: "В",
    19: "12:00-21:00",
    20: "12:00-21:00",
    21: "09:00-18:00",
    22: "12:00-21:00",
    23: "09:00-18:00",
    24: "В",
    25: "В",
    26: "12:00-21:00",
    27: "10:00-19:00",
    28: "12:00-21:00",
    29: "11:00-20:00",
    30: "09:00-18:00",
  }
};

// ——— ИНИЦИАЛИЗАЦИЯ ———
const $date = document.querySelector('#date');
const $result = document.querySelector('#result');
const $btnToday = document.querySelector('#btn-today');
const $btnWeekend = document.querySelector('#btn-weekend');
document.querySelector('#days-count').textContent = Object.keys(schedule.days).length;

// Ограничим календарь месяцом расписания
const pad = n => String(n).padStart(2, '0');
const minStr = `${schedule.year}-${pad(schedule.month)}-01`;
const maxStr = `${schedule.year}-${pad(schedule.month)}-${pad(Object.keys(schedule.days).length)}`;
$date.min = minStr;
$date.max = maxStr;

// 1) Создадим кнопку с таким же стилем, как "Ближайшие выходные"
const btnFullSchedule = document.createElement('button');
btnFullSchedule.textContent = 'Показать полный календарь';
// используем стиль обычной кнопки, как у "Ближайшие выходные"
btnFullSchedule.id = 'btn-full-schedule';
$btnWeekend.parentNode.appendChild(btnFullSchedule); // вставляем рядом с кнопкой «Ближайшие выходные»

// 2) Функция генерации календаря
function renderFullCalendar() {
  const totalDays = Object.keys(schedule.days).length;
  let html = '<div class="grid-calendar" style="display:grid; grid-template-columns:repeat(7,1fr); gap:6px; margin-top:12px">';

  for (let day = 1; day <= totalDays; day++) {
    const val = schedule.days[day] || '';
    const isWeekend = val.toUpperCase() === 'В';
    html += `<div class="calendar-day" style="
            padding:10px; 
            text-align:center; 
            border-radius:8px; 
            border:2px solid ${isWeekend ? '#ff5d5d' : '#2ecc71'}; 
            color:${isWeekend ? '#ff5d5d' : '#2ecc71'};
            font-weight:bold;
        ">${day}</div>`;
  }
  html += '</div>';

  $result.innerHTML = `<div class="when"><b>Полный календарь:</b></div>` + html;
}

// 3) Обработчик кнопки
btnFullSchedule.addEventListener('click', renderFullCalendar);

// Показ результата
function renderDayInfo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) {
    $result.innerHTML = `<div class="when muted">Неверная дата</div>`;
    return;
  }
  const day = d.getDate();
  const val = schedule.days[day] ?? "";
  const weekday = d.toLocaleDateString('ru-RU', { weekday: 'long' });
  const human = d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  if (val && val.toUpperCase() === 'В') {
    $result.innerHTML = `
      <div class="when"><b>${human}</b> (${weekday})</div>
      <div class="stack" style="margin-top:8px">
        <span class="tag off">Выходной</span>
      </div>`;
  } else if (val) {
    $result.innerHTML = `
      <div class="when"><b>${human}</b> (${weekday})</div>
      <div class="stack" style="margin-top:8px">
        <span class="tag ok">Рабочий: ${val}</span>
      </div>`;
  } else {
    $result.innerHTML = `
      <div class="when"><b>${human}</b> (${weekday})</div>
      <div class="stack" style="margin-top:8px">
        <span class="tag">Нет данных — заполните schedule.days[${day}]</span>
      </div>`;
  }
}

// Сегодня
$btnToday.addEventListener('click', () => {
  const now = new Date();
  const y = schedule.year;
  const m = schedule.month - 1; // 0-based (сентябрь = 8)
  const result = document.getElementById('result'); // блок для вывода сообщения

  // Проверка: совпадает ли текущий месяц с месяцем в графике
  if (now.getFullYear() !== y || now.getMonth() !== m) {
    result.textContent = "Текущий месяц не совпадает с месяцем в графике";
    return;
  }

  // Если совпадает — устанавливаем сегодняшнюю дату
  const value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  $date.value = value;
  renderDayInfo(value);
});


// Изменение даты
$date.addEventListener('change', (e) => renderDayInfo(e.target.value));

// Ближайшие выходные (подряд стоящие «В») от выбранной даты или от «сегодня»
$btnWeekend.addEventListener('click', () => {
  let baseDateStr = $date.value;
  if (!baseDateStr) {
    // возьмем «сегодня» в рамках месяца
    const y = schedule.year, m = schedule.month - 1;
    const today = new Date();
    const d = (today.getFullYear() === y && today.getMonth() === m)
      ? today
      : new Date(y, m, Math.min(today.getDate(), Object.keys(schedule.days).length));
    baseDateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    $date.value = baseDateStr;
  }

  const base = new Date(baseDateStr);
  const totalDays = Object.keys(schedule.days).length;

  // 1) ищем ближайший выходной начиная с base (включительно) вперёд
  let start = null;
  for (let i = base.getDate(); i <= totalDays; i++) {
    if ((schedule.days[i] || '').toUpperCase() === 'В') { start = i; break; }
  }
  if (start === null) {
    $result.innerHTML = `
      <div class="when"><b>Ближайшие выходные</b></div>
      <div class="stack" style="margin-top:8px"><span class="tag">В этом месяце больше нет выходных</span></div>`;
    return;
  }
  // 2) расширяем вправо, пока идут подряд «В»
  let end = start;
  while (end + 1 <= totalDays && (schedule.days[end + 1] || '').toUpperCase() === 'В') { end++; }

  // Вывод
  const items = [];
  for (let d = start; d <= end; d++) {
    const date = new Date(schedule.year, schedule.month - 1, d);
    items.push(`${pad(d)} ${date.toLocaleDateString('ru-RU', { month: 'long' })} (${date.toLocaleDateString('ru-RU', { weekday: 'short' })})`);
  }
  $result.innerHTML = `
    <div class="when"><b>Ближайшие выходные:</b> ${start === end ? 'один день' : `${items.length} дня`}</div>
    <ul class="weekend-list">${items.map(s => `<li>${s}</li>`).join('')}</ul>
  `;
});

// Установим дефолт: 1 сентября
$date.value = `${schedule.year}-${pad(schedule.month)}-01`;
renderDayInfo($date.value);