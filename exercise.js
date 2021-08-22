const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/playground").then(() => {
  console.log("Connected to BD");
});

const exerciseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const exercise1 = async () => {
  const courses = await Exercise.find({
    tags: /Backend/i,
    isPublished: true,
  })
    .sort("name")
    .select("name author");
  return courses;
};

const exercise2 = async () => {
  const courses = await Exercise.find({
    isPublished: true,
  })
    .or([{ tags: "backend" }, { tags: "frontend" }])
    .sort("-price")
    .select("name author");

  return courses;
};

const exercise3 = async () => {
  const courses = await Exercise.find({
    isPublished: true,
  })
    .or([{ price: { $gte: 15 } }, { name: /.*by*./i }])
    .select("name author");

  return courses;
};

const run = async () => {
  // const ex1 = await exercise1();
  // console.log("Exercise 1 : ");
  // console.log(ex1);
  // const ex2 = await exercise2();
  // console.log("Exercise 2 : ");
  // console.log(ex2);
  const ex3 = await exercise3();
  console.log("Exercise 3 : ");
  console.log(ex3);
};

run();
