const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function findUniqueFromExcel(fileName: any, columnIndex: any) {
  const filePath = path.join(__dirname, fileName);
  console.log(`Đang đọc file: ${filePath}`);
  
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`Đọc được ${data.length} dòng từ ${fileName}`);
    
    const allNames = data
      .slice(1)
      .map((row: any) => row[columnIndex])
      .filter((name: any) => name && name.toString().trim() !== '')
      .map((name: any) => name.toString());
      
    console.log(`Tìm thấy ${allNames.length} tên duy nhất từ cột ${columnIndex} của ${fileName}`);
    
    return [...new Set(allNames)];
  } catch (error) {
    console.error(`Lỗi khi đọc file ${fileName}:`, error);
    return [];
  }
}

async function hashAllPasswords() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.password && !user.password.startsWith('$2')) {
      const hashed = bcrypt.hashSync(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed }
      });
      console.log(`Đã hash mật khẩu cho user: ${user.username}`);
    }
  }
  console.log('Hoàn thành!');
}

async function main() {
  console.log('Xóa dữ liệu cũ...');
  await prisma.user.deleteMany(); // Xoá toàn bộ user trước
  await prisma.country.deleteMany();
  await prisma.occupation.deleteMany();
  await prisma.ethnic.deleteMany();
  console.log('Đã xóa xong dữ liệu cũ. Bắt đầu seeding...');

  // Seed user admin
  const adminUsername = 'admin';
  const adminPassword = bcrypt.hashSync('Admin@123', 10);
  const adminRole = 'admin';
  try {
    const admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: adminPassword,
        role: adminRole,
        name: 'Admin',
        phone: '0123456789',
      }
    });
    console.log('Đã seed user admin:', admin);
  } catch (e) {
    console.error('Lỗi khi seed user admin:', e);
  }

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