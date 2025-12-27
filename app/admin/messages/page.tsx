'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            router.push('/login');
            return;
        }
        fetchMessages();
    }, [router]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact');
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchMessages();
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Contact Messages</h1>
                    <button
                        onClick={() => router.push('/admin')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b">
                            <h2 className="font-bold">Inbox ({messages.length})</h2>
                        </div>
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No messages yet
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?._id === msg._id ? 'bg-blue-50' : ''
                                            } ${!msg.read ? 'font-semibold' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium">{msg.name}</span>
                                            {!msg.read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">{msg.email}</div>
                                        <div className="text-sm text-gray-600 truncate">
                                            {msg.message}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        {selectedMessage ? (
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            {selectedMessage.name}
                                        </h2>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>📧 {selectedMessage.email}</div>
                                            {selectedMessage.phone && (
                                                <div>📞 {selectedMessage.phone}</div>
                                            )}
                                            <div className="text-gray-400">
                                                {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-bold mb-3">Message:</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="border-t mt-6 pt-6">
                                    <h3 className="font-bold mb-3">Quick Reply:</h3>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: Your message to Hospital`}
                                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📧</div>
                                <p>Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
