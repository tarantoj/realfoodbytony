import mongoose from "mongoose";
import {ProduceDocument} from "./Produce";
import {UserDocument} from "./User";

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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            produce: { type: mongoose.Schema.Types.ObjectId, ref: "Produce"},
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
