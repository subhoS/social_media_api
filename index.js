const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const port = 4000;
const helmet = require("helmet");

const db = require("./controller/query");

app.use(
  cors({
    origin: "http://localhost:3000/",
  })
);

app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//landing page
app.get("/", (request, response) => {
  response.json({ info: "api is working" });
});

//userApi
app.get("/getUsers/", db.ShowUsers);

app.get("/getActiveUsers/", db.ShowActiveUsers);

app.get("/serchUserByid/:id",db.serchUserById)

app.post("/signUp/", db.signUp);

app.put("/changeActivity/",db.softDelete)

app.delete("/deleteAccount/",db.hardDelete)

//adminAlearApi

app.get("/getAdminPost/",db.viewAllPost)

app.get("/getAdminPostbyid/:postid",db.postById)

app.put("/archivePost/",db.archivePost)

app.post("/uploadApi/",db.uploadApi)

// app.post("/deletePost",db.deletePost)

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
