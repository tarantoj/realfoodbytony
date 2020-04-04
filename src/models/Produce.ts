import mongoose from "mongoose";

export type ProduceDocument = mongoose.Document & {
    name: string;
    price: number;
    unit: string;
    units: [string];
    validFrom: Date;
    validTo: Date;
};

export const produceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    unit: String,
    units: [String],
    validFrom: Date,
    validTo: Date
}, { timestamps: true });

export const Produce = mongoose.model<ProduceDocument>("produce", produceSchema);
