const mongoose = require("mongoose");

const connectDb = async () => {
  const conn = await mongoose.connect("mongodb://localhost:27017/devcamper", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  // console.log(`Mongodb connected to ${conn.connection.host}`);
};

module.exports = connectDb;

// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
