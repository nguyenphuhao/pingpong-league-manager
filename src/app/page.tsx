import { Trophy, Users, Calendar, MapPin, Smartphone } from 'lucide-react';
import { PageLayout } from '@/components/common/page-layout';
import { ActionButton } from '@/components/common/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <PageLayout 
      title="Trang chủ" 
      subtitle="Chào mừng đến với hệ thống quản lý giải bóng bàn"
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">Giải đấu hoạt động</CardTitle>
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">3</div>
              <p className="text-xs text-slate-500 mt-1">
                +1 từ tháng trước
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">Người chơi</CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">127</div>
              <p className="text-xs text-slate-500 mt-1">
                +12 thành viên mới
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">Trận đấu hôm nay</CardTitle>
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">8</div>
              <p className="text-xs text-slate-500 mt-1">
                4 đã hoàn thành
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">Sân đang sử dụng</CardTitle>
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">6/8</div>
              <p className="text-xs text-slate-500 mt-1">
                2 sân trống
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Tournament */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">Giải Bóng Bàn Mùa Xuân 2024</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Giải đấu lớn nhất năm với sự tham gia của hơn 200 vận động viên
                </p>
              </div>
              <Badge variant="primary">Đang diễn ra</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <span>15 - 18 Tháng 3, 2024</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>Nhà thi đấu Quận 1</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary" />
                <span>187/200 người đăng ký</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <ActionButton 
                size="lg" 
                className="flex-1"
                icon={<Trophy />}
              >
                Xem chi tiết giải đấu
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg"
                className="flex-1"
              >
                Đăng ký tham gia
              </ActionButton>
            </div>
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Trận đấu gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { player1: "Nguyễn Văn A", player2: "Trần Văn B", score: "3-1", status: "completed" },
                { player1: "Lê Thị C", player2: "Phạm Văn D", score: "2-1", status: "ongoing" },
                { player1: "Hoàng Văn E", player2: "Đỗ Thị F", score: "0-0", status: "scheduled" },
              ].map((match, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">
                      {match.player1} vs {match.player2}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sân {index + 1} • 14:30
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{match.score}</span>
                    <Badge 
                      variant={
                        match.status === 'completed' ? 'primary' : 
                        match.status === 'ongoing' ? 'secondary' : 'outline'
                      }
                    >
                      {match.status === 'completed' ? 'Hoàn thành' :
                       match.status === 'ongoing' ? 'Đang đấu' : 'Sắp diễn ra'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Dashboards */}
        <Card>
          <CardHeader>
            <CardTitle>Truy cập hệ thống</CardTitle>
            <p className="text-muted-foreground">
              Đăng nhập bằng số điện thoại để truy cập các tính năng
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <a href="/login" className="block w-full">
                <ActionButton 
                  size="lg" 
                  className="h-24 sm:h-28 w-full flex-col"
                  icon={<Smartphone />}
                >
                  <span className="font-semibold text-sm sm:text-base">Đăng nhập</span>
                  <span className="text-xs opacity-90 mt-1">Sử dụng số điện thoại</span>
                </ActionButton>
              </a>
              <a href="/viewer" className="block w-full">
                <ActionButton 
                  variant="outline" 
                  size="lg" 
                  className="h-24 sm:h-28 w-full flex-col"
                  icon={<Trophy />}
                >
                  <span className="font-semibold text-sm sm:text-base">Xem công khai</span>
                  <span className="text-xs opacity-70 mt-1">Không cần đăng nhập</span>
                </ActionButton>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <ActionButton 
            size="lg" 
            className="h-14 sm:h-16"
            icon={<Trophy />}
          >
            Tạo giải đấu mới
          </ActionButton>
          <ActionButton 
            variant="outline" 
            size="lg" 
            className="h-14 sm:h-16"
            icon={<Users />}
          >
            Quản lý thành viên
          </ActionButton>
        </div>
    </div>
    </PageLayout>
  );
}