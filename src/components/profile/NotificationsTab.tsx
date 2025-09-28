import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationsTab: React.FC = () => {
    return (
        <Card className="shadow-weather">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Cài đặt thông báo
                </CardTitle>
                <CardDescription>Tùy chỉnh thông báo bạn muốn nhận</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Tính năng sẽ được cập nhật sớm...</p>
            </CardContent>
        </Card>
    );
};

export default NotificationsTab;