var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Sosacat93!!",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  
  connection.query("SELECT * FROM products", function(err, res) {
    
    console.table(res);
    start();
  })
});

function start() {
  inquirer
    .prompt([{
      name: "item",
      type: "input",
      message: "Would would you like to purchase?"
    },
    { 
      name: "quantity",
      type: "input",
      message: "How many would you like?"
    }])
    .then(function(answer) {
      var query = "SELECT item_name, stock_quantity, price FROM products WHERE ?";
      connection.query(query, { item_name: answer.item }, function(err, res) {

        let chosen = res[0];
        let quantity = parseInt(answer.quantity)

        let newQuantity = ( chosen.stock_quantity - quantity )

        console.log("You wish to purchase: \n" + chosen.item_name + "\n~~~~~~~~~~~");
       

        if ( quantity < chosen.stock_quantity) {

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
              stock_quantity: newQuantity
            },
            {
              item_name: answer.item
            }
            ],
            function (error) {
              if (error) throw err;
              console.log("Your card will be charged. There are " + newQuantity + " remaining.");
          connection.end();
            }
          );
        }else {
          console.log("The stock is too low! Please try again.")
          connection.end();
        }

        
      });
    });
}