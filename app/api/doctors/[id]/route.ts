import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Doctor from '@/src/models/Doctor';
import { verifyToken } from '@/src/lib/auth';

// GET single doctor (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: doctor });
    } catch (error) {
        console.error('Get doctor error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch doctor' },
            { status: 500 }
        );
    }
}

// PUT update doctor (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const data = await request.json();

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: doctor });
    } catch (error: any) {
        console.error('Update doctor error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update doctor' },
            { status: 500 }
        );
    }
}

// DELETE doctor (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const doctor = await Doctor.findByIdAndDelete(id);

        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Doctor deleted successfully',
        });
    } catch (error) {
        console.error('Delete doctor error:', error);
        return NextResponse.json(
            { error: 'Failed to delete doctor' },
            { status: 500 }
        );
    }
}
