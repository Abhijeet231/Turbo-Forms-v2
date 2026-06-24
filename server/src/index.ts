import "dotenv/config"
import createApp from "./app.js"
import { env } from "./config/env.js"

const main = async () => {
    try {
        const port = env.PORT;

        const app = createApp();

        app.listen(port, () => {
            console.log(`Server is running on port : ${port}`)
        })

    } catch (error) {
        console.log("Error while starting the server: ", error)
        process.exit(1)
    }
}

main()