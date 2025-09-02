import { 
  Trophy, 
  Calendar, 
  Award, 
  Target, 
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Zap,
  CheckCircle,
  Play
} from 'lucide-react';
import { UserLayout } from '@/components/layouts/user-layout';
import { ActionButton } from '@/components/common/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserDashboard() {
  return (
    <UserLayout 
      title="Trang chủ người chơi" 
      subtitle="Chào mừng trở lại! Hãy xem lịch thi đấu và thành tích của bạn."
    >
      <div className="space-y-8">
        {/* Player Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Xếp hạng</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#42</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> vị trí
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm rating</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+45</span> điểm
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trận thắng</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                73% tỷ lệ thắng
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cấp độ</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B</div>
              <p className="text-xs text-muted-foreground">
                Trung cấp
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Trận đấu sắp tới
              </CardTitle>
              <ActionButton variant="outline" size="sm">
                Xem lịch
              </ActionButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  opponent: "Trần Văn Minh",
                  tournament: "Giải Mùa Xuân 2024",
                  time: "14:30 - Hôm nay",
                  court: "Sân 2",
                  status: "Sắp diễn ra",
                  type: "Đơn nam"
                },
                {
                  opponent: "Nguyễn Thị Hoa",
                  tournament: "Giải Giao Hữu",
                  time: "10:00 - Ngày mai",
                  court: "Sân 1",
                  status: "Đã lên lịch",
                  type: "Đơn nữ"
                },
                {
                  opponent: "Lê Văn Đức",
                  tournament: "Giải Vô Địch Câu Lạc Bộ",
                  time: "16:00 - 25/03",
                  court: "Sân 3",
                  status: "Đã lên lịch",
                  type: "Đơn nam"
                }
              ].map((match, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">vs {match.opponent}</h4>
                      <Badge variant={index === 0 ? "primary" : "outline"}>
                        {match.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        {match.tournament}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {match.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {match.court}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {index === 0 ? (
                      <ActionButton 
                        size="sm"
                        icon={<Play />}
                      >
                        Vào sân
                      </ActionButton>
                    ) : (
                      <ActionButton variant="outline" size="sm">
                        Chi tiết
                      </ActionButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tournament Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Giải đấu mở đăng ký
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  name: "Giải Bóng Bàn Hè 2024",
                  description: "Giải đấu dành cho các vận động viên cấp B và C",
                  deadline: "30/03/2024",
                  fee: "200,000 VNĐ",
                  participants: "45/80 người",
                  category: "Đơn & Đôi"
                },
                {
                  name: "Giải Giao Hữu Doanh Nghiệp",
                  description: "Giải đấu giao hữu giữa các công ty và doanh nghiệp",
                  deadline: "15/04/2024",
                  fee: "150,000 VNĐ",
                  participants: "12/40 người",
                  category: "Đội nhóm"
                }
              ].map((tournament, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="mb-3">
                    <h4 className="font-semibold text-foreground mb-1">{tournament.name}</h4>
                    <p className="text-sm text-muted-foreground">{tournament.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hạn đăng ký:</span>
                      <span className="font-medium">{tournament.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lệ phí:</span>
                      <span className="font-medium">{tournament.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Đã đăng ký:</span>
                      <span className="font-medium">{tournament.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loại hình:</span>
                      <Badge variant="outline">{tournament.category}</Badge>
                    </div>
                  </div>
                  
                  <ActionButton className="w-full mt-4">
                    Đăng ký tham gia
                  </ActionButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Thành tích gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Á quân Giải Mùa Đông</p>
                    <p className="text-xs text-yellow-600">Đơn nam cấp B • 15/02/2024</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Đạt mốc 1000 điểm</p>
                    <p className="text-xs text-green-600">Rating cá nhân • 03/03/2024</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Chuỗi 5 trận thắng</p>
                    <p className="text-xs text-blue-600">Thành tích liên tiếp • 10/03/2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Thống kê cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng trận đấu</span>
                  <span className="font-semibold">33</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tỷ lệ thắng</span>
                  <span className="font-semibold">73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Điểm trung bình/set</span>
                  <span className="font-semibold">18.4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Thời gian chơi</span>
                  <span className="font-semibold">24h 15m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đối thủ đã gặp</span>
                  <span className="font-semibold">28 người</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Giải đấu tham gia</span>
                  <span className="font-semibold">7 giải</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionButton 
                size="lg" 
                className="h-16"
                icon={<Trophy />}
              >
                Tìm giải đấu
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-16"
                icon={<Users />}
              >
                Tìm đối thủ
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-16"
                icon={<Calendar />}
              >
                Đặt sân tập
              </ActionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
