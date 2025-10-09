import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { isTokenExpired, isTokenExpiringSoon, getTokenExpiryTime, formatExpiryTime } from '../../utils/jwt';

// Component to display token status and provide refresh functionality
export const TokenStatus: React.FC = () => {
    const { handleRefreshToken, isRefreshing, isAuthenticated, logout } = useAuth();

    const token = localStorage.getItem('access_token');

    if (!isAuthenticated()) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Not authenticated</p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">No token found</p>
            </div>
        );
    }

    const expired = isTokenExpired(token);
    const expiringSoon = isTokenExpiringSoon(token);
    const expiryTime = getTokenExpiryTime(token);

    return (
        <div className="p-4 space-y-4">
            <div className={`p-3 rounded-lg border ${expired
                    ? 'bg-red-50 border-red-200'
                    : expiringSoon
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                }`}>
                <h3 className="font-medium mb-2">Token Status</h3>
                <p className={`text-sm ${expired ? 'text-red-800' : expiringSoon ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                    {expired
                        ? 'Token has expired'
                        : expiringSoon
                            ? `Token expires in ${formatExpiryTime(expiryTime)}`
                            : `Token valid for ${formatExpiryTime(expiryTime)}`
                    }
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleRefreshToken}
                    disabled={isRefreshing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
                </button>

                <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    Logout
                </button>
            </div>

            <div className="text-xs text-gray-500 font-mono break-all">
                <p className="mb-1">Access Token:</p>
                <p className="bg-gray-100 p-2 rounded">{token.substring(0, 50)}...</p>
            </div>
        </div>
    );
};