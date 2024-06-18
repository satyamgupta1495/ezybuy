import nodemailer from 'nodemailer';
import User from '../models/user.model';
import Mailgen from 'mailgen';

const sendEmail = async (userId: string, cart: any) => {
    const user = await User.findById(userId);
    const email = user?.email;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/',
        },
    })

    let response: any = {
        body: {
            name: user?.email,
            intro: "Order placed successfully on EzyBuy. Thank you for shopping with us.",
            table: {
                data: []
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",

        }
    }

    cart?.products?.forEach((product: any) => {
        const productData = {
            item: product?.productId?.title,
            price: product?.productId?.price,
            quantity: product?.quantity,
            total: Number(product?.productId?.price) * Number(product?.quantity),
        };
        response.body.table.data.push(productData);
    });

    let mail = mailGenerator.generate(response);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Order Confirmation',
        text: `Your order has been confirmed`,
        html: mail
    };

    const emailSent = await transporter.sendMail(mailOptions).then(() => true).catch((err) => {
        console.log(err)
        return false
    });

    if (!emailSent) {
        console.log('Error while sending email');
    }

    return emailSent;
};

export default sendEmail;
