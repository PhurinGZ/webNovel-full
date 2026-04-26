const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.readingHistory.deleteMany();
  await prisma.coinTransaction.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.novel.deleteMany();
  await prisma.category.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@novelthai.com' },
    update: {},
    create: {
      email: 'admin@novelthai.com',
      username: 'admin',
      password: hashedPassword,
      name: 'ผู้ดูแลระบบ',
      role: 'ADMIN',
      bio: 'ผู้ดูแลระบบ NovelThai',
      coins: 99999,
    },
  });

  const author1 = await prisma.user.upsert({
    where: { email: 'writer1@example.com' },
    update: {},
    create: {
      email: 'writer1@example.com',
      username: 'นักเขียนมือใหม่',
      password: hashedPassword,
      name: 'สมชาย เขียนเก่ง',
      role: 'AUTHOR',
      bio: 'นักเขียนแนวแฟนตาซี กำลังภายใน',
      coins: 5000,
    },
  });

  const author2 = await prisma.user.upsert({
    where: { email: 'writer2@example.com' },
    update: {},
    create: {
      email: 'writer2@example.com',
      username: 'น้ำผึ้งป่า',
      password: hashedPassword,
      name: 'สมหญิง รักเขียน',
      role: 'AUTHOR',
      bio: 'นักเขียนแนวโรแมนติก ดราม่า',
      coins: 3500,
    },
  });

  const reader1 = await prisma.user.upsert({
    where: { email: 'reader1@example.com' },
    update: {},
    create: {
      email: 'reader1@example.com',
      username: 'นักอ่านตัวยง',
      password: hashedPassword,
      name: 'วิชัย อ่านสนุก',
      role: 'READER',
      bio: 'ชอบอ่านนิยายแฟนตาซีและกำลังภายใน',
      coins: 1500,
    },
  });

  const reader2 = await prisma.user.upsert({
    where: { email: 'reader2@example.com' },
    update: {},
    create: {
      email: 'reader2@example.com',
      username: 'แฟนนิยาย',
      password: hashedPassword,
      name: 'มานี อ่านทุกวัน',
      role: 'READER',
      bio: 'ติดนิยายโรแมนติก',
      coins: 800,
    },
  });

  const author3 = await prisma.user.upsert({
    where: { email: 'writer3@example.com' },
    update: {},
    create: {
      email: 'writer3@example.com',
      username: 'นักสืบพเนจร',
      password: hashedPassword,
      name: 'สมศักดิ์ ลับเฉพาะ',
      role: 'AUTHOR',
      bio: 'นักเขียนแนวสืบสวน ระทึกขวัญ',
      coins: 7200,
    },
  });

  const author4 = await prisma.user.upsert({
    where: { email: 'writer4@example.com' },
    update: {},
    create: {
      email: 'writer4@example.com',
      username: 'ไซไฟมาสเตอร์',
      password: hashedPassword,
      name: 'วิทย์ แกแล็กซี่',
      role: 'AUTHOR',
      bio: 'นักเขียนแนววิทยาศาสตร์ ไทรโลยี',
      coins: 4100,
    },
  });

  const reader3 = await prisma.user.upsert({
    where: { email: 'reader3@example.com' },
    update: {},
    create: {
      email: 'reader3@example.com',
      username: 'หนอนหนังสือ',
      password: hashedPassword,
      name: 'นิตา อ่านไม่หยุด',
      role: 'READER',
      bio: 'ชอบอ่านทุกแนว โดยเฉพาะสยองขวัญ',
      coins: 2200,
    },
  });

  const reader4 = await prisma.user.upsert({
    where: { email: 'reader4@example.com' },
    update: {},
    create: {
      email: 'reader4@example.com',
      username: 'นักอ่านหน้าใหม่',
      password: hashedPassword,
      name: 'ธนพล เรียนรู้ไว',
      role: 'READER',
      bio: 'เพิ่งเริ่มอ่านนิยาย ชอบแนวผจญภัย',
      coins: 500,
    },
  });

  // Create follow relationships
  await prisma.follow.createMany({
    data: [
      { followerId: reader1.id, followingId: author1.id },
      { followerId: reader2.id, followingId: author2.id },
      { followerId: reader3.id, followingId: author1.id },
      { followerId: reader3.id, followingId: author3.id },
      { followerId: reader4.id, followingId: author1.id },
      { followerId: reader1.id, followingId: author2.id },
    ],
  });

  console.log('Created users');

  // Create categories
  const categories = [
    { name: 'แฟนตาซี', slug: 'fantasy' },
    { name: 'โรแมนติก', slug: 'romance' },
    { name: 'ผจญภัย', slug: 'adventure' },
    { name: 'สยองขวัญ', slug: 'horror' },
    { name: 'ไซไฟ', slug: 'scifi' },
    { name: 'ตลก', slug: 'comedy' },
    { name: 'กำลังภายใน', slug: 'martial-arts' },
    { name: 'ดราม่า', slug: 'drama' },
    { name: 'แอคชั่น', slug: 'action' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Created categories');

  // Create novels
  const novel1 = await prisma.novel.upsert({
    where: { slug: 'daen-nakarb-pichit-fa' },
    update: {},
    create: {
      title: 'แดนนักรบพิชิตฟ้า',
      slug: 'daen-nakarb-pichit-fa',
      description: 'เรื่องราวของหนุ่มน้อยนามว่า หลินฟาน ผู้มีชีวิตธรรมดาในหมู่บ้านเล็กๆ จนกระทั่งวันหนึ่งได้พบกับหนังสือเวทมนตร์โบราณที่ทิ้งท้ายมาจากบรรพบุรุษ ทำให้เขาออกเดินทางเพื่อพิชิตสวรรค์ พร้อมผจญภัยในโลกแห่งเวทมนตร์ อันตราย และมิตรภาพ',
      coverImage: 'https://placehold.co/400x600/dc2626/ffffff?text=Novel+1',
      authorId: author1.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 99,
      rating: 4.5,
      views: 15000,
      categories: {
        connect: [
          { slug: 'fantasy' },
          { slug: 'adventure' },
          { slug: 'martial-arts' },
        ],
      },
    },
  });

  const novel2 = await prisma.novel.upsert({
    where: { slug: 'ruk-na-jao-ying' },
    update: {},
    create: {
      title: 'รักนะ...เจ้าหญิง',
      slug: 'ruk-na-jao-ying',
      description: 'นิยายรักโรแมนติกในวังหลวง ของหญิงสาวสามัญชนกับเจ้าชาย เรื่องราวความรักที่ต้องเผชิญกับอุปสรรคมากมาย',
      coverImage: 'https://placehold.co/400x600/f97316/ffffff?text=Novel+2',
      authorId: author2.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 79,
      rating: 4.8,
      views: 25000,
      categories: {
        connect: [
          { slug: 'romance' },
          { slug: 'drama' },
        ],
      },
    },
  });

  const novel3 = await prisma.novel.upsert({
    where: { slug: 'say-iu-chab-mai' },
    update: {},
    create: {
      title: 'ไซอิ๋ว ฉบับใหม่',
      slug: 'say-iu-chab-mai',
      description: 'การผจญภัยสุดมันส์ในดินแดนเวทมนตร์ เรื่องราวของลิงจอมซนกับคณะเดินทางสู่ตะวันตก',
      coverImage: 'https://placehold.co/400x600/3b82f6/ffffff?text=Novel+3',
      authorId: author1.id,
      status: 'PUBLISHED',
      isFree: true,
      price: 0,
      rating: 4.2,
      views: 8000,
      categories: {
        connect: [
          { slug: 'adventure' },
          { slug: 'comedy' },
        ],
      },
    },
  });

  const novel4 = await prisma.novel.upsert({
    where: { slug: 'nak-rien-wet-mon' },
    update: {},
    create: {
      title: 'ชีวิตนักเรียนเวทมนตร์',
      slug: 'nak-rien-wet-mon',
      description: 'เรื่องราวในโรงเรียนเวทมนตร์ การผจญภัยของวัยรุ่นกับพลังเวทอันน่าทึ่ง',
      coverImage: 'https://placehold.co/400x600/8b5cf6/ffffff?text=Novel+4',
      authorId: author2.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 149,
      rating: 4.6,
      views: 30000,
      categories: {
        connect: [
          { slug: 'fantasy' },
          { slug: 'action' },
        ],
      },
    },
  });

  console.log('Created novels');

  // Create novel 5 - Mystery/Thriller
  const novel5 = await prisma.novel.upsert({
    where: { slug: 'karma-laboratory' },
    update: {},
    create: {
      title: 'Karma Laboratory',
      slug: 'karma-laboratory',
      description: 'ในห้องทดลองลับของนักจิตวิทยาอัจฉริยะ การทดลองที่เริ่มจากความต้องการเข้าใจจิตใจมนุษย์ กลับกลายเป็นเกมแมวไล่จับหนูที่เต็มไปด้วยความลับและการหักหลัง',
      coverImage: 'https://placehold.co/400x600/6366f1/ffffff?text=Novel+5',
      authorId: author3.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 129,
      rating: 4.7,
      views: 18500,
      categories: {
        connect: [
          { slug: 'horror' },
          { slug: 'drama' },
        ],
      },
    },
  });

  // Create novel 6 - Sci-Fi
  const novel6 = await prisma.novel.upsert({
    where: { slug: 'quantum-paradox' },
    update: {},
    create: {
      title: 'Quantum Paradox',
      slug: 'quantum-paradox',
      description: 'ในปี 2157 มนุษย์ค้นพบวิธีเดินทางข้ามมิติ แต่ทุกครั้งที่ใช้เทคโนโลยีนี้ จะเกิดพาราด็อกซ์ที่ส่งผลต่อความเป็นจริง พระเอกต้องเดินทางข้ามมิติเพื่อแก้ไขข้อผิดพลาดที่ตัวเองสร้างไว้',
      coverImage: 'https://placehold.co/400x600/0ea5e9/ffffff?text=Novel+6',
      authorId: author4.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 199,
      rating: 4.9,
      views: 42000,
      categories: {
        connect: [
          { slug: 'scifi' },
          { slug: 'adventure' },
          { slug: 'action' },
        ],
      },
    },
  });

  // Create novel 7 - Comedy
  const novel7 = await prisma.novel.upsert({
    where: { slug: 'office-wai-wai' },
    update: {},
    create: {
      title: 'Office วัยว้าวุ่น',
      slug: 'office-wai-wai',
      description: 'ชีวิตการทำงานของแก๊งออฟฟิศหน้าใหม่ ที่ต้องเผชิญกับหัวหน้าสุดฮา ลูกค้าจอมเรื่อง และสถานการณ์ปวดหัวปนขำทุกวัน',
      coverImage: 'https://placehold.co/400x600/facc15/ffffff?text=Novel+7',
      authorId: author2.id,
      status: 'PUBLISHED',
      isFree: true,
      price: 0,
      rating: 4.3,
      views: 12000,
      categories: {
        connect: [
          { slug: 'comedy' },
          { slug: 'drama' },
        ],
      },
    },
  });

  // Create novel 8 - Dark Fantasy
  const novel8 = await prisma.novel.upsert({
    where: { slug: 'shadow-realm-chronicles' },
    update: {},
    create: {
      title: 'Shadow Realm Chronicles',
      slug: 'shadow-realm-chronicles',
      description: 'ดินแดนแห่งเงาที่ซ่อนอยู่คู่ขนานกับโลกมนุษย์ เมื่อประตูระหว่างสองโลกถูกเปิดออก มนุษย์ธรรมดาต้องต่อสู้เพื่อเอาชีวิตรอดจากอสูรเงา',
      coverImage: 'https://placehold.co/400x600/4c1d95/ffffff?text=Novel+8',
      authorId: author1.id,
      status: 'PUBLISHED',
      isFree: false,
      price: 169,
      rating: 4.6,
      views: 22000,
      categories: {
        connect: [
          { slug: 'fantasy' },
          { slug: 'action' },
          { slug: 'horror' },
        ],
      },
    },
  });

  console.log('Created additional novels');

  // Create chapters for novel 1
  const chapterContents = [
    'ในหมู่บ้านเล็กๆ ที่ตั้งอยู่ท่ามกลางหุบเขาอันห่างไกล มีเด็กหนุ่มคนหนึ่งชื่อว่า หลินฟาน อาศัยอยู่กับลุงและป้าของเขาตั้งแต่ยังเล็ก\n\nหลินฟานเป็นเด็กกำพร้า ที่พ่อแม่ของเขาเสียชีวิตจากการโจมตีของสัตว์อสูรตั้งแต่เขายังแบเบือก ลุงของเขาเป็นผู้เลี้ยงแกะในหมู่บ้าน จึงทำให้เขามีชีวิตที่เรียบง่ายและเงียบสงบ\n\nแต่แล้ววันหนึ่ง ชีวิตของเขาก็ต้องเปลี่ยนไปตลอดกาล...',
    'เช้าวันใหม่ หลินฟานตื่นขึ้นมาพร้อมกับความรู้สึกประหลาด ราวกับว่ามีบางอย่างกำลังเรียกหาเขาจากในป่าลึก\n\n"วันนี้รู้สึกแปลกๆ ยังไงไม่รู้" หลินฟานพึมพำกับตัวเองขณะมองออกไปนอกหน้าต่าง\n\nป่าใหญ่ที่ทอดยาวอยู่สุดลูกหูลูกตาดูเหมือนจะมีอะไรบางอย่างที่แตกต่างไปจากเดิม หมอกหนาที่ปกคลุมไปทั่วทำให้มองเห็นได้ไม่ไกลนัก',
    'หลินฟานตัดสินใจเดินเข้าไปในป่า เพื่อค้นหาที่มาของความรู้สึกประหลาดนี้\n\nทุกๆ ก้าวที่เดินเข้าไปในป่า เขารู้สึกเหมือนว่าพลังงานบางอย่างกำลังไหลเวียนอยู่ในร่างกาย\n\n"หรือว่านี่จะเป็น..." หลินฟานหยุดคิดขณะมองเห็นแสงสว่างจ้าพุ่งออกมาจากใต้โคนต้นไม้ใหญ่',
  ];

  for (let i = 0; i < 3; i++) {
    await prisma.chapter.create({
      data: {
        novelId: novel1.id,
        title: `ตอนที่ ${i + 1}: การเริ่มต้นผจญภัย`,
        content: chapterContents[i],
        order: i + 1,
        isFree: i < 2,
        price: 5,
        wordCount: chapterContents[i].split(/\s+/).filter(Boolean).length,
        publishedAt: new Date(),
      },
    });
  }

  // Create chapters for novel 2
  await prisma.chapter.create({
    data: {
      novelId: novel2.id,
      title: 'ตอนที่ 1: การพบกันครั้งแรก',
      content: 'ในวังหลวงที่กว้างใหญ่ มีหญิงสาวสามัญชนคนหนึ่งชื่อว่า มะลิ นางทำงานอยู่ในครัวหลวง\n\nวันหนึ่ง ขณะที่มะลิกำลังเก็บดอกไม้ในสวน นางก็ได้พบกับเจ้าชายองค์น้อยผู้หล่อเหลา\n\n"เจ้าเป็นใคร?" เจ้าชายตรัสถามด้วยพระสุรเสียงที่อบอุ่น\n\n"ข้าชื่อมะลิเจ้าคะ เป็นคนครัวหลวง" มะลิตอบด้วยเสียงที่สั่นเครือ',
      order: 1,
      isFree: true,
      price: 5,
      wordCount: 100,
      publishedAt: new Date(),
    },
  });

  // Create chapters for novel 3
  const novel3Chapters = [
    { title: 'ตอนที่ 1: ลิงน้อยจอมพลัง', content: 'ในป่าใหญ่ที่มีต้นไม้สูงเสียดฟ้า มีลิงตัวหนึ่งที่เกิดมามีพลังพิเศษไม่เหมือนใคร ลิงน้อยสามารถกระโดดข้ามภูเขาได้เพียงแค่ครั้งเดียว และมีความเร็วที่ไม่มีใครเทียบได้\n\nวันหนึ่ง พระอาจารย์ถังได้เดินทางผ่านมาและพบกับลิงน้อย จึงชวนไปร่วมเดินทางสู่ตะวันตกเพื่ออัญเชิญพระไตรปิฎก\n\n"เจ้าจะมาร่วมเดินทางกับข้าหรือไม่?" พระอาจารย์ถังถามด้วยน้ำเสียงที่เมตตา' },
    { title: 'ตอนที่ 2: ตือโป๊ยก่ายสมัครพรรค', content: 'ระหว่างทาง คณะเดินทางได้พบกับตือโป๊ยก่าย อดีตแม่ทัพสวรรค์ที่ถูกสาปให้กลายเป็นหมูครึ่งคนครึ่งหมู ตือโป๊ยก่ายอยากเข้าร่วมคณะเพราะต้องการไถ่บาปที่ทำไว้สมัยอยู่บนสวรรค์' },
  ];

  for (let i = 0; i < novel3Chapters.length; i++) {
    await prisma.chapter.create({
      data: {
        novelId: novel3.id,
        title: novel3Chapters[i].title,
        content: novel3Chapters[i].content,
        order: i + 1,
        isFree: true,
        price: 0,
        wordCount: novel3Chapters[i].content.split(/\s+/).filter(Boolean).length,
        publishedAt: new Date(),
      },
    });
  }

  // Create chapters for novel 4
  const novel4Chapters = [
    { title: 'ตอนที่ 1: จดหมายตอบรับจากโรงเรียนเวทมนตร์', content: 'เด็กสาวธรรมดาคนหนึ่งชื่อว่า อารยา ได้รับจดหมายลึกลับที่บอกว่าเธอมีความสามารถพิเศษด้านเวทมนตร์ และได้รับเชิญให้เข้าเรียนในโรงเรียนเวทมนตร์ที่ซ่อนอยู่ในมิติคู่ขนาน' },
  ];

  await prisma.chapter.create({
    data: {
      novelId: novel4.id,
      title: novel4Chapters[0].title,
      content: novel4Chapters[0].content,
      order: 1,
      isFree: true,
      price: 10,
      wordCount: novel4Chapters[0].content.split(/\s+/).filter(Boolean).length,
      publishedAt: new Date(),
    },
  });

  // Create chapters for novel 5
  const novel5Chapters = [
    { title: 'ตอนที่ 1: การทดลองที่ซ่อนเร้น', content: 'ดร.คณากร นักจิตวิทยาชื่อดัง ได้เปิดห้องทดลองลับใต้ดินของตึกระฟ้าในเมืองหลวง ผู้เข้าร่วมการทดลอง 10 คนได้รับเชิญด้วยคำสัญญาว่าจะได้รับเงินก้อนโต แต่ไม่มีใครรู้ว่าการทดลองนี้จะเปลี่ยนชีวิตพวกเขาไปตลอดกาล' },
  ];

  await prisma.chapter.create({
    data: {
      novelId: novel5.id,
      title: novel5Chapters[0].title,
      content: novel5Chapters[0].content,
      order: 1,
      isFree: false,
      price: 8,
      wordCount: novel5Chapters[0].content.split(/\s+/).filter(Boolean).length,
      publishedAt: new Date(),
    },
  });

  // Create chapters for novel 6
  const novel6Chapters = [
    { title: 'ตอนที่ 1: การเดินทางครั้งแรก', content: 'ปี 2157 เทคโนโลยีควอนตัมเดินทางข้ามมิติถูกพัฒนาสำเร็จ ดร.ปริญญานักฟิสิกส์หนุ่มเป็นผู้ได้ทดสอบเดินทางข้ามมิติเป็นคนแรก แต่สิ่งที่เขาพบในมิติคู่ขนานนั้นไม่ใช่สิ่งที่ใครคาดคิด' },
  ];

  await prisma.chapter.create({
    data: {
      novelId: novel6.id,
      title: novel6Chapters[0].title,
      content: novel6Chapters[0].content,
      order: 1,
      isFree: false,
      price: 12,
      wordCount: novel6Chapters[0].content.split(/\s+/).filter(Boolean).length,
      publishedAt: new Date(),
    },
  });

  // Create chapters for novel 7
  const novel7Chapters = [
    { title: 'ตอนที่ 1: วันแรกที่ออฟฟิศ', content: 'แก๊งพนักงานใหม่ 5 คนเข้ามาทำงานในออฟฟิศวันแรก แต่ละคนมีบุคลิกที่แตกต่างกันอย่างสิ้นเชิง คนแรกพูดมาก คนที่สองขี้อาย คนที่สามชอบอู้ คนที่สี่จริงจังเกินไป และคนที่ห้าชอบหลับ' },
  ];

  await prisma.chapter.create({
    data: {
      novelId: novel7.id,
      title: novel7Chapters[0].title,
      content: novel7Chapters[0].content,
      order: 1,
      isFree: true,
      price: 0,
      wordCount: novel7Chapters[0].content.split(/\s+/).filter(Boolean).length,
      publishedAt: new Date(),
    },
  });

  // Create chapters for novel 8
  const novel8Chapters = [
    { title: 'ตอนที่ 1: ประตูแห่งเงา', content: 'ในคืนพระจันทร์เต็มดวง ประตูระหว่างโลกมนุษย์และดินแดนแห่งเงาถูกเปิดออก อสูรเงาเริ่มบุกเข้ามาในโลกมนุษย์ มีเพียงไม่กี่คนที่มีความสามารถต่อสู้กับพวกมันได้' },
  ];

  await prisma.chapter.create({
    data: {
      novelId: novel8.id,
      title: novel8Chapters[0].title,
      content: novel8Chapters[0].content,
      order: 1,
      isFree: false,
      price: 10,
      wordCount: novel8Chapters[0].content.split(/\s+/).filter(Boolean).length,
      publishedAt: new Date(),
    },
  });

  console.log('Created chapters');

  // Create some bookmarks
  await prisma.bookmark.createMany({
    data: [
      { userId: reader1.id, novelId: novel1.id },
      { userId: reader2.id, novelId: novel2.id },
    ],
  });

  // Create some reviews
  await prisma.review.create({
    data: {
      userId: reader1.id,
      novelId: novel1.id,
      content: 'สนุกมาก! พระเอกเก่ง เนื้อเรื่องน่าติดตาม รออ่านตอนต่อไปทุกสัปดาห์',
    },
  });

  await prisma.review.create({
    data: {
      userId: reader2.id,
      novelId: novel2.id,
      content: 'โรแมนติกมากๆ พระเอกนางเอกน่ารัก น้ำตาไหลเลยตอนจบ',
    },
  });

  // Create some ratings
  await prisma.rating.create({
    data: {
      userId: reader1.id,
      novelId: novel1.id,
      score: 5,
    },
  });

  await prisma.rating.create({
    data: {
      userId: reader2.id,
      novelId: novel2.id,
      score: 5,
    },
  });

  await prisma.rating.create({
    data: {
      userId: reader1.id,
      novelId: novel2.id,
      score: 4,
    },
  });

  // Create more ratings
  await prisma.rating.createMany({
    data: [
      { userId: reader3.id, novelId: novel1.id, score: 4 },
      { userId: reader4.id, novelId: novel1.id, score: 5 },
      { userId: reader1.id, novelId: novel3.id, score: 4 },
      { userId: reader3.id, novelId: novel5.id, score: 5 },
      { userId: reader1.id, novelId: novel6.id, score: 5 },
      { userId: reader3.id, novelId: novel6.id, score: 5 },
      { userId: reader4.id, novelId: novel6.id, score: 4 },
      { userId: reader2.id, novelId: novel7.id, score: 4 },
      { userId: reader3.id, novelId: novel7.id, score: 5 },
      { userId: reader1.id, novelId: novel8.id, score: 5 },
      { userId: reader3.id, novelId: novel8.id, score: 4 },
      { userId: reader4.id, novelId: novel8.id, score: 5 },
    ],
  });

  // Create more reviews
  await prisma.review.createMany({
    data: [
      { userId: reader3.id, novelId: novel1.id, content: 'แฟนตาซีสุดมันส์ พระเอกพัฒนาตัวเองเรื่อยๆ ชอบระบบเวทมนตร์ในเรื่อง' },
      { userId: reader4.id, novelId: novel3.id, content: 'อ่านแล้วสนุก ตลกดี เหมาะสำหรับเด็กและผู้ใหญ่' },
      { userId: reader1.id, novelId: novel5.id, content: 'ระทึกขวัญจนถึงตอนจบ ทุกตัวเชื่อมัดกันได้อย่างชาญฉลาด' },
      { userId: reader3.id, novelId: novel5.id, content: 'จิตวิทยาลึกซึ้ง ทำให้คิดถึงเรื่องจริยธรรมในการทดลอง' },
      { userId: reader1.id, novelId: novel6.id, content: 'ไซไฟที่ฉลาดมาก พาราด็อกซ์ทุกเรื่องอธิบายได้หมด ไม่ทิ้งค้าง' },
      { userId: reader3.id, novelId: novel6.id, content: 'ฉากแอคชั่นมันส์ เนื้อเรื่องแน่นมาก อ่านแล้ววางไม่ลง' },
      { userId: reader2.id, novelId: novel7.id, content: 'ตลกมาก หัวเราะทุกตอน ตัวละครแต่ละตัวมีเอกลักษณ์' },
      { userId: reader1.id, novelId: novel8.id, content: 'ดาร์กแฟนตาซีที่สมบูรณ์แบบ ฉากต่อสู้สวยงาม เนื้อเรื่องลึกซึ้ง' },
      { userId: reader3.id, novelId: novel8.id, content: 'โลกแห่งเงาสร้างได้สร้างสรรค์มาก ตื่นเต้นทุกตอน' },
    ],
  });

  // Create more bookmarks
  await prisma.bookmark.createMany({
    data: [
      { userId: reader1.id, novelId: novel6.id },
      { userId: reader1.id, novelId: novel8.id },
      { userId: reader2.id, novelId: novel7.id },
      { userId: reader3.id, novelId: novel1.id },
      { userId: reader3.id, novelId: novel5.id },
      { userId: reader3.id, novelId: novel6.id },
      { userId: reader4.id, novelId: novel1.id },
      { userId: reader4.id, novelId: novel8.id },
    ],
  });

  // Create coin transactions
  await prisma.coinTransaction.createMany({
    data: [
      { userId: reader1.id, amount: -99, type: 'PURCHASE', description: 'ซื้อนิยาย แดนนักรบพิชิตฟ้า' },
      { userId: reader2.id, amount: -79, type: 'PURCHASE', description: 'ซื้อนิยาย รักนะ...เจ้าหญิง' },
      { userId: author1.id, amount: 50, type: 'EARN', description: 'รายได้จากนิยาย แดนนักรบพิชิตฟ้า' },
      { userId: author2.id, amount: 40, type: 'EARN', description: 'รายได้จากนิยาย รักนะ...เจ้าหญิง' },
      { userId: reader3.id, amount: 100, type: 'TOP_UP', description: 'เติมเหรียญ' },
      { userId: reader4.id, amount: 100, type: 'TOP_UP', description: 'เติมเหรียญ' },
    ],
  });

  // Create reading history
  await prisma.readingHistory.createMany({
    data: [
      { userId: reader1.id, novelId: novel1.id, chapterId: (await prisma.chapter.findFirst({ where: { novelId: novel1.id, order: 1 } })).id, progress: 100 },
      { userId: reader1.id, novelId: novel6.id, chapterId: (await prisma.chapter.findFirst({ where: { novelId: novel6.id, order: 1 } })).id, progress: 50 },
      { userId: reader2.id, novelId: novel2.id, chapterId: (await prisma.chapter.findFirst({ where: { novelId: novel2.id, order: 1 } })).id, progress: 100 },
      { userId: reader3.id, novelId: novel5.id, chapterId: (await prisma.chapter.findFirst({ where: { novelId: novel5.id, order: 1 } })).id, progress: 75 },
      { userId: reader4.id, novelId: novel1.id, chapterId: (await prisma.chapter.findFirst({ where: { novelId: novel1.id, order: 1 } })).id, progress: 30 },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: author1.id, type: 'REVIEW', title: 'มีรีวิวใหม่', content: 'reader1 ได้รีวิวเรื่อง แดนนักรบพิชิตฟ้า', link: `/novel/${novel1.id}`, read: false },
      { userId: author2.id, type: 'FOLLOW', title: 'มีคนติดตาม', content: 'reader2 ได้ติดตามคุณ', link: `/profile/reader2`, read: true },
      { userId: author1.id, type: 'PURCHASE', title: 'มีการซื้อใหม่', content: 'reader3 ได้ซื้อนิยายของคุณ', link: `/novel/${novel1.id}`, read: false },
      { userId: author1.id, type: 'RATING', title: 'ได้คะแนนใหม่', content: 'reader4 ให้คะแนน 5 ดาว', link: `/novel/${novel1.id}`, read: false },
      { userId: author4.id, type: 'REVIEW', title: 'มีรีวิวใหม่', content: 'reader1 ได้รีวิวเรื่อง Quantum Paradox', link: `/novel/${novel6.id}`, read: false },
    ],
  });

  console.log('Created reviews, ratings, bookmarks, and transactions');

  console.log('\nSeed completed successfully!');
  console.log('\nTest accounts:');
  console.log('  Admin:    admin@novelthai.com / password123');
  console.log('  Author 1: writer1@example.com / password123');
  console.log('  Author 2: writer2@example.com / password123');
  console.log('  Reader 1: reader1@example.com / password123');
  console.log('  Reader 2: reader2@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
