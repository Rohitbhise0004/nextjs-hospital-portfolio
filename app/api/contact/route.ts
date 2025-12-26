import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/src/lib/email';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const { name, email, phone, message } = data;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Send email
        await sendContactEmail({ name, email, phone, message });

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully!',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
