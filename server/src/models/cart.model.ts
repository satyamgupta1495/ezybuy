import mongoose, { Document, Schema } from 'mongoose';

interface ICart extends Document {
    userId: string;
    products: { productId: string; quantity: number }[];
    shippingAddress?: string;
}

const cartSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1
            },
        },
    ],
    shippingAddress: {
        type: String
    },
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
