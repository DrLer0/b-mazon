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
    // displayProducts();
    // setTimeout(runCustomer, 1000);
    managerStart();
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].customer_price + " || Stock: " + res[i].stock);
        }
    });
    setTimeout(managerStart, 1000);
}

function managerStart() {
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ]
    }).then(function(answer) {
        switch (answer.menu) {
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                // displayProducts();
                setTimeout(viewLow, 1000);
                break;
            case "Add to Inventory":
                increaseInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Quit":
                connection.end();
                console.log("The End!");
                break;
        }
    });
}

function viewLow() {
    var query = "SELECT * FROM products WHERE stock < 5";
    connection.query(query, function(err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No items less than 5 in stock!\n");
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("Product: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].customer_price + " || Stock: " + res[i].stock);
            }
        }
    });
    setTimeout(managerStart, 1000);
}

function increaseInventory() {
    var items = [];
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product_name);
        }
    });
    console.log(items);
    setTimeout(function() {
        inquirer.prompt([{
                name: "menu",
                type: "rawlist",
                message: "Which item to increase inventory of?",
                choices: items
            },
            {
                name: "amount",
                type: "number",
                message: "How much to add to inventory: ",
            }
        ]).then(function(answer) {
            var query = "UPDATE products SET stock = stock + ? WHERE product_name=?";
            connection.query(query, [answer.amount, answer.menu], function(err, res) {
                if (err) throw err;
                setTimeout(displayProducts, 1000);
            })
        });
    }, 1000);
}

function addProduct() {
    inquirer.prompt([{
        name: "newItem",
        type: "input",
        message: "Name of item to add: "
    }, {
        name: "amount",
        type: "number",
        message: "How much of it to add: ",
    }, {
        name: "department",
        type: "input",
        message: "Which department: "
    }, {
        name: "price",
        type: "number",
        message: "How much does it cost? "
    }]).then(function(answer) {
        var query = "INSERT INTO products (product_name, department_name, customer_price, stock) VALUES (?, ?, ?, ?)";
        connection.query(query, [answer.newItem, answer.department, answer.price, answer.amount], function(err, res) {
            if (err) throw err;
            setTimeout(displayProducts, 1000);
        })
    })
}