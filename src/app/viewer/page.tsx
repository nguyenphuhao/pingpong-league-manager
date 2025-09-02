'use client';

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
  Activity,
  Crown,
  Zap,
  Target,
  Timer
} from 'lucide-react';
import { ViewerLayout } from '@/components/layouts/viewer-layout';
import { ActionButton } from '@/components/common/action-button';
import { Badge } from '@/components/ui/badge';
import { useThemeClasses } from '@/contexts/theme-context';

export default function ViewerDashboard() {
  const themeClasses = useThemeClasses();

  const liveStats = [
    {
      title: "Giải đang diễn ra",
      value: "3",
      subtitle: "24 giải tổng cộng",
      icon: <Trophy className="h-5 w-5" />,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Trận LIVE",
      value: "6",
      subtitle: "Trên 8 sân",
      icon: <Zap className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Vận động viên",
      value: "247",
      subtitle: "Đang thi đấu",
      icon: <Users className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Khán giả",
      value: "1.4K",
      subtitle: "+89 mới",
      icon: <Eye className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <ViewerLayout 
      title="CLB Bóng Bàn Bình Tân" 
      subtitle="Theo dõi trực tiếp các giải đấu và kết quả thi đấu"
      showThemeSwitch={true}
    >
      <div className={`${themeClasses.component} space-y-6`}>
        {/* Live Stats - Compact & Beautiful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {liveStats.map((stat, index) => (
            <div key={index} className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ${stat.bgColor} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                {index === 1 && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                    <span className={`${themeClasses.text.caption} text-red-600 dark:text-red-400`}>LIVE</span>
                  </div>
                )}
              </div>
              <div className={`${themeClasses.heading.h3} font-bold text-slate-900 dark:text-white mb-1`}>
                {stat.value}
              </div>
              <p className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Live Matches - Compact & Engaging */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`${themeClasses.padding} bg-gradient-to-r from-red-500 to-pink-500 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`${themeClasses.heading.h4} font-bold`}>Trận đấu LIVE</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className={themeClasses.text.caption}>Cập nhật trực tiếp</span>
                  </div>
                </div>
              </div>
              <ActionButton 
                variant="outline" 
                size="sm"
                className="border-white/50 text-white hover:bg-white/20 hover:border-white/70 bg-white/10"
                icon={<Eye />}
              >
                Xem tất cả
              </ActionButton>
            </div>
          </div>
          
          <div className={`${themeClasses.padding} grid grid-cols-1 lg:grid-cols-2 gap-4`}>
            {[
              {
                player1: "Nguyễn Văn A",
                player2: "Trần Văn B", 
                tournament: "Giải Mùa Xuân 2024",
                court: "Sân 1",
                score: "2-1",
                sets: ["11-8", "9-11", "11-6"],
                currentSet: "Set 4",
                viewers: 156,
                isHot: true
              },
              {
                player1: "Lê Thị C",
                player2: "Phạm Thị D",
                tournament: "Giải Sinh Viên",
                court: "Sân 3", 
                score: "1-1",
                sets: ["11-9", "8-11"],
                currentSet: "Set 3",
                viewers: 89,
                isHot: false
              }
            ].map((match, index) => (
              <div key={index} className="relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                {match.isHot && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="animate-pulse text-xs px-2 py-1">LIVE</Badge>
                    <span className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>{match.court}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Eye className="w-3 h-3" />
                    <span className={themeClasses.text.caption}>{match.viewers}</span>
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <h4 className={`${themeClasses.heading.h4} font-semibold text-slate-900 dark:text-white`}>
                    {match.player1} <span className="text-slate-400 mx-1">vs</span> {match.player2}
                  </h4>
                  <p className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400 mt-1`}>{match.tournament}</p>
                </div>
                
                <div className="text-center mb-4">
                  <div className={`${themeClasses.heading.h2} font-bold text-slate-900 dark:text-white mb-2`}>{match.score}</div>
                  <div className="flex justify-center gap-2 mb-2">
                    {match.sets.map((set, i) => (
                      <span key={i} className={`${themeClasses.text.caption} bg-white dark:bg-slate-800 px-2 py-1 rounded border`}>{set}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Timer className="w-3 h-3 text-blue-500" />
                    <span className={`${themeClasses.text.caption} text-blue-600 dark:text-blue-400`}>{match.currentSet}</span>
                  </div>
                </div>
                
                <ActionButton 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-blue-500 hover:border-blue-600"
                  icon={<Play />}
                >
                  Xem trực tiếp
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Highlights - Compact Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`${themeClasses.padding} bg-gradient-to-r from-amber-500 to-orange-500 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`${themeClasses.heading.h4} font-bold`}>Giải đấu nổi bật</h3>
                <span className={themeClasses.text.caption}>3 giải đang diễn ra</span>
              </div>
            </div>
          </div>
          
          <div className={`${themeClasses.padding} grid grid-cols-1 lg:grid-cols-3 gap-4`}>
            {[
              {
                name: "Giải Mùa Xuân 2024",
                status: "Đang diễn ra",
                progress: "Bán kết", 
                participants: 187,
                matches: "38/45",
                prize: "50tr",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50 dark:bg-blue-900/20"
              },
              {
                name: "Giải Sinh Viên",
                status: "Vòng bảng",
                progress: "Ngày 2/4",
                participants: 156,
                matches: "18/32",
                prize: "30tr",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50 dark:bg-green-900/20"
              },
              {
                name: "Giải Doanh Nghiệp",
                status: "Chung kết",
                progress: "Sắp kết thúc",
                participants: 94,
                matches: "26/28",
                prize: "20tr",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50 dark:bg-purple-900/20"
              }
            ].map((tournament, index) => (
              <div key={index} className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ${tournament.bgColor} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                <div className="mb-3">
                  <h4 className={`${themeClasses.heading.h4} font-semibold text-slate-900 dark:text-white mb-2`}>{tournament.name}</h4>
                  <div className="flex items-center justify-between">
                    <Badge variant={index === 0 ? "primary" : index === 1 ? "secondary" : "outline"} className="text-xs px-2 py-1">
                      {tournament.status}
                    </Badge>
                    <span className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-400`}>{tournament.progress}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <div className={`${themeClasses.text.body} font-bold text-slate-900 dark:text-white`}>{tournament.participants}</div>
                    <div className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>VĐV</div>
                  </div>
                  <div>
                    <div className={`${themeClasses.text.body} font-bold text-slate-900 dark:text-white`}>{tournament.matches}</div>
                    <div className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>Trận</div>
                  </div>
                  <div>
                    <div className={`${themeClasses.text.body} font-bold text-green-600 dark:text-green-400`}>{tournament.prize}</div>
                    <div className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>Thưởng</div>
                  </div>
                </div>
                
                <ActionButton 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Xem chi tiết
                </ActionButton>
              </div>
            ))}
          </div>
        </div>

                {/* Top Players & Recent Results - Side by side compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Players */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className={`${themeClasses.padding} bg-gradient-to-r from-violet-500 to-purple-500 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`${themeClasses.heading.h4} font-bold`}>Top 5 VĐV</h3>
                  <span className={themeClasses.text.caption}>Xếp hạng tuần này</span>
                </div>
              </div>
            </div>
            
            <div className={`${themeClasses.padding} space-y-3`}>
              {[
                { rank: 1, name: "Nguyễn Văn Nam", rating: 1847, change: "+24", grade: "A" },
                { rank: 2, name: "Trần Thị Hương", rating: 1792, change: "+12", grade: "A" },
                { rank: 3, name: "Lê Văn Minh", rating: 1734, change: "-5", grade: "A" }
              ].map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                      index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white' :
                      'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                    }`}>
                      {index === 0 ? <Crown className="h-4 w-4" /> : player.rank}
                    </div>
                    <div>
                      <p className={`${themeClasses.text.body} font-medium text-slate-900 dark:text-white`}>{player.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">{player.grade}</Badge>
                        <span className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>{player.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`${themeClasses.text.body} font-medium ${
                    player.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {player.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className={`${themeClasses.padding} bg-gradient-to-r from-emerald-500 to-teal-500 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`${themeClasses.heading.h4} font-bold`}>Kết quả mới</h3>
                  <span className={themeClasses.text.caption}>Cập nhật liên tục</span>
                </div>
              </div>
            </div>
            
            <div className={`${themeClasses.padding} space-y-3`}>
              {[
                { player1: "Nguyễn Văn A", player2: "Trần Văn B", score: "3-1", tournament: "Mùa Xuân", time: "2h" },
                { player1: "Lê Thị C", player2: "Phạm Thị D", score: "3-2", tournament: "Sinh Viên", time: "3h" },
                { player1: "Hoàng Văn E", player2: "Đỗ Văn F", score: "3-0", tournament: "Giao Hữu", time: "5h" }
              ].map((result, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${themeClasses.text.body} font-medium text-slate-900 dark:text-white`}>
                      {result.player1} vs {result.player2}
                    </span>
                    <span className={`${themeClasses.text.body} font-bold text-slate-900 dark:text-white`}>{result.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>{result.tournament}</span>
                    <span className={`${themeClasses.text.caption} text-slate-500 dark:text-slate-400`}>{result.time} trước</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation - Compact Action Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`${themeClasses.padding} bg-gradient-to-r from-slate-600 to-slate-700 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`${themeClasses.heading.h4} font-bold`}>Khám phá thêm</h3>
                <span className={themeClasses.text.caption}>Tất cả tính năng CLB</span>
              </div>
            </div>
          </div>
          
          <div className={`${themeClasses.padding} grid grid-cols-2 lg:grid-cols-4 gap-3`}>
            {[
              {
                title: "Tất cả giải đấu",
                subtitle: "24 giải",
                icon: <Trophy className="h-6 w-6" />,
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
              },
              {
                title: "Bảng xếp hạng",
                subtitle: "Top 100",
                icon: <BarChart3 className="h-6 w-6" />,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50 dark:bg-blue-900/20"
              },
              {
                title: "Lịch thi đấu",
                subtitle: "Tuần này",
                icon: <Calendar className="h-6 w-6" />,
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50 dark:bg-green-900/20"
              },
              {
                title: "Thống kê",
                subtitle: "Chi tiết",
                icon: <TrendingUp className="h-6 w-6" />,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50 dark:bg-purple-900/20"
              }
            ].map((item, index) => (
              <div key={index} className={`${item.bgColor} rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer`}>
                <div className="flex flex-col items-center justify-center h-full p-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-2 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <div className={`${themeClasses.text.body} font-semibold text-slate-900 dark:text-white leading-tight mb-1`}>
                      {item.title}
                    </div>
                    <div className={`${themeClasses.text.caption} text-slate-600 dark:text-slate-300`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewerLayout>
  );
}
