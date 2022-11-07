const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const axios = require("axios")

app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017/orderservice", () => {
    console.log("Database Connected")
})

require("./order")
const Order = mongoose.model("Order")

app.post("/order", (req, res) => {
    var newOrder = {
        OrderID: req.body.OrderID,
        BookID: req.body.BookID,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order Created")
    }).catch((err)=>{
        if(err){
            throw err;
        }
    })

})


app.get("/orders", (req, res) => {
    Order.find().then((orders) => {
        res.json(orders)
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order){

            axios.get("http://127.0.0.1:5555/customer/" + order.CustomerID).then((response) => {
                
                var orderObject = {customerName: response.data.name, bookTitle:''}

                axios.get("http://127.0.0.1:4545/book/" + order.BookID).then((response) => {
                    
                    orderObject.bookTitle = response.data.title
                    res.json(orderObject)
                })
            })
        }else{
            res.send("Invalid Order")
        }
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

app.delete("/order/:id", (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(() => {
        res.send("Order deleted")
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})


app.listen("7777", () => {
    console.log("up and running - orders service")
})