const express = require("express");
const db = require("../connection");
const multer = require('multer');

const routes = express();

routes.use(express.urlencoded({extended:false}));



db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema for projects
const projectSchema = new mongoose.Schema({
  project_name: String,
  project_desc: String,
  link: String,
  type: Number,
  language: String
});

const Project = mongoose.model('Project', projectSchema);

// Define Schema for language
const languageSchema = new mongoose.Schema({
  title: String,
  experience: String,
  icon: String,
  projects: String,
  type: Number,
  project_id: Number
});

const Language = mongoose.model('Language', languageSchema);

// Define Schema for screen
const screenSchema = new mongoose.Schema({
  title: String,
  description: String,
  img: String,
  project_id: Number,
  is_main: Number
});

const Screen = mongoose.model('Screen', screenSchema);

// Define multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${process.env.BASE_URL}/image/${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

routes.get("/", (req, res) => {
    res.send("hello routes");
});

// Example of converting MySQL query to Mongoose
routes.get("/projects", async (req, res) => {
  try {
    const projectsData = await Project.aggregate([
      {
        $lookup: {
          from: "screens",
          let: { project_id: "$project_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project_id", "$$project_id"] }, is_main: 1 } },
            { $limit: 1 },
            { $project: { img: 1 } }
          ],
          as: "screen"
        }
      },
      {
        $unwind: { path: "$screen", preserveNullAndEmptyArrays: true }
      }
    ]);

    res.json(projectsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Additional routes converted to MongoDB/Mongoose

// Upload project
routes.post("/upload_project", async (req, res) => {
  try {
    const project = new Project({
      project_name: req.body.name,
      project_desc: req.body.desc,
      link: req.body.link,
      type: req.body.type,
      language: req.body.language
    });

    await project.save();
    res.status(200).json({ status: "success", message: "Project uploaded successfully", project_id: project._id });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to upload project", error: error.message });
  }
});

// Upload language
routes.post("/upload_language", upload.single("language_img"), async (req, res) => {
  try {
    const language = new Language({
      title: req.body.title,
      experience: req.body.experience,
      icon: req.file.path,
      projects: req.body.projects,
      type: req.body.type,
      project_id: req.body.project_id
    });

    await language.save();
    res.status(200).json({ status: "success", message: "Language uploaded successfully", language_id: language._id });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to upload language", error: error.message });
  }
});

// Upload screen
routes.post("/upload_screens", upload.single("screen_img"), async (req, res) => {
  try {
    const screen = new Screen({
      title: req.body.title,
      description: req.body.desc,
      img: req.file.path,
      project_id: req.body.project_id,
      is_main: req.body.is_main
    });

    await screen.save();
    res.status(200).json({ status: "success", message: "Screen uploaded successfully", screen_id: screen._id });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to upload screen", error: error.message });
  }
});

module.exports = routes;
