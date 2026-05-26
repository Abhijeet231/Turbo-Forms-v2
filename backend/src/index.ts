import "dotenv/config"
import createApp from "./app.js"


const main = async () => {
    try {

        const port = process.env.PORT || 3000

        // db connect stuff

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