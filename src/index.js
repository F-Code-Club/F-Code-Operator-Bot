const mysql = require('mysql');
const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});
const prefix = process.env.DISCORD_PREFIX; // Bạn có thể thay đổi prefix theo ý muốn trong .env
const token = process.env.DISCORD_TOKEN;
// Kết nối tới MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect();

client.on('messageCreate', async (message) => {

  if (message.author.bot) return; // Bỏ qua các tin nhắn của bot
  if (message.content.startsWith(`${prefix}CHECK_`)) {
    let studentCode = message.content.slice(7); // Lấy mã số sinh viên từ nội dung tin nhắn
    
    const regex = /^[A-Za-z]{2}\d{6}$/;
    if(regex.test(studentCode)) {
      console.log(studentCode);
      // Kiểm tra mã số sinh viên trong database
      const query = `SELECT * FROM students WHERE student_id = '${studentCode}'`;
      connection.query(query, (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
          // Nếu có kết quả, đặt quyền cho thành viên
          const member = message.guild.members.cache.get(message.author.id);
          const role = message.guild.roles.cache.find(role => role.name === 'Challenger 1');

          if (role && member) {
            member.roles.add(role);
            message.reply('Đã thêm quyền cho bạn.');
          }
        } else {
          message.reply('Mã số sinh viên không hợp lệ.');
        }
      });
    } else {
      message.reply('Mã số sinh viên không hợp lệ.');
      console.log("ERROR: Không phải là MSSV");
    }
  }
});

// Sự kiện khi bot đã sẵn sàng
client.on('ready', () => {
  console.log(`Bot đã sẵn sàng với tên: ${client.user.tag}`);
});

// Kết nối bot với Discord
client.login(token);
