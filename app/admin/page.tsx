'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Verify authentication
        fetch('/api/auth/verify')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
                setLoading(false);
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats Cards */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total Doctors</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total Blogs</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Published Blogs</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <div className="text-2xl mb-2">👨‍⚕️</div>
                            <div className="font-medium">Manage Doctors</div>
                        </button>
                        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                            <div className="text-2xl mb-2">📝</div>
                            <div className="font-medium">Manage Blogs</div>
                        </button>
                        <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                            <div className="text-2xl mb-2">⚙️</div>
                            <div className="font-medium">Hospital Settings</div>
                        </button>
                        <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors">
                            <div className="text-2xl mb-2">📧</div>
                            <div className="font-medium">Messages</div>
                        </button>
                    </div>
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">🚧 Under Development</h3>
                    <p className="text-yellow-700">
                        The full admin dashboard with doctor management, blog editor, and settings
                        is currently under development. You can add these features as needed.
                    </p>
                </div>
            </main>
        </div>
    );
}
