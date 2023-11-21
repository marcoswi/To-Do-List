import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "permalist",
    password: process.env.POSTGRES_PASS,
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    const items = result.rows;
    res.render("index.ejs", {items: items});
})

/* ADD */
app.post("/add", async (req, res) => {
    const newItem = req.body.newItem;
    try {
        await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    };
})

/* DELETE */
app.post("/delete", async (req,res) =>{
    const itemToDelete = req.body.deleteItem;
    try {
        await db.query("DELETE FROM items WHERE id = $1", [itemToDelete]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    };
});

/* EDIT */
app.post("/edit", async (req,res) => {
    const itemToEditID = req.body.itemToEdit;
    const newTitle = req.body.newTitle;
    try {
        await db.query("UPDATE items SET title = ($1) WHERE id = $2", [newTitle, itemToEditID]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});


app.listen(port, () => {
    console.log("Server is running in port:" + port);
});