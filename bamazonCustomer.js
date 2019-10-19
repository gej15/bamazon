let mysql = require('mysql')
let inquirer = require('inquirer')
let connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: 'Jackson22',
database: 'bamazon',
})


function run() {
    connection.query('SELECT * FROM items', function(err, res){
        if (err) throw err;
        // console.log(res)
        let items = []
        for (let i = 0; i < res.length; i++){
            items.push(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        }
        prompt()
    }) 
}

function prompt() {
    inquirer.prompt([  
        {
        type: 'number',
        name: 'idPrompt',
        message: 'What is the ID number of the product you would like to buy',
        },
        {
        type: 'number',
        name: 'quanityPrompt',
        message: 'How much of this product would you like to buy',
        }
    ]).then (function(selection){
            connection.query('SELECT * FROM items WHERE item_id = ' + selection.idPrompt, function(err, res){
                if (err) throw err;
                if (selection.quanityPrompt > res[0].stock_quanity) {
                    console.log('Insufficient quantity') 
                } else {
                    let cost = res[0].price * selection.quanityPrompt
                    connection.query("UPDATE items SET ? WHERE ?",
                        [
                            {
                                stock_quanity: res[0].stock_quanity - selection.quanityPrompt,
                                product_sales: res[0].product_sales + cost
                            },
                            {
                                item_id: selection.idPrompt
                            }
                        ],    
                    )
                    // connection.query("UPDATE items SET ? WHERE ?",
                    //     [
                    //         {
                    //             product_sales: res[0].product_sales + cost
                    //         },
                    //         {
                    //             item_id: selection.idPrompt
                    //         }
                    //     ],    
                    // )
                    console.log("Your total cost for " + selection.quanityPrompt + " " + res[0].product_name + " is " + cost)
                    again()
                }
            })
        })
    }

function again() {
    inquirer.prompt([
    
        {
        type: 'list',
        name: 'again',
        message: 'Would you like to make another purchase?',
        choices: ['Yes', 'No']
        }
    ]).then (function(choice){
        if (choice.again === "Yes") {
           run()
        } else {
            process.exit()     
        }
    })
}

run()