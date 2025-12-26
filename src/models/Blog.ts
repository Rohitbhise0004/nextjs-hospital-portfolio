import mongoose, { Schema, model, models } from 'mongoose';

export interface IBlog {
    _id?: string;
    title: string;
    slug: string;
    content: string; // Rich text HTML
    excerpt: string;
    imageUrl?: string;
    author: string;
    publishDate: Date;
    tags: string[];
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        excerpt: {
            type: String,
            default: '',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            default: 'Admin',
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        tags: {
            type: [String],
            default: [],
        },
        published: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for search
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Auto-generate slug from title if not provided
BlogSchema.pre('save', function () {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Auto-generate excerpt from content if not provided
    if (!this.excerpt && this.content) {
        const plainText = this.content.replace(/<[^>]*>/g, '');
        this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }
});

const Blog = models.Blog || model<IBlog>('Blog', BlogSchema);

export default Blog;
