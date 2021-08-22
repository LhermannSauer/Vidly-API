const { date } = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Could not connect to MongoDB", err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

// const course = new Course({
//   name: "Angular Course",
//   author: "Leandro",
//   tags: ["Angular", "Frontend"],
//   isPublished: false,
// });

const createCourse = async (course) => {
  const result = await course.save();
  console.log(result);
};

const getCourses = async (course) => {
  const courses = await Course.find();
  console.log(courses);
};

// Query First -> Make sure the id exists
const updateCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course) return;
  course.set({
    isPublished: true,
    author: "New Author",
  });
  const result = await course.save();

  return result;
};

// update first
const updateFirstCourse = async (id) => {
  const result = await Course.updateOne(
    { _id: id },
    {
      author: "Leandro",
      isPublished: false,
    }
  );
  console.log(result);
  return result;
};

updateFirstCourse("612112e06d647c49042fb6ba");
