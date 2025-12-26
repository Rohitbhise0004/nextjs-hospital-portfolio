import mongoose, { Schema, model, models } from 'mongoose';

export interface IService {
    name: string;
    description: string;
    icon?: string;
}

export interface ITestimonial {
    name: string;
    text: string;
    rating: number;
    imageUrl?: string;
}

export interface IContact {
    address: string;
    phone: string;
    email: string;
    mapUrl?: string;
}

export interface ISocialMedia {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
}

export interface IHospitalInfo {
    _id?: string;
    about: {
        mission: string;
        vision: string;
        history: string;
        facilities: string;
    };
    services: IService[];
    testimonials: ITestimonial[];
    contact: IContact;
    socialMedia: ISocialMedia;
    updatedAt?: Date;
}

const HospitalInfoSchema = new Schema<IHospitalInfo>(
    {
        about: {
            mission: { type: String, default: '' },
            vision: { type: String, default: '' },
            history: { type: String, default: '' },
            facilities: { type: String, default: '' },
        },
        services: [
            {
                name: { type: String, required: true },
                description: { type: String, required: true },
                icon: { type: String, default: '' },
            },
        ],
        testimonials: [
            {
                name: { type: String, required: true },
                text: { type: String, required: true },
                rating: { type: Number, min: 1, max: 5, default: 5 },
                imageUrl: { type: String, default: '' },
            },
        ],
        contact: {
            address: { type: String, default: '' },
            phone: { type: String, default: '' },
            email: { type: String, default: '' },
            mapUrl: { type: String, default: '' },
        },
        socialMedia: {
            facebook: { type: String, default: '' },
            twitter: { type: String, default: '' },
            instagram: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            youtube: { type: String, default: '' },
        },
    },
    {
        timestamps: true,
    }
);

const HospitalInfo = models.HospitalInfo || model<IHospitalInfo>('HospitalInfo', HospitalInfoSchema);

export default HospitalInfo;
