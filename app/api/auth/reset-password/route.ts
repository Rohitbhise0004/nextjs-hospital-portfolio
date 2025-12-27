import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin from '@/src/models/Admin';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { username, newPassword } = await request.json();

        if (!username || !newPassword) {
            return NextResponse.json(
                { error: 'Username and new password are required' },
                { status: 400 }
            );
        }

        // Find admin by username
        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin user not found' },
                { status: 404 }
            );
        }

        // Update password (will be hashed by pre-save hook)
        admin.password = newPassword;
        await admin.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to reset password' },
            { status: 500 }
        );
    }
}
