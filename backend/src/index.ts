import "dotenv/config"
import createApp from "./app.js"
import { pool } from "./db/index.js"


const main = async () => {
    try {

        await pool.query("SELECT 1");
        console.log("Database Connected.");

        const port = process.env.PORT || 3000

        const app = createApp()

        app.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })

    } catch (error) {
        console.log('Error while starting server:', error)
        process.exit(1)
    }
};

main()