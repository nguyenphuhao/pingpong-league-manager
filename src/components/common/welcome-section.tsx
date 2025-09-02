'use client';

import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/common/action-button';
import { useThemeClasses } from '@/contexts/theme-context';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Target,
  UserCheck,
  Eye,
  Sparkles,
  Award
} from 'lucide-react';

export function WelcomeSection() {
  const router = useRouter();
  const themeClasses = useThemeClasses();

  const handleMemberLogin = () => {
    router.push('/login');
  };

  const handlePublicView = () => {
    router.push('/viewer');
  };

  const features = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Giải đấu chuyên nghiệp",
      description: "Tổ chức các giải đấu bóng bàn định kỳ với hệ thống quản lý hiện đại"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Cộng đồng hội viên",
      description: "Kết nối với các thành viên CLB, chia sẻ kinh nghiệm và kỹ năng"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Lịch thi đấu linh hoạt",
      description: "Xem lịch thi đấu, đăng ký tham gia và theo dõi kết quả real-time"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Thành tích cá nhân",
      description: "Theo dõi điểm số, xếp hạng và thành tích thi đấu của bạn"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative">
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${themeClasses.padding}`}>
            <div className={`text-center ${themeClasses.section}`}>
              {/* Logo & Title */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              </div>

              {/* Main Heading */}
              <h1 className={`${themeClasses.heading.h1} bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent font-bold mb-6`}>
                Chào mừng đến với
              </h1>
              
              <h2 className={`${themeClasses.heading.h2} text-slate-900 dark:text-white font-bold mb-4`}>
                CLB Bóng Bàn Bình Tân
              </h2>

              <p className={`${themeClasses.text.large} text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed`}>
                Hệ thống quản lý nội bộ hiện đại dành cho các thành viên và người quan tâm đến CLB Bóng Bàn Bình Tân. 
                Tham gia cộng đồng, theo dõi giải đấu và nâng cao kỹ năng bóng bàn của bạn.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${themeClasses.component} max-w-md mx-auto`}>
                <ActionButton
                  onClick={handleMemberLogin}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  icon={<UserCheck />}
                >
                  Đăng nhập Hội viên
                </ActionButton>
                
                <ActionButton
                  onClick={handlePublicView}
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transform hover:scale-105 transition-all duration-200"
                  icon={<Eye />}
                >
                  Xem công khai
                </ActionButton>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className={`${themeClasses.heading.h3} text-blue-600 dark:text-blue-400 font-bold`}>150+</div>
                  <div className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>Hội viên</div>
                </div>
                <div className="text-center">
                  <div className={`${themeClasses.heading.h3} text-green-600 dark:text-green-400 font-bold`}>24</div>
                  <div className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>Giải đấu</div>
                </div>
                <div className="text-center">
                  <div className={`${themeClasses.heading.h3} text-purple-600 dark:text-purple-400 font-bold`}>500+</div>
                  <div className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>Trận đấu</div>
                </div>
                <div className="text-center">
                  <div className={`${themeClasses.heading.h3} text-orange-600 dark:text-orange-400 font-bold`}>3</div>
                  <div className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>Năm hoạt động</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${themeClasses.padding}`}>
          <div className="text-center mb-12">
            <h3 className={`${themeClasses.heading.h3} text-slate-900 dark:text-white font-bold mb-4`}>
              Tính năng nổi bật
            </h3>
            <p className={`${themeClasses.text.body} text-slate-600 dark:text-slate-300 max-w-2xl mx-auto`}>
              Khám phá những tính năng hiện đại giúp quản lý và tham gia hoạt động CLB một cách hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className={`${themeClasses.heading.h4} text-slate-900 dark:text-white font-semibold mb-2`}>
                  {feature.title}
                </h4>
                <p className={`${themeClasses.text.body} text-slate-600 dark:text-slate-300 leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
        <div className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center ${themeClasses.padding}`}>
          <Target className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
          <h3 className={`${themeClasses.heading.h3} text-white font-bold mb-4`}>
            Sẵn sàng tham gia?
          </h3>
          <p className={`${themeClasses.text.large} text-blue-100 mb-8 max-w-2xl mx-auto`}>
            Gia nhập cộng đồng bóng bàn sôi động và trải nghiệm những trận đấu đầy kịch tính
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <ActionButton
              onClick={handleMemberLogin}
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              icon={<UserCheck />}
            >
              Đăng nhập ngay
            </ActionButton>
            <ActionButton
              onClick={handlePublicView}
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
              icon={<Eye />}
            >
              Tìm hiểu thêm
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
