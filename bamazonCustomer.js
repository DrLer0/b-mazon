var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
    setTimeout(runCustomer, 1000);
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].customer_price + " || Stock: " + res[i].stock);
        }
    });
}

function runCustomer() {
    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Input ID of product you wish to purchase: "
        }, {
            name: "amount",
            type: "input",
            message: "How many items to purchase: "
        }])
        .then(function(answer) {
            var query = "SELECT * FROM products WHERE item_id=" + answer.productID;
            console.log(answer);
            console.log(query);
            connection.query(query, function(err, res) {
                if (err) throw err;
                // console.log(res[0].stock);
                var inStock = res[0].stock;
                var price = res[0].customer_price;
                var id = res[0].item_id;
                if (inStock < answer.amount) {
                    console.log("Insufficient quantity in stock.")
                } else {
                    var newStock = inStock - parseInt(answer.amount);
                    console.log(newStock)
                    var query = "UPDATE products SET stock = ? WHERE item_id = ?";
                    connection.query(query, [newStock, id], function(err, res) {
                        if (err) throw err;
                        console.log("Total Cost: " + price);
                    });
                    // displayProducts();
                }
            })
        });
}