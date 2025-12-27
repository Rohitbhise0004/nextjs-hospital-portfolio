import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin from '@/src/models/Admin';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const admins = await Admin.find({}).select('username email createdAt');

        return NextResponse.json({
            success: true,
            count: admins.length,
            admins: admins,
        });
    } catch (error: any) {
        console.error('Check admin error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check admins' },
            { status: 500 }
        );
    }
}
