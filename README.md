# NovelThai - แพลตฟอร์มนิยายออนไลน์

แพลตฟอร์มอ่านนิยาย แต่งนิยาย และขายนิยาย ครบจบในที่เดียว พร้อมระบบเหรียญและแผงควบคุมผู้ดูแลระบบ

## 📁 โครงสร้างโปรเจกต์

```
├── web-novel/           # แอปหลัก - สำหรับผู้อ่านและนักเขียน (Port 3000)
├── web-novel-admin/     # แผงควบคุมผู้ดูแลระบบ (Port 3001)
├── tests/               # Playwright E2E tests (33 tests)
├── package.json         # Root dependencies
└── playwright.config.ts # Playwright configuration
```

## 🚀 เริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น
- Node.js 18+
- npm

### ติดตั้งและรัน

```bash
# ติดตั้ง dependencies สำหรับทั้งสองแอป
cd web-novel && npm install
cd ../web-novel-admin && npm install

# รันฐานข้อมูล
cd web-novel && npx prisma generate && npx prisma migrate dev

# ใส่ข้อมูลตัวอย่าง
npm run db:seed

# เริ่มเซิร์ฟเวอร์ (คนละเทอร์มินัล)
cd web-novel && npm run dev          # http://localhost:3000
cd web-novel-admin && npm run dev    # http://localhost:3001
```

## 🔑 บัญชีทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|----------|
| ADMIN | `admin@novelthai.com` | `password123` |
| AUTHOR | `writer1@example.com` | `password123` |
| READER | `reader1@example.com` | `password123` |

## 🛠 เทคโนโลยี

| ชั้น | เทคโนโลยี |
|-----|-----------|
| Framework | Next.js 16 (App Router) |
| ภาษา | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Lucide Icons |
| Auth | NextAuth.js (Credentials provider) |
| ฐานข้อมูล | SQLite + Prisma 6 |
| รหัสผ่าน | bcryptjs |

## 📊 ฐานข้อมูล

### โมเดลหลัก (13 โมเดล)

| โมเดล | รายละเอียด |
|-------|-----------|
| **User** | บัญชีผู้ใช้ + กระเป๋าเหรียญ |
| **Novel** | นิยาย + สถานะเผยแพร่ + ราคา |
| **Chapter** | บทนิยาย + เนื้อหา + ฟรี/เสียเงิน |
| **Category** | หมวดหมู่/แนวนิยาย |
| **Bookmark** | บุ๊คมาร์คนิยาย |
| **Purchase** | การซื้อด้วยเหรียญ |
| **CoinTransaction** | บันทึกการเคลื่อนไหวของเหรียญ |
| **PayoutRequest** | คำขอถอนเงินของผู้เขียน |
| **Rating** | คะแนน 1-5 ดาว |
| **Review** | รีวิวข้อความ |
| **Comment** | คอมเมนต์ในบท |
| **Notification** | การแจ้งเตือน |
| **Follow** | ระบบติดตามนักเขียน |
| **ReadingHistory** | ประวัติการอ่าน + ความคืบหน้า |

### บทบาทผู้ใช้
- **READER** - อ่านนิยาย ซื้อนิยาย คอมเมนต์ รีวิว
- **AUTHOR** - เขียนนิยาย จัดการนิยาย ดูสถิติ ถอนเงิน
- **ADMIN** - จัดการทุกอย่างในแผงควบคุมผู้ดูแล

## 🌐 เส้นทาง

### Web Novel (Port 3000)

| เส้นทาง | รายละเอียด |
|---------|-----------|
| `/` | หน้าแรก |
| `/auth/login` | เข้าสู่ระบบ |
| `/auth/register` | สมัครสมาชิก |
| `/novels` | เรียกดูนิยายทั้งหมด |
| `/novel/[id]` | รายละเอียดนิยาย |
| `/read/[slug]/[chapterId]` | อ่านบทนิยาย |
| `/categories` | หมวดหมู่ |
| `/ranking` | จัดอันดับ |
| `/search` | ค้นหา |
| `/shop` | เติมเหรียญ |
| `/profile` | โปรไฟล์ผู้ใช้ |
| `/settings` | ตั้งค่าบัญชี |
| `/write` | เขียนนิยาย (AUTHOR/ADMIN) |
| `/dashboard` | แดชบอร์ดนักเขียน (AUTHOR/ADMIN) |
| `/dashboard/payout` | ถอนเงิน (AUTHOR/ADMIN) |
| `/dashboard/stats` | สถิติ (AUTHOR/ADMIN) |

### Admin Panel (Port 3001)

| เส้นทาง | รายละเอียด |
|---------|-----------|
| `/` | แดชบอร์ดภาพรวม |
| `/login` | เข้าสู่ระบบแอดมิน |
| `/users` | จัดการผู้ใช้ |
| `/novels` | จัดการนิยาย |
| `/categories` | จัดการหมวดหมู่ |
| `/finance` | การเงิน |
| `/settings` | ตั้งค่าระบบ |

## 💰 ระบบเหรียญ

- **เติมเหรียญ** - ซื้อเหรียญด้วยเงินจริง
- **ซื้อนิยาย/บท** - ใช้เหรียญปลดล็อกเนื้อหาพรีเมียม
- **รายได้ผู้เขียน** - 70% ของการขายเข้ากระเป๋าผู้เขียน 30% เป็นค่าแพลตฟอร์ม
- **ถอนเงิน** - ผู้เขียนขอถอนเหรียญเป็นเงินบาท (100 เหรียญ = 25 บาท ขั้นต่ำ 1,000 เหรียญ)

## 🧪 การทดสอบ

```bash
# รันทดสอบทั้งหมด (เริ่มเซิร์ฟเวอร์อัตโนมัติ + ปิดหลังเสร็จ)
node run-tests.js

# รันทดสอบอย่างเดียว (ต้องเริ่มเซิร์ฟเวอร์ก่อน)
npx playwright test
```

### เทสที่ครอบคลุม (33 เทส)

| หมวด | จำนวน |
|------|-------|
| ค้นหาและนำทาง | 6 |
| เข้าสู่ระบบ/สมัคร | 4 |
| อ่าน/เขียนนิยาย | 6 |
| ร้านค้า/ตั้งค่า | 3 |
| แผงควบคุมผู้ดูแล | 8 |
| เดิม | 6 |

## 📜 สคริปต์

### web-novel
```bash
npm run dev       # เริ่มเซิร์ฟเวอร์พัฒนา
npm run build     # บิลด์สำหรับโปรดักชัน
npm run start     # เริ่มเซิร์ฟเวอร์โปรดักชัน
npm run lint      # ตรวจสอบโค้ด
npm run db:seed   # ใส่ข้อมูลตัวอย่าง
```

### web-novel-admin
```bash
npm run dev       # เริ่มเซิร์ฟเวอร์พัฒนา
npm run build     # บิลด์สำหรับโปรดักชัน
npm run start     # เริ่มเซิร์ฟเวอร์โปรดักชัน
npm run lint      # ตรวจสอบโค้ด
```

## 📝 ใบอนุญาต

© 2024 NovelThai. All rights reserved.
