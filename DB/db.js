import mongoose from "mongoose";
const Connection = (password) => {
  const url = `mongodb://admin123:${password}@ac-jfcfoc9-shard-00-00.qtpjrsr.mongodb.net:27017,ac-jfcfoc9-shard-00-01.qtpjrsr.mongodb.net:27017,ac-jfcfoc9-shard-00-02.qtpjrsr.mongodb.net:27017/?ssl=true&replicaSet=atlas-zvfa4w-shard-0&authSource=admin&retryWrites=true&w=majority`;
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose
    .connect(url, connectionParams)
    .then(() => {
      console.log("Connected to the database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database.`);
    });
};
export default Connection;
