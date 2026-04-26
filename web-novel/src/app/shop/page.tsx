'use client';

import { useState } from 'react';
import { Coins, CreditCard, Check, Star } from 'lucide-react';
import { topUpCoins } from './actions';

const coinPackages = [
  { id: 1, coins: 100, price: 35, bonus: 0, popular: false },
  { id: 2, coins: 300, price: 99, bonus: 30, popular: true },
  { id: 3, coins: 500, price: 159, bonus: 50, popular: false },
  { id: 4, coins: 1000, price: 299, bonus: 150, popular: false },
  { id: 5, coins: 2500, price: 699, bonus: 500, popular: false },
  { id: 6, coins: 5000, price: 1299, bonus: 1200, popular: false },
];

const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'รายเดือน',
    price: 299,
    coinsPerMonth: 500,
    features: [
      'ได้รับ 500 เหรียญ/เดือน',
      'อ่านนิยายพรีเมียมได้ไม่จำกัด',
      'ไม่มีโฆษณา',
      'เข้าถึงเนื้อหาพิเศษ',
    ],
  },
  {
    id: 'yearly',
    name: 'รายปี',
    price: 2990,
    coinsPerMonth: 600,
    features: [
      'ได้รับ 600 เหรียญ/เดือน',
      'อ่านนิยายพรีเมียมได้ไม่จำกัด',
      'ไม่มีโฆษณา',
      'เข้าถึงเนื้อหาพิเศษ',
      'ประหยัด 17%',
    ],
    popular: true,
  },
];

export default function CoinShopPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkg: any) => {
    setLoading(true);
    setSelectedPackage(pkg.id);
    
    try {
      const result = await topUpCoins(pkg.id, pkg.coins + pkg.bonus, pkg.price);
      if (result.success) {
        alert('เติมเหรียญสำเร็จ! ขอบคุณที่สนับสนุนครับ');
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการเติมเหรียญ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Coins className="w-8 h-8 text-accent-600" />
          ร้านเหรียญ
        </h1>
        <p className="text-gray-600">เติมเหรียญเพื่ออ่านนิยายพรีเมียม</p>
      </div>

      {/* Coin Packages */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">เลือกแพ็คเกจเหรียญ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl border-2 p-6 hover:shadow-lg transition cursor-pointer ${
                selectedPackage === pkg.id
                  ? 'border-primary-500 shadow-lg'
                  : pkg.popular
                  ? 'border-accent-500'
                  : 'border-gray-200'
              }`}
              onClick={() => !loading && handlePurchase(pkg)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 right-4 bg-accent-500 text-white text-xs px-3 py-1 rounded-full">
                  ยอดนิยม
                </div>
              )}

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{pkg.coins + pkg.bonus} เหรียญ</h3>
                {pkg.bonus > 0 && (
                  <p className="text-sm text-green-600 mb-2">
                    +{pkg.bonus} เหรียญโบนัส!
                  </p>
                )}
                <p className="text-3xl font-bold text-primary-600 mb-4">
                  ฿{pkg.price}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ตกเหรียญละ ฿{(pkg.price / (pkg.coins + pkg.bonus)).toFixed(2)}
                </p>

                <button
                  className={`w-full py-3 rounded-lg font-semibold ${
                    selectedPackage === pkg.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {loading && selectedPackage === pkg.id
                    ? 'กำลังดำเนินการ...'
                    : 'เลือกแพ็คเกจนี้'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-accent-600" />
          สมาชิกแบบพรีเมียม
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 ${
                plan.popular ? 'border-accent-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-accent-500 text-white text-sm px-4 py-1 rounded-full inline-block mb-4">
                  ประหยัดกว่า!
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary-600">
                  ฿{plan.price}
                </span>
                <span className="text-gray-500">
                  /{plan.id === 'monthly' ? 'เดือน' : 'ปี'}
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                ได้รับ {plan.coinsPerMonth} เหรียญ/เดือน
              </p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                สมัครพรีเมียม
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-12 bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">ช่องทางชำระเงิน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['บัตรเครดิต/เดบิต', 'พร้อมเพย์', 'TrueMoney', 'LINE Pay'].map(
            (method) => (
              <div
                key={method}
                className="flex items-center gap-2 p-4 border rounded-lg"
              >
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{method}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
