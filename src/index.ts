import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 8000;
//connections and listeners
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server opened and connected to database");
    });
  })
  .catch((err) => {
    console.log(`Error occured ${err}`);
  });
