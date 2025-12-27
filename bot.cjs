// SHARQ KINO – fully functional Telegram bot (single file)
// NodeJS 18+
// npm i telegraf sqlite3

const { Telegraf, Markup } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

// ====== CONFIG ======
const BOT_TOKEN = '7669574518:AAFqOZIF3fv035YVhF_-8djP4Ub2Yof9tGg';
const ADMINS = [8326460941]; // Telegram user IDs
// ================= INIT =================
const bot = new Telegraf(BOT_TOKEN);
const db = new sqlite3.Database('./database.db');

// ================= DB =================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY)`);
  db.run(`CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS films(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    title TEXT,
    file_id TEXT
  )`);
});

// ================= HELPERS =================
const isAdmin = id => ADMINS.includes(id);

// ================= MENUS =================
const adminMenu = () => Markup.inlineKeyboard([
  [Markup.button.callback('📁 Категории', 'categories')],
  [Markup.button.callback('🎬 Добавить фильм', 'add_film')],
  [Markup.button.callback('📢 Рассылка', 'broadcast')],
]);

// ================= START =================
bot.start(ctx => {
  db.run(`INSERT OR IGNORE INTO users VALUES (?)`, [ctx.from.id]);
  if (isAdmin(ctx.from.id)) {
    ctx.reply('👑 Админ-панель', adminMenu());
  } else {
    showCategories(ctx);
  }
});

// ================= USER CATEGORIES =================
function showCategories(ctx) {
  db.all(`SELECT * FROM categories`, (e, rows) => {
    if (!rows.length) return ctx.reply('📭 Категорий пока нет');
    const kb = rows.map(c => [Markup.button.callback(c.name, `cat_${c.id}`)]);
    ctx.reply('📁 Выберите категорию:', Markup.inlineKeyboard(kb));
  });
}

bot.action(/cat_(\d+)/, ctx => {
  const catId = ctx.match[1];
  db.all(`SELECT * FROM films WHERE category_id=?`, [catId], (e, rows) => {
    if (!rows.length) return ctx.reply('❌ В категории нет фильмов');
    rows.forEach(f => {
      ctx.replyWithVideo(f.file_id, { caption: `🎬 ${f.title}` });
    });
  });
});

// ================= ADD CATEGORY =================
bot.action('categories', ctx => {
  if (!isAdmin(ctx.from.id)) return;
  ctx.reply('Введите название новой категории:');
  ctx.session = { addCat: true };
});

bot.on('text', ctx => {
  if (ctx.session?.addCat && isAdmin(ctx.from.id)) {
    db.run(`INSERT OR IGNORE INTO categories(name) VALUES(?)`, [ctx.message.text]);
    ctx.reply('✅ Категория добавлена');
    ctx.session = null;
  }
});

// ================= ADD FILM FLOW =================
const filmState = {};

bot.action('add_film', ctx => {
  if (!isAdmin(ctx.from.id)) return;
  filmState[ctx.from.id] = {};
  db.all(`SELECT * FROM categories`, (e, rows) => {
    const kb = rows.map(c => [Markup.button.callback(c.name, `filmcat_${c.id}`)]);
    ctx.reply('Выберите категорию:', Markup.inlineKeyboard(kb));
  });
});

bot.action(/filmcat_(\d+)/, ctx => {
  filmState[ctx.from.id].category = ctx.match[1];
  ctx.reply('Отправьте ВИДЕО файл фильма');
});

bot.on('video', ctx => {
  if (!isAdmin(ctx.from.id)) return;
  const state = filmState[ctx.from.id];
  if (!state) return;
  state.file_id = ctx.message.video.file_id;
  ctx.reply('Введите название фильма:');
});

bot.on('text', ctx => {
  const state = filmState[ctx.from.id];
  if (!state || !state.file_id || !isAdmin(ctx.from.id)) return;

  db.run(
    `INSERT INTO films(category_id,title,file_id) VALUES(?,?,?)`,
    [state.category, ctx.message.text, state.file_id]
  );
  ctx.reply('✅ Фильм добавлен');
  delete filmState[ctx.from.id];
});

// ================= BROADCAST =================
const broadcast = {};

bot.action('broadcast', ctx => {
  if (!isAdmin(ctx.from.id)) return;
  broadcast[ctx.from.id] = true;
  ctx.reply('Введите текст рассылки:');
});

bot.on('text', ctx => {
  if (!broadcast[ctx.from.id] || !isAdmin(ctx.from.id)) return;
  db.all(`SELECT id FROM users`, (e, rows) => {
    rows.forEach(u => bot.telegram.sendMessage(u.id, ctx.message.text).catch(()=>{}));
  });
  ctx.reply('📢 Рассылка отправлена');
  delete broadcast[ctx.from.id];
});

// ================= LAUNCH =================
bot.launch();
console.log('✅ SHARQ KINO FILE BOT STARTED');

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());