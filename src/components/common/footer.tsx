'use client';

import { useThemeClasses } from '@/contexts/theme-context';
import { QuickThemeToggle } from '@/components/common/theme-switcher';
import { 
  Trophy,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart
} from 'lucide-react';

export function Footer() {
  const themeClasses = useThemeClasses();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${themeClasses.padding}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          
          {/* CLB Info */}
          <div className={themeClasses.component}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className={`${themeClasses.heading.h4} font-bold`}>
                CLB Bóng Bàn Bình Tân
              </h3>
            </div>
            <p className={`${themeClasses.text.body} text-slate-300 leading-relaxed mb-4`}>
              Câu lạc bộ bóng bàn hàng đầu tại Bình Tân, nơi hội tụ những người đam mê môn thể thao trí tuệ này.
            </p>
            <div className="flex items-center text-slate-400">
              <Heart className="h-4 w-4 mr-2 text-red-400" />
              <span className={themeClasses.text.caption}>
                Đam mê - Tiến bộ - Thành công
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className={themeClasses.component}>
            <h3 className={`${themeClasses.heading.h4} font-bold mb-4`}>
              Thông tin liên hệ
            </h3>
            <div className={`space-y-3 ${themeClasses.text.body}`}>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-300">Địa chỉ:</div>
                  <div className="text-slate-400">Quận Bình Tân, TP.HCM</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-slate-300">Điện thoại:</div>
                  <div className="text-slate-400">0333 141 692</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-slate-300">Email:</div>
                  <div className="text-slate-400">clb@bongbanbinhtan.vn</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-300">Giờ hoạt động:</div>
                  <div className="text-slate-400">
                    <div>Thứ 2-6: 18:00 - 22:00</div>
                    <div>Thứ 7-CN: 08:00 - 22:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={themeClasses.component}>
            <h3 className={`${themeClasses.heading.h4} font-bold mb-4`}>
              Liên kết nhanh
            </h3>
            <div className={`space-y-2 ${themeClasses.text.body}`}>
              <a 
                href="/viewer" 
                className="block text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                Xem công khai
              </a>
              <a 
                href="/login" 
                className="block text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                Đăng nhập hội viên
              </a>
              <a 
                href="/viewer#tournaments" 
                className="block text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                Giải đấu hiện tại
              </a>
              <a 
                href="/viewer#rankings" 
                className="block text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                Bảng xếp hạng
              </a>
            </div>

            {/* Theme Toggle */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className={`${themeClasses.text.caption} text-slate-400`}>
                  Giao diện
                </span>
                <QuickThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className={`${themeClasses.text.caption} text-slate-400 mb-2 sm:mb-0`}>
              © 2024 CLB Bóng Bàn Bình Tân. Tất cả quyền được bảo lưu.
            </div>
            <div className={`${themeClasses.text.caption} text-slate-500`}>
              Được phát triển với ❤️ bởi Ping Pong League Manager
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
