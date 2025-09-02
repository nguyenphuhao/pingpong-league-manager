import { 
  Trophy, 
  Calendar, 
  Users, 
  Play,
  CheckCircle,
  Eye,
  BarChart3,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ViewerLayout } from '@/components/layouts/viewer-layout';
import { ActionButton } from '@/components/common/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ViewerDashboard() {
  return (
    <ViewerLayout 
      title="Bảng thông tin công khai" 
      subtitle="Theo dõi trực tiếp các giải đấu bóng bàn và kết quả thi đấu"
      showFullscreen={true}
    >
      <div className="space-y-8">
        {/* Live Tournament Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giải đang diễn ra</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                24 giải tổng cộng
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trận đang chơi</CardTitle>
              <Play className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Trên 8 sân
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vận động viên</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                Đang thi đấu
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khán giả online</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,423</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+89</span> mới
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Matches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-red-500" />
                Trận đấu trực tiếp
                <span className="ml-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </CardTitle>
              <ActionButton 
                variant="outline" 
                size="sm"
                icon={<Eye />}
              >
                Xem tất cả
              </ActionButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  player1: "Nguyễn Văn A",
                  player2: "Trần Văn B", 
                  tournament: "Giải Mùa Xuân 2024",
                  court: "Sân 1",
                  score: "2-1",
                  sets: ["11-8", "9-11", "11-6"],
                  currentSet: "đang chơi set 4",
                  viewers: 156
                },
                {
                  player1: "Lê Thị C",
                  player2: "Phạm Thị D",
                  tournament: "Giải Sinh Viên",
                  court: "Sân 3", 
                  score: "1-1",
                  sets: ["11-9", "8-11"],
                  currentSet: "đang chơi set 3",
                  viewers: 89
                },
                {
                  player1: "Hoàng Văn E",
                  player2: "Đỗ Văn F",
                  tournament: "Giải Giao Hữu",
                  court: "Sân 5",
                  score: "0-2", 
                  sets: ["7-11", "9-11"],
                  currentSet: "đang chơi set 3",
                  viewers: 234
                },
                {
                  player1: "Trương Thị G",
                  player2: "Phan Văn H",
                  tournament: "Giải Vô Địch CLB",
                  court: "Sân 7",
                  score: "1-0",
                  sets: ["11-5"],
                  currentSet: "đang chơi set 2", 
                  viewers: 78
                }
              ].map((match, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="danger" className="animate-pulse">LIVE</Badge>
                      <span className="text-sm text-muted-foreground">{match.court}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="w-4 h-4 mr-1" />
                      {match.viewers}
                    </div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-lg">
                      {match.player1} <span className="text-muted-foreground mx-2">vs</span> {match.player2}
                    </h4>
                    <p className="text-sm text-muted-foreground">{match.tournament}</p>
                  </div>
                  
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold mb-1">{match.score}</div>
                    <div className="text-sm text-muted-foreground space-x-2">
                      {match.sets.map((set, i) => (
                        <span key={i} className="inline-block">{set}</span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">{match.currentSet}</p>
                  </div>
                  
                  <ActionButton 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    icon={<Play />}
                  >
                    Xem trực tiếp
                  </ActionButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tournament Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Giải đấu nổi bật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Giải Bóng Bàn Mùa Xuân 2024",
                  status: "Đang diễn ra",
                  progress: "Vòng bán kết", 
                  participants: 187,
                  matches: 45,
                  completed: 38,
                  prize: "50 triệu VNĐ"
                },
                {
                  name: "Giải Vô Địch Sinh Viên",
                  status: "Vòng bảng",
                  progress: "Ngày 2/4",
                  participants: 156,
                  matches: 32,
                  completed: 18,
                  prize: "30 triệu VNĐ"
                },
                {
                  name: "Giải Giao Hữu Doanh Nghiệp",
                  status: "Sắp kết thúc",
                  progress: "Chung kết",
                  participants: 94,
                  matches: 28,
                  completed: 26,
                  prize: "20 triệu VNĐ"
                }
              ].map((tournament, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="mb-3">
                    <h4 className="font-semibold text-foreground mb-1">{tournament.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge variant={index === 0 ? "primary" : index === 1 ? "secondary" : "outline"}>
                        {tournament.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{tournament.progress}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vận động viên:</span>
                      <span className="font-medium">{tournament.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trận đấu:</span>
                      <span className="font-medium">{tournament.completed}/{tournament.matches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giải thưởng:</span>
                      <span className="font-medium text-green-600">{tournament.prize}</span>
                    </div>
                  </div>
                  
                  <ActionButton variant="outline" size="sm" className="w-full mt-3">
                    Xem chi tiết
                  </ActionButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Players & Recent Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Top vận động viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Nguyễn Văn Nam", rating: 1847, change: "+24", grade: "A" },
                  { rank: 2, name: "Trần Thị Hương", rating: 1792, change: "+12", grade: "A" },
                  { rank: 3, name: "Lê Văn Minh", rating: 1734, change: "-5", grade: "A" },
                  { rank: 4, name: "Phạm Thị Lan", rating: 1689, change: "+8", grade: "B" },
                  { rank: 5, name: "Hoàng Văn Đức", rating: 1654, change: "+15", grade: "B" }
                ].map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{player.grade}</Badge>
                          <span className="text-xs text-muted-foreground">{player.rating} điểm</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      player.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {player.change}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Kết quả gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    player1: "Nguyễn Văn A",
                    player2: "Trần Văn B",
                    score: "3-1",
                    tournament: "Giải Mùa Xuân",
                    time: "2 giờ trước"
                },
                {
                    player1: "Lê Thị C", 
                    player2: "Phạm Thị D",
                    score: "3-2",
                    tournament: "Giải Sinh Viên",
                    time: "3 giờ trước"
                },
                {
                    player1: "Hoàng Văn E",
                    player2: "Đỗ Văn F", 
                    score: "3-0",
                    tournament: "Giải Giao Hữu",
                    time: "5 giờ trước"
                },
                {
                    player1: "Trương Thị G",
                    player2: "Phan Văn H",
                    score: "2-3", 
                    tournament: "Giải CLB",
                    time: "6 giờ trước"
                }
                ].map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {result.player1} vs {result.player2}
                      </span>
                      <span className="font-bold text-sm">{result.score}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{result.tournament}</span>
                      <span>{result.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Khám phá thêm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <ActionButton 
                size="lg" 
                className="h-16 flex-col"
                icon={<Trophy />}
              >
                Tất cả giải đấu
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-16 flex-col"
                icon={<BarChart3 />}
              >
                Bảng xếp hạng
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-16 flex-col"
                icon={<Calendar />}
              >
                Lịch thi đấu
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                className="h-16 flex-col"
                icon={<TrendingUp />}
              >
                Thống kê
              </ActionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </ViewerLayout>
  );
}
