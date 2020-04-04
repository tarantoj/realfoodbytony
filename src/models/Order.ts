import mongoose from "mongoose";
import {ProduceDocument, produceSchema} from "./Produce";
import {UserDocument, userSchema} from "./User";

export type OrderDocument = mongoose.Document & {
    user: UserDocument;
    items: [
        {
            produce: ProduceDocument;
            unit: string;
            quantity: number;
            cost: number;
        }
    ];
    collectionDate: Date;
    isPaid: boolean;
    totalAmount: number;
};

const orderSchema = new mongoose.Schema({
    user: userSchema,
    items: [
        {
            produce: produceSchema,
            unit: String,
            quantity: Number,
            cost: Number
        }
    ],
    collectionDate: Date,
    isPaid: Boolean,
    totalAmount: Number
}, { timestamps: true });

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
