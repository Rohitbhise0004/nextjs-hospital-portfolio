import mongoose, { Schema, model, models } from 'mongoose';

export interface IDoctor {
    _id?: string;
    name: string;
    specialty: string;
    bio: string;
    imageUrl?: string;
    qualifications: string[];
    experience: number; // years
    email?: string;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const DoctorSchema = new Schema<IDoctor>(
    {
        name: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true,
        },
        specialty: {
            type: String,
            required: [true, 'Specialty is required'],
            trim: true,
        },
        bio: {
            type: String,
            required: [true, 'Bio is required'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
        qualifications: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
            min: 0,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for search functionality
DoctorSchema.index({ name: 'text', specialty: 'text' });

const Doctor = models.Doctor || model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
