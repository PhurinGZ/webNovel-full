# NovelThai - Admin Panel

ระบบจัดการหลังบ้านสำหรับผู้ดูแลระบบ NovelThai แยกโปรเจคอิสระเพื่อความปลอดภัยและประสิทธิภาพ

## 🛠 ข้อมูลทางเทคนิค (Technical Info)
- **Standalone App**: แยกโฟลเดอร์จากเว็บหลักแต่เชื่อมต่อฐานข้อมูล SQLite ตัวเดียวกัน
- **Direct DB Access**: ใช้ Prisma เชื่อมต่อไปยัง `../web-novel/prisma/dev.db`
- **Auth.js v5**: ระบบยืนยันตัวตนเวอร์ชันล่าสุดพร้อมการป้องกันด้วย Middleware

## 🔐 ระบบจัดการ (Administrative Features)
- **Dashboard**: สรุปสถิติภาพรวม ยอดรายได้ และจำนวนผู้ใช้งานจริง
- **Novels Moderation**: อนุมัติ (Approve) หรือสั่งแก้ (Draft) นิยายในระบบ
- **User Management**: จัดการบทบาทผู้ใช้ (เปลี่ยน Reader เป็น Author หรือ Admin)
- **Category Control**: เพิ่ม/ลบ หมวดหมู่นิยายที่ใช้งานในระบบ

## 🛂 การควบคุมการเข้าถึง (Strict RBAC)
- **ADMIN ONLY**: เฉพาะผู้ใช้ที่มีบทบาท `ADMIN` ในฐานข้อมูลเท่านั้นที่สามารถ Login และเข้าถึงหน้า Dashboard ได้
- **Auto-Protection**: ระบบจะดีดผู้ใช้ที่ไม่ใช่ Admin กลับไปยังเว็บไซต์หลักโดยอัตโนมัติ

## 🚀 วิธีการรันโปรเจค
```bash
npm install
npm run dev -- -p 3003
```
แอปพลิเคชันจะรันอยู่ที่ `http://localhost:3003` (พอร์ตแยกจากโปรเจคหลัก)

## 📁 ความสัมพันธ์ของไฟล์ฐานข้อมูล
โปรเจคนี้อ้างอิง Schema และ Database จาก:
`DATABASE_URL="file:../../web-novel/prisma/dev.db"`
