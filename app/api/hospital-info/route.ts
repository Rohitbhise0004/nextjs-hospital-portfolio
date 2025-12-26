import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import HospitalInfo from '@/src/models/HospitalInfo';
import { verifyToken } from '@/src/lib/auth';

// GET hospital info (public)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get the first (and should be only) hospital info document
        let hospitalInfo = await HospitalInfo.findOne();

        // If no hospital info exists, create a default one
        if (!hospitalInfo) {
            hospitalInfo = await HospitalInfo.create({
                about: {
                    mission: 'To provide exceptional healthcare services with compassion and excellence.',
                    vision: 'To be the leading healthcare provider in the region.',
                    history: 'Established with a commitment to serve our community.',
                    facilities: 'State-of-the-art medical facilities and equipment.',
                },
                services: [],
                testimonials: [],
                contact: {
                    address: '',
                    phone: '',
                    email: '',
                    mapUrl: '',
                },
                socialMedia: {},
            });
        }

        return NextResponse.json({ success: true, data: hospitalInfo });
    } catch (error) {
        console.error('Get hospital info error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hospital information' },
            { status: 500 }
        );
    }
}

// PUT update hospital info (admin only)
export async function PUT(request: NextRequest) {
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

        // Update or create hospital info
        let hospitalInfo = await HospitalInfo.findOne();

        if (hospitalInfo) {
            hospitalInfo = await HospitalInfo.findByIdAndUpdate(
                hospitalInfo._id,
                data,
                { new: true, runValidators: true }
            );
        } else {
            hospitalInfo = await HospitalInfo.create(data);
        }

        return NextResponse.json({ success: true, data: hospitalInfo });
    } catch (error: any) {
        console.error('Update hospital info error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update hospital information' },
            { status: 500 }
        );
    }
}
