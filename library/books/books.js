//Load express
    const express = require("express");
    const app = express();
//Load Mongo
    const mongoose = require("mongoose")
//BodyParse
    const bodyParser = require("body-parser");
//model book
    require("./book")
    const Book = mongoose.model("Book")

    //connect
    mongoose.connect("mongodb://localhost:27017/bookservice", () => {
        console.log("mongodb is connected")
    })

    //parser 
    app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("this is our main endpoint")
})

// Create Func
    app.post("/book", (req, res) => {
        var newBook = {
            title: req.body.title,
            author: req.body.author,
            numberPages: req.body.numberPages,
            publisher: req.body.publisher
        }

        var book = new Book(newBook)

        book.save().then(() => {
            console.log("New Book Created!")
        }).catch((err) => {
            if(err){
                throw err;
            }
        })

        res.send("A new book created with success!")
    })

    app.get("/books", (req, res) => {
        Book.find().then((books) => {
            res.json(books)
        }).catch(err => {
            if(err){
                throw err;
            }
        })
    })

    app.get("/book/:id", (req, res) => {
        Book.findById(req.params.id).then((book) => {
            if(book){
                res.json(book)
            }else{
                res.sendStatus(404)
            }
        }).catch(err => {
            if(err){
                throw err;
            }
        })
    })

    app.delete("/book/:id", (req, res) => {
        Book.findOneAndRemove(req.params.id).then(() => {
            res.send("Book removed!")
        }).catch(err => {
            if(err){
                throw err;
            }
        })
    })


app.listen(4545, () => {
    console.log("up and running! -- this is our books service")
})