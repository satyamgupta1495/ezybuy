import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    image: string;
}

const productSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
