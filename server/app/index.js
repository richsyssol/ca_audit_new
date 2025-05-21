require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan"); // logger
// Required Dependencies

// db setup
const sequelize = require("./utils/db");

// Models setup

const User = require("./models/userModel");
const Token = require("./models/tokenModel");
const FormOne = require("./models/form1Model");
const FormTwo = require("./models/formTwoModel");
const FormNine = require("./models/formNineModel");
const FormSix = require("./models/formSixModel");

const models = { User, Token, FormOne, FormTwo, FormNine, FormSix };

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Server
const app = express();

// CORS policy
const corsOptions = {
  origin: [
    "http://192.168.0.241:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5176",

    "*",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions)); // Handle all routes CORS at once
app.use(morgan("dev"));
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //
app.get("/dev", (req, res) => {
  res.send("Website Template App");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const formOneRoutes = require("./routes/formOneRoutes");
const formNineRoutes = require("./routes/formNineRoutes");
const formEightRoutes = require("./routes/formEightRoutes");
const formSevenRoutes = require("./routes/formSevenRoutes");
const formSixRoutes = require("./routes/formSixRoutes");
const formFiveRoutes = require("./routes/formFiveRoutes");
const formThreeRoutes = require("./routes/formThreeRoutes");
const formTwoRoutes = require("./routes/formTwoRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/formOne", formOneRoutes);
app.use("/api/v1/formNine", formNineRoutes);
app.use("/api/v1/formEight", formEightRoutes);
app.use("/api/v1/formSeven", formSevenRoutes);
app.use("/api/v1/formSix", formSixRoutes);
app.use("/api/v1/formFive", formFiveRoutes);
app.use("/api/v1/formThree", formThreeRoutes);
app.use("/api/v1/formTwo", formTwoRoutes);
app.use("/pdf", pdfRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    return sequelize.sync();
  })
  .then(() => {
    console.log("Models have been synchronized with the database.");

    const PORT = process.env.NODE_DOCKER_PORT || process.env.NODE_LOCAL_PORT;

    app.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
