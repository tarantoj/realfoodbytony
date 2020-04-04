import mongoose from "mongoose";

export type ProduceDocument = mongoose.Document & {
    name: string;
    description: string;
    price: number;
    priceUnit: string;
    units: [string];
    validFrom: Date;
    validTo: Date;
};

export const produceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    priceUnit: String,
    units: [String],
    validFrom: Date,
    validTo: Date
}, { timestamps: true });

export const Produce = mongoose.model<ProduceDocument>("produce", produceSchema);
