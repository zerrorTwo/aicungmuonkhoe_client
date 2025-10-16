import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
    Settings,
    Calendar,
    Heart,
    History,
    ChevronRight,
    ChevronDown,
    Plus,
    Users,
    Link
} from 'lucide-react';
import SelfManagedAccountModal from '../modals/SelfManagedAccountModal';
import LinkedAccountModal from '../modals/LinkedAccountModal';
import ConfirmModal from '../modals/ConfirmModal';

const ManagementAccountTab: React.FC = () => {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [showSelfManagedModal, setShowSelfManagedModal] = useState(false);
    const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const menuItems = [
        {
            id: 'health-records',
            title: 'Hồ sơ sức khỏe',
            icon: <Settings className="w-5 h-5 text-gray-600" />,
            hasArrow: true
        },
        {
            id: 'health-tracking',
            title: 'Theo dõi sức khỏe',
            icon: <Calendar className="w-5 h-5 text-gray-600" />,
            hasArrow: true
        },
        {
            id: 'health-consultation',
            title: 'Tư vấn sức khỏe',
            icon: <Heart className="w-5 h-5 text-gray-600" />,
            hasArrow: true
        },
        {
            id: 'update-history',
            title: 'Lịch sử cập nhật thông tin',
            icon: <History className="w-5 h-5 text-gray-600" />,
            hasArrow: true
        }
    ];

    // Tài khoản tự quản lý
    const selfManagedAccounts = [
        {
            id: 'thaophuongcute',
            name: 'ThaPhuongCute',
            subtitle: 'Tài khoản của tôi',
            avatar: '/health-logo.jpg',
            menuItems: menuItems
        },
        {
            id: 'keria',
            name: 'Keria',
            subtitle: 'Tài khoản gia đình',
            avatar: '/placeholder-avatar.jpg',
            menuItems: menuItems
        }
    ];



    const toggleCard = (accountId: string) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(accountId)) {
            newExpanded.delete(accountId);
        } else {
            newExpanded.add(accountId);
        }
        setExpandedCards(newExpanded);
    };

    const AccountCard = ({ account }: { account: any }) => {
        const isExpanded = expandedCards.has(account.id);

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-3">
                {/* Account Header - Clickable */}
                <div
                    className="bg-gradient-to-r from-green-50 to-blue-50 p-3 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 transition-colors"
                    onClick={() => toggleCard(account.id)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={account.avatar} alt={account.name} />
                                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-sm font-semibold">
                                    {account.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{account.name}</h3>
                                <p className="text-xs text-gray-600">{account.subtitle}</p>
                            </div>
                        </div>
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>

                {/* Menu Items - Collapsible */}
                {isExpanded && (
                    <div className="p-2">
                        {account.menuItems?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="p-1.5 bg-gray-100 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                </div>
                                {item.hasArrow && (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="shadow-weather">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Thông tin sức khỏe
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="self-managed" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="self-managed" className="cursor-pointer flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Thông tin sức khỏe bản thân quản lý
                        </TabsTrigger>
                        <TabsTrigger value="linked-accounts" className="cursor-pointer flex items-center gap-2">
                            <Link className="w-4 h-4" />
                            Thông tin sức khỏe của tài khoản đã liên kết
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="self-managed" className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">
                                Thông tin sức khỏe bản thân quản lý
                            </h3>

                            {selfManagedAccounts.map((account) => (
                                <AccountCard key={account.id} account={account} />
                            ))}

                            {/* Add Account Button */}
                            <Button
                                variant="outline"
                                className="cursor-pointer w-full mt-4 border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => setShowSelfManagedModal(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm tài khoản tự quản lý
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="linked-accounts" className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                Thông tin sức khỏe của tài khoản đã liên kết
                            </h3>
                            <div className="flex items-center text-sm text-blue-700 mb-4">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Tài khoản có quyền xem và cập nhật thông tin sức khỏe cho bạn.{' '}
                                <Button variant="link" className="p-0 h-auto text-blue-600 underline ml-1">
                                    Chi tiết quyền tại đây
                                </Button>
                            </div>

                            {/* Add Linked Account Button */}
                            <Button
                                variant="outline"
                                className="cursor-pointer w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() => setShowLinkedAccountModal(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm tài khoản bạn muốn liên kết
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            {/* Modals */}
            <SelfManagedAccountModal
                isOpen={showSelfManagedModal}
                onClose={() => setShowSelfManagedModal(false)}
                onSubmit={(formData) => {
                    setShowSelfManagedModal(false);
                    setShowConfirmModal(true);
                    console.log('Self managed account data:', formData);
                }}
            />

            <LinkedAccountModal
                isOpen={showLinkedAccountModal}
                onClose={() => setShowLinkedAccountModal(false)}
                onSubmit={(email) => {
                    setShowLinkedAccountModal(false);
                    setShowConfirmModal(true);
                    console.log('Linked account email:', email);
                }}
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    console.log('Account creation confirmed');
                    alert('Tài khoản đã được thêm thành công!');
                }}
            />
        </Card>
    );
};

export default ManagementAccountTab;