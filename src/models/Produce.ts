import mongoose from "mongoose";

export type ProduceDocument = mongoose.Document & {
    name: string;
    description: string;
    priceOptions: [{
        price: number;
        unit: string;
        min: number;
        max: number;
        step: number;
    }];
    validFrom: Date;
    validTo: Date;
};

export const produceSchema = new mongoose.Schema({
    name: String,
    description: String,
    priceOptions: [{
        price: Number,
        unit: String,
        min: Number,
        max: Number,
        step: Number
    }],
    validFrom: Date,
    validTo: Date
}, { timestamps: true });

export const Produce = mongoose.model<ProduceDocument>("Produce", produceSchema);
