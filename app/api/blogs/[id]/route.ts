import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Blog from '@/src/models/Blog';
import { verifyToken } from '@/src/lib/auth';

// GET single blog (public if published, admin for all)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        // Try to find by ID first, then by slug
        let blog = await Blog.findById(id);

        if (!blog) {
            blog = await Blog.findOne({ slug: id });
        }

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Check if blog is published or user is admin
        const token = request.cookies.get('auth-token')?.value;
        const isAdmin = token && verifyToken(token);

        if (!blog.published && !isAdmin) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        console.error('Get blog error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog' },
            { status: 500 }
        );
    }
}

// PUT update blog (admin only)
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

        const blog = await Blog.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error: any) {
        console.error('Update blog error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update blog' },
            { status: 500 }
        );
    }
}

// DELETE blog (admin only)
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

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog' },
            { status: 500 }
        );
    }
}
