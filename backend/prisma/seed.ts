const { PrismaClient } = require('../src/generated/prisma');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

function findUniqueFromExcel(fileName: any, columnIndex: any) {
  const filePath = path.join(__dirname, fileName);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const allNames = data
    .slice(1)
    .map((row: any) => row[columnIndex])
    .filter((name: any) => name && name.toString().trim() !== '')
    .map((name: any) => name.toString());
  return [...new Set(allNames)];
}

async function main() {
  console.log('Xóa dữ liệu cũ...');
  await prisma.country.deleteMany();
  await prisma.occupation.deleteMany();
  await prisma.ethnic.deleteMany();
  console.log('Đã xóa xong dữ liệu cũ. Bắt đầu seeding...');

  // Seed Country
  const countries = findUniqueFromExcel('QuocGia.xlsx', 4);
  for (const name of countries) {
    await prisma.country.create({ data: { name } });
  }
  console.log(`Đã seed ${countries.length} quốc gia.`);

  // Seed Occupation
  const occupations = findUniqueFromExcel('NgheNghiep.xlsx', 4);
  for (const name of occupations) {
    await prisma.occupation.create({ data: { name } });
  }
  console.log(`Đã seed ${occupations.length} nghề nghiệp.`);

  // Seed Ethnic
  const ethnics = findUniqueFromExcel('Dantoc.xlsx', 4);
  for (const name of ethnics) {
    await prisma.ethnic.create({ data: { name } });
  }
  console.log(`Đã seed ${ethnics.length} dân tộc.`);

  console.log('Seeding hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 