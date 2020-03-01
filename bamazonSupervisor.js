var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var table = new Table({
    head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
    colWidths: [20, 20, 20, 20, 20]
});


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
    supervisorStart();
});

function supervisorStart() {
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Quit"
        ]
    }).then(function(answer) {
        switch (answer.menu) {
            case "View Product Sales by Department":
                viewProfit();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Quit":
                connection.end();
                console.log("The End!");
                break;
        }
    });
}

function viewProfit() {
    var query = "SELECT departments.department_id, departments.department_name, AVG(departments.over_head_costs) as overhead_costs, SUM(products.product_sales) as product_sales FROM products INNER JOIN departments ON departments.department_name = products.department_name GROUP BY department_id;"
    connection.query(query, function(err, res) {
        var total_profit = 0;
        for (var i = 0; i < res.length; i++) {
            total_profit = res[i].product_sales - res[i].overhead_costs;
            table.push([res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].product_sales, total_profit]);

        }
        console.log(table.toString());
    })
}

function newDepartment() {

}