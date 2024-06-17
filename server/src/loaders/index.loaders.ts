import Express from "./expressLoader";
import Container from "typedi";
import connectDB from "./dbLoader";

class App {
    constructor() { }

    public start() {
        connectDB()
        const express = Container.get(Express);
        express.init()
    }
}

export default App