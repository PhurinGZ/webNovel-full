# NovelThai - Main Application

แพลตฟอร์มนิยายออนไลน์ที่ทันสมัยที่สุดสำหรับนักอ่านและนักเขียนชาวไทย พัฒนาด้วย Next.js และ Prisma

## 🌟 ฟีเจอร์หลัก (Main Features)
- **Modern UI**: หน้าตาเว็บไซต์แบบ Minimalist เน้นความสะอาดตาและอ่านง่าย
- **Novel Grid**: ระบบแสดงผลนิยายพร้อมข้อมูล Rating และ Views ในรูปแบบการ์ดที่สวยงาม
- **RBAC System**: ระบบควบคุมการเข้าถึงตามบทบาท (READER, AUTHOR, ADMIN)
- **Writing Suite**: เครื่องมือสำหรับนักเขียน (เข้าถึงได้เฉพาะบทบาท AUTHOR หรือ ADMIN)

## 🔐 ระบบสิทธิ์การใช้งาน (RBAC)
- **READER**: สามารถอ่านนิยาย, ค้นหา, และจัดการโปรไฟล์ส่วนตัว
- **AUTHOR**: เข้าถึงหน้าสำหรับเขียนนิยาย (`/write`) และแดชบอร์ดนักเขียน (`/dashboard`)
- **ADMIN**: เข้าถึงได้ทุกส่วนของเว็บไซต์ และสามารถจัดการระบบผ่าน Admin Panel แยกส่วน

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)
- **Framework**: Next.js 15+ (App Router)
- **Database**: SQLite (via Prisma)
- **Icons**: Lucide React
- **Authentication**: Next-Auth

## 🚀 วิธีการรันโปรเจค
```bash
npm install
npm run dev
```
แอปพลิเคชันจะรันอยู่ที่ `http://localhost:3000`
