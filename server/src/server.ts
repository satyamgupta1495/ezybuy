
import 'reflect-metadata';
import dotenv from 'dotenv';
import App from "./loaders/index.loaders";

dotenv.config()

export async function startServer() {
    const app = new App()
    app.start()
}

startServer()