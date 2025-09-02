import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  DollarSign,
  UserPlus,
  Settings,
  Plus,
  Eye
} from 'lucide-react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { ActionButton } from '@/components/common/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  return (
    <AdminLayout 
      title="Bảng điều khiển quản trị" 
      subtitle="Tổng quan hệ thống quản lý giải bóng bàn"
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng giải đấu</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> tháng này
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+47</span> tuần này
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trận đấu hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                12 hoàn thành, 6 đang chơi
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionButton 
                size="lg" 
                className="h-20 flex-col"
                icon={<Plus />}
              >
                Tạo giải đấu
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-20 flex-col"
                icon={<UserPlus />}
              >
                Thêm người dùng
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-20 flex-col"
                icon={<MapPin />}
              >
                Quản lý sân
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-20 flex-col"
                icon={<Calendar />}
              >
                Lập lịch
              </ActionButton>
            </div>
          </CardContent>
        </Card>

        {/* Active Tournaments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Giải đấu đang diễn ra</CardTitle>
              <ActionButton variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Xem tất cả
              </ActionButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Giải Bóng Bàn Mùa Xuân 2024",
                  participants: 187,
                  maxParticipants: 200,
                  status: "ongoing",
                  startDate: "15/03/2024",
                  venue: "Nhà thi đấu Quận 1"
                },
                {
                  name: "Giải Vô Địch Sinh Viên",
                  participants: 156,
                  maxParticipants: 160,
                  status: "registration",
                  startDate: "22/03/2024",
                  venue: "Trung tâm Thể thao ĐH Quốc Gia"
                },
                {
                  name: "Giải Giao Hữu Câu Lạc Bộ",
                  participants: 94,
                  maxParticipants: 120,
                  status: "upcoming",
                  startDate: "01/04/2024",
                  venue: "Sân vận động Thống Nhất"
                }
              ].map((tournament, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{tournament.name}</h4>
                      <Badge 
                        variant={
                          tournament.status === 'ongoing' ? 'primary' : 
                          tournament.status === 'registration' ? 'secondary' : 'outline'
                        }
                      >
                        {tournament.status === 'ongoing' ? 'Đang diễn ra' :
                         tournament.status === 'registration' ? 'Đang đăng ký' : 'Sắp diễn ra'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {tournament.participants}/{tournament.maxParticipants} người
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {tournament.startDate}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {tournament.venue}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <ActionButton variant="outline" size="sm">
                      Quản lý
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Thống kê hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Người dùng hoạt động hôm nay</span>
                  <span className="font-semibold">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trận đấu đã hoàn thành tuần này</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đăng ký mới tháng này</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tỷ lệ tham gia giải đấu</span>
                  <span className="font-semibold">73%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Cảnh báo hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Sân số 3 cần bảo trì</p>
                    <p className="text-xs text-yellow-600">Thiết bị âm thanh gặp sự cố</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Lịch thi đấu ngày mai đã đầy</p>
                    <p className="text-xs text-blue-600">Cân nhắc mở thêm sân</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Hệ thống hoạt động bình thường</p>
                    <p className="text-xs text-green-600">Tất cả dịch vụ đang online</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
