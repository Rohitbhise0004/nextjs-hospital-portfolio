import mongoose, { Schema, model, models } from 'mongoose';

export interface IContactMessage {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    read: boolean;
    createdAt?: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ContactMessage = models.ContactMessage || model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
