const ExcelJS = require('exceljs');
const excelFilePath = "src/F19.xlsx";
const workbook = new ExcelJS.Workbook();
let foundStudent = 0;

const test = async () => {
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet
    worksheet.eachRow(function(row, rowNumber) {
        // console.log(rowNumber);
        if(row.getCell('E').value.toUpperCase() === "SE172070".toUpperCase() && row.getCell('I').value === 0)
            foundStudent = rowNumber;
    });
    rowTest = worksheet.getRow(foundStudent)
    rowTest.getCell(9).value = "1"
    // console.log(rowTest.getCell(9).value);
    await workbook.xlsx.writeFile(excelFilePath);
};

test();

