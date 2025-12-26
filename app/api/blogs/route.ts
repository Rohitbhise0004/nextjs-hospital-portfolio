import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Blog from '@/src/models/Blog';
import { verifyToken } from '@/src/lib/auth';

// GET all blogs (public - only published)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const tag = searchParams.get('tag');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Check if admin is requesting (show all blogs including drafts)
        const token = request.cookies.get('auth-token')?.value;
        const isAdmin = token && verifyToken(token);

        let query: any = isAdmin ? {} : { published: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

// POST new blog (admin only)
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

        const blog = await Blog.create(data);

        return NextResponse.json(
            { success: true, data: blog },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create blog error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create blog' },
            { status: 500 }
        );
    }
}
