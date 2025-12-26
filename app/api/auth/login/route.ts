import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin from '@/src/models/Admin';
import { generateToken } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Find admin by username
        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = generateToken({
            userId: admin._id.toString(),
            username: admin.username,
        });

        // Create response with token in cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
