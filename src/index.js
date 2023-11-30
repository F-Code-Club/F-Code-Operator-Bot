const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();
const ExcelJS = require('exceljs');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

const prefix = process.env.DISCORD_PREFIX;
const token = process.env.DISCORD_TOKEN;
const excelFilePath = "src/F19.xlsx";

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}CHECK_`)) {
    let studentCode = message.content.slice(7);

    const regex = /^[A-Za-z]{2}\d{6}$/;

    if (regex.test(studentCode)) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelFilePath);

        const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet
        
        // Find the student in the Excel file
        let foundStudent = 0;
        worksheet.eachRow(function(row, rowNumber) {
          console.log(rowNumber);
          if(row.getCell('E').value.toUpperCase() === studentCode.toUpperCase() && row.getCell('I').value === 0)
            foundStudent = rowNumber;
        });

        if (foundStudent !== 0) {
          // Mark the student as joined in the Excel file
          rowStudent = worksheet.getRow(foundStudent)
          rowStudent.getCell(9).value = "1"

          // Save the changes to the Excel file
          await workbook.xlsx.writeFile(excelFilePath);

          // Add role to the Discord member
          const member = message.guild.members.cache.get(message.author.id);
          const role = message.guild.roles.cache.find(role => role.name === 'Challenger 1');

          if (role && member) {
            await member.roles.add(role);
            message.reply('Đã thêm roll cho bạn.');
          }
        } else {
          message.reply('Mã số sinh viên này đã được xác nhận hoặc không có.');
        }
      } catch (error) {
        console.error('Error accessing Excel file:', error);
        message.reply('Đã xảy ra lỗi khi truy cập tệp Excel.');
      }
    } else {
      message.reply('Mã số sinh viên không hợp lệ.');
    }
  }
});

client.on('ready', () => {
  console.log(`Bot đã sẵn sàng với tên: ${client.user.tag}`);
});

client.login(token);
