import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Doctor from '@/src/models/Doctor';
import { verifyToken } from '@/src/lib/auth';

// GET all doctors (public)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const specialty = searchParams.get('specialty');

        let query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } },
            ];
        }

        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }

        const doctors = await Doctor.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: doctors });
    } catch (error) {
        console.error('Get doctors error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch doctors' },
            { status: 500 }
        );
    }
}

// POST new doctor (admin only)
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const token = request.cookies.get('auth-token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const data = await request.json();

        const doctor = await Doctor.create(data);

        return NextResponse.json(
            { success: true, data: doctor },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create doctor error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create doctor' },
            { status: 500 }
        );
    }
}
