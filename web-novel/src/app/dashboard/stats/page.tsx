'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Eye, Heart, DollarSign, TrendingUp, BarChart3, Users, Clock } from 'lucide-react';

// Mock stats data
const stats = {
  totalViews: 156780,
  totalFollowers: 2340,
  totalEarnings: 15600,
  totalChapters: 245,
  viewsThisWeek: 12500,
  viewsLastWeek: 10200,
  followersThisWeek: 156,
  followersLastWeek: 134,
  earningsThisWeek: 1200,
  earningsLastWeek: 980,
};

const dailyViews = [
  { day: 'จ', views: 1500 },
  { day: 'อ', views: 1800 },
  { day: 'พ', views: 2100 },
  { day: 'พฤ', views: 1900 },
  { day: 'ศ', views: 2400 },
  { day: 'ส', views: 2800 },
  { day: 'อา', views: 2600 },
];

const topNovels = [
  {
    id: '1',
    title: 'แดนนักรบพิชิตฟ้า',
    views: 45000,
    followers: 1200,
    earnings: 8500,
    chapters: 150,
  },
  {
    id: '2',
    title: 'ตำนานจอมยุทธ์',
    views: 32000,
    followers: 850,
    earnings: 5200,
    chapters: 95,
  },
  {
    id: '3',
    title: 'สงครามดวงดาว',
    views: 18000,
    followers: 540,
    earnings: 3100,
    chapters: 65,
  },
];

const recentActivity = [
  { id: '1', type: 'purchase', user: 'นักอ่าน ก', novel: 'แดนนักรบพิชิตฟ้า', amount: 99, time: '5 นาทีที่แล้ว' },
  { id: '2', type: 'review', user: 'แฟนนิยาย ข', novel: 'ตำนานจอมยุทธ์', content: 'สนุกมาก!', time: '15 นาทีที่แล้ว' },
  { id: '3', type: 'follow', user: 'นักอ่าน ค', time: '1 ชั่วโมงที่แล้ว' },
  { id: '4', type: 'purchase', user: 'นักอ่าน ง', novel: 'สงครามดวงดาว', amount: 149, time: '2 ชั่วโมงที่แล้ว' },
  { id: '5', type: 'rating', user: 'แฟนนิยาย จ', novel: 'แดนนักรบพิชิตฟ้า', score: 5, time: '3 ชั่วโมงที่แล้ว' },
];

export default function StatsDashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const maxViews = Math.max(...dailyViews.map(d => d.views));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">แดชบอร์ดนักเขียน</h1>
          <p className="text-gray-600">สถิติและประสิทธิภาพของนิยาย</p>
        </div>
        <Link href="/write" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          เขียนนิยาย
        </Link>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'week', label: 'สัปดาห์นี้' },
          { key: 'month', label: 'เดือนนี้' },
          { key: 'year', label: 'ปีนี้' },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as any)}
            className={`px-4 py-2 rounded-lg ${
              period === p.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-6 h-6 text-blue-500" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +22%
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">ยอดอ่านทั้งหมด</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-purple-500" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +16%
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.totalFollowers.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">ผู้ติดตาม</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +22%
            </span>
          </div>
          <p className="text-2xl font-bold">{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">เหรียญ (รายได้)</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{stats.totalChapters}</p>
          <p className="text-gray-600 text-sm">ตอนทั้งหมด</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Views Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              ยอดอ่านรายสัปดาห์
            </h2>
            <span className="text-sm text-gray-500">
              {stats.viewsThisWeek.toLocaleString()} อ่าน
            </span>
          </div>

          <div className="flex items-end gap-4 h-48">
            {dailyViews.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-medium">{day.views.toLocaleString()}</span>
                <div
                  className="w-full bg-primary-500 rounded-t transition-all"
                  style={{ height: `${(day.views / maxViews) * 120}px` }}
                />
                <span className="text-sm text-gray-600">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Novels */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            นิยายยอดนิยม
          </h2>

          <div className="space-y-4">
            {topNovels.map((novel, index) => (
              <div key={novel.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{novel.title}</p>
                  <p className="text-sm text-gray-500">
                    {novel.views.toLocaleString()} อ่าน | {novel.followers} ติดตาม
                  </p>
                </div>
                <span className="text-green-600 font-semibold">
                  {novel.earnings.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          กิจกรรมล่าสุด
        </h2>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              {activity.type === 'purchase' && (
                <DollarSign className="w-5 h-5 text-green-500" />
              )}
              {activity.type === 'review' && (
                <BookOpen className="w-5 h-5 text-blue-500" />
              )}
              {activity.type === 'follow' && (
                <Users className="w-5 h-5 text-purple-500" />
              )}
              {activity.type === 'rating' && (
                <Heart className="w-5 h-5 text-red-500" />
              )}

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {activity.type === 'purchase' && ` ซื้อ "${activity.novel}" (${activity.amount} เหรียญ)`}
                  {activity.type === 'review' && ` รีวิว "${activity.novel}": "${activity.content}"`}
                  {activity.type === 'follow' && ' เริ่มติดตามคุณ'}
                  {activity.type === 'rating' && ` ให้คะแนน "${activity.novel}" ${activity.score} ดาว`}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
