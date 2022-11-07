const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

app.use(bodyParser.json())

//connection database
    mongoose.connect("mongodb://localhost:27017/customerservice", () => {
        console.log("Database connected")
    })

    require("./customer")
    const Customer = mongoose.model("Customer")

    app.post("/customer", (req, res) => {
        var newCustomer = {
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
        }

        var customer = new Customer(newCustomer)

        customer.save().then(() => {
            res.send("customer registered success")
        }).catch((err) => {
            if(err){
                throw err;
            }
        })     
    })

    app.get("/customers", (req, res) => {
        Customer.find().then((customers) => {
            res.json(customers)
        }).catch((err) => {
            if(err){
                throw err;
            }
        })
    })

    app.get("/customer/:id", (req, res) => {
        Customer.findById(req.params.id).then((customer) => {
            res.json(customer)
        }).catch((err) => {
            if(err){
                throw err;
            }
        })
    })

    app.delete("/customer/:id", (req, res) => {
        Customer.findByIdAndRemove(req.params.id).then(() => {
            res.send("Customer deleted")
        }).catch((err) => {
            if(err){
                throw err;
            }
        })
    })

app.listen("5555", () => {
    console.log("up and running - customer service")
})