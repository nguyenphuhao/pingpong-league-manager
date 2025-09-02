'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useTheme, useThemeClasses } from '@/contexts/theme-context';
import { AgeGroup, ColorMode } from '@/types/theme';
import { 
  Sun, 
  Moon, 
  Settings, 
  Users, 
  Eye,
  Palette,
  Check
} from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setAgeGroup, toggleColorMode } = useTheme();
  const themeClasses = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);

  const ageGroups: { value: AgeGroup; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'over40',
      label: 'Giao diện 40+',
      description: 'Chữ to hơn, khoảng cách rộng hơn, dễ đọc hơn',
      icon: <Users className="h-5 w-5" />
    },
    {
      value: 'under40',
      label: 'Giao diện Trẻ',
      description: 'Thiết kế hiện đại, gọn gàng, năng động',
      icon: <Eye className="h-5 w-5" />
    }
  ];

  const colorModes: { value: ColorMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Sáng',
      icon: <Sun className="h-4 w-4" />
    },
    {
      value: 'dark', 
      label: 'Tối',
      icon: <Moon className="h-4 w-4" />
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${themeClasses.button.base} gap-2`}
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Giao diện</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className={`${themeClasses.padding} max-w-md`}>
        <DialogHeader className={themeClasses.component}>
          <DialogTitle className={themeClasses.heading.h3}>
            <Settings className="h-5 w-5 mr-2 inline" />
            Cài đặt giao diện
          </DialogTitle>
          <DialogDescription className={themeClasses.text.body}>
            Tùy chỉnh giao diện phù hợp với độ tuổi và sở thích của bạn
          </DialogDescription>
        </DialogHeader>

        <div className={themeClasses.section}>
          {/* Age Group Selection */}
          <div className={themeClasses.component}>
            <h4 className={`${themeClasses.heading.h4} mb-3`}>
              Nhóm tuổi
            </h4>
            <div className="grid gap-3">
              {ageGroups.map((group) => (
                <Card 
                  key={group.value}
                  className={`cursor-pointer transition-all border-2 ${
                    theme.ageGroup === group.value 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setAgeGroup(group.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {group.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`${themeClasses.text.body} font-medium`}>
                              {group.label}
                            </span>
                            {theme.ageGroup === group.value && (
                              <Badge variant="primary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Đang dùng
                              </Badge>
                            )}
                          </div>
                          <p className={`${themeClasses.text.caption} text-muted-foreground mt-1`}>
                            {group.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Color Mode Toggle */}
          <div className={themeClasses.component}>
            <h4 className={`${themeClasses.heading.h4} mb-3`}>
              Chế độ màu
            </h4>
            <div className="flex gap-2">
              {colorModes.map((mode) => (
                <Button
                  key={mode.value}
                  variant={theme.colorMode === mode.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColorMode()}
                  className={`${themeClasses.button.base} flex-1 gap-2`}
                >
                  {mode.icon}
                  {mode.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className={themeClasses.component}>
            <h4 className={`${themeClasses.heading.h4} mb-3`}>
              Xem trước
            </h4>
            <Card>
              <CardHeader className={themeClasses.padding}>
                <CardTitle className={themeClasses.heading.h4}>
                  Ví dụ giao diện
                </CardTitle>
                <CardDescription className={themeClasses.text.body}>
                  Đây là cách giao diện sẽ hiển thị với cài đặt hiện tại
                </CardDescription>
              </CardHeader>
              <CardContent className={themeClasses.padding}>
                <div className={themeClasses.component}>
                  <p className={themeClasses.text.body}>
                    Văn bản thông thường với kích thước {theme.ageGroup === 'over40' ? 'lớn' : 'nhỏ gọn'}
                  </p>
                  <Button 
                    size="sm" 
                    className={themeClasses.button.base}
                  >
                    Nút bấm mẫu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => setIsOpen(false)}
              className={themeClasses.button.base}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick toggle button for header/nav
export function QuickThemeToggle() {
  const { theme, toggleColorMode } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleColorMode}
      className="h-9 w-9 p-0"
      title={`Chuyển sang chế độ ${theme.colorMode === 'light' ? 'tối' : 'sáng'}`}
    >
      {theme.colorMode === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
