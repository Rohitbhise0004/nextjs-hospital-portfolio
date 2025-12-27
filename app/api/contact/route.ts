import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import ContactMessage from '@/src/models/ContactMessage';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { name, email, phone, message } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Save message to database
        const contactMessage = await ContactMessage.create({
            name,
            email,
            phone: phone || '',
            message,
            read: false,
        });

        return NextResponse.json({
            success: true,
            message: 'Message received successfully',
            data: contactMessage,
        });
    } catch (error: any) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}

// GET all messages (admin only)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const messages = await ContactMessage.find({})
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: messages,
        });
    } catch (error: any) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
