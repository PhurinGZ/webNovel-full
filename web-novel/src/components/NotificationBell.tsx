'use client';

import { useState, useEffect } from 'react';
import { Bell, BookOpen, Star, Heart, DollarSign, UserPlus, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: '1',
        type: 'REVIEW',
        title: 'มีรีวิวใหม่',
        content: 'นักอ่านตัวยง ได้รีวิว "แดนนักรบพิชิตฟ้า"',
        link: '/novel/1',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'PURCHASE',
        title: 'มียอดขายใหม่',
        content: 'มีคนซื้อนิยายของคุณ "แดนนักรบพิชิตฟ้า"',
        link: '/dashboard',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'FOLLOW',
        title: 'มีผู้ติดตามใหม่',
        content: 'แฟนนิยาย เริ่มติดตามคุณแล้ว',
        link: '/profile',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
    setUnreadCount(2);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'RATING':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'PURCHASE':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'FOLLOW':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Heart className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">การแจ้งเตือน</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  อ่านทั้งหมด
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-0 hover:bg-gray-50 ${
                      !notification.read ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>ไม่มีการแจ้งเตือน</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
