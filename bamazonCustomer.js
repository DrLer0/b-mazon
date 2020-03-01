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
    displayProducts();
    setTimeout(function() {
        inquirer.prompt({
            name: "action",
            type: "rawlist",
            message: "What do you want to do? ",
            choices: [
                "Buy an item!",
                "Quit"
            ]
        }).then(function(answer) {
            switch (answer.action) {
                case "Buy an item!":
                    buy();
                    break;
                case "Quit":
                    connection.end();
                    console.log("The End!");
                    break;
            }
        });
    }, 1000)
}

function buy() {
    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Input ID of product you wish to purchase: "
        }, {
            name: "amount",
            type: "number",
            message: "How many items to purchase: "
        }])
        .then(function(answer) {
            var query = "SELECT * FROM products WHERE item_id=" + answer.productID;
            connection.query(query, function(err, res) {
                if (err) throw err;
                var inStock = res[0].stock;
                var price = res[0].customer_price * answer.amount;
                var id = res[0].item_id;
                if (inStock < answer.amount) {
                    console.log("Insufficient quantity in stock.")
                } else {
                    var query = "UPDATE products SET stock = stock - ? WHERE item_id = ?";
                    connection.query(query, [answer.amount, id], function(err, res) {
                        if (err) throw err;
                        console.log("Total Cost: " + price);
                    });
                }
            })
            setTimeout(runCustomer, 1000);
        });
}