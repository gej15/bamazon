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
    inquirer.prompt([
        {
        type: 'list',
        name: 'again',
        message: 'What would you like to do?',
        choices: ['View products', 'View Low Inventory', 'Add Inventory', 'Add New Product']
        }
    ]).then (function(choice){
        console.log(choice.again)
       switch(choice.again) {
           case 'View products':
                viewProduct()
                break
            case 'View Low Inventory':
                viewlowinventory()
                break
            case 'Add Inventory':
                addInventory()
                break
            case 'Add New Product':
                addNewProduct()
                break
       }
    })
}

function viewProduct(){
    connection.query('SELECT * FROM items', function(err, res){
        if (err) throw err;
        // console.log(res)
        let items = []
        for (let i = 0; i < res.length; i++){
            items.push(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        }
        again()
    }) 
}

function viewlowinventory() {
    connection.query('SELECT * FROM items WHERE stock_quanity < 5', function(err, res){
        if (err) throw err;
        // console.log(res)
        let items = []
        for (let i = 0; i < res.length; i++){
            items.push(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quanity)
        }
        again()
    }) 
}

function addInventory(){
    inquirer.prompt([  
        {
        type: 'number',
        name: 'idPrompt',
        message: 'What is the ID number of the product you would like to add to?',
        },
        {
        type: 'number',
        name: 'quanityPrompt',
        message: 'How much of this product would you like to add?',
        }
    ]).then (function(selection){
        connection.query('SELECT * FROM items WHERE item_id = ' + selection.idPrompt, function(err, res){
            if (err) throw err;
                connection.query("UPDATE items SET ? WHERE ?",
                    [
                        {
                            stock_quanity: res[0].stock_quanity - selection.quanityPrompt
                        },
                        {
                            item_id: selection.idPrompt
                        }
                    ],    
                )
                let cost = res[0].price * selection.quanityPrompt
                console.log("Product added: " + res[0].product_name + '\nNumber Added: ' + selection.quanityPrompt + "\nCost: $" + cost )
                again()

        })
    })
}

function addNewProduct() {
    let items = []
    connection.query('SELECT * FROM departments', function(err, res){
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            items.push(res[i].department_name)
        }
    })
    inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the item?"
            },
            {
                type: "list",
                name: "department",
                message: "What department is it in?",
                choices: items
            },
            {
                type: "input",
                name: "price",
                message: "What is the price of the product?"
            },
            {
                type: "input",
                name: "stock",
                message: "How much would you like to purchase?"
            }
        ]).then(function(item, err) {
                createProduct(item.name, item.department, item.price, item.stock)
        })
    }
   

function createProduct(name, department, price, stock) {
    connection.query(
        "INSERT INTO items SET ?",
            {
            product_name: name,
            department_name: department,
            price: price,
            stock_quanity: stock
            }
        );
    console.log("\nNew item purchased: " + name + "\nAmount Purchased: " + stock)
    inquirer.prompt([
    
        {
        type: 'list',
        name: 'again',
        message: 'Would you like to make another product?',
        choices: ['Yes', 'No']
        }
    ]).then (function(choice){
        if (choice.again === "Yes") {
            console.log('\n')
            addNewProduct()
        } else {
            console.log('\n')
            again()    
        }
    })
    
}
    

function again() {
    inquirer.prompt([
    
        {
        type: 'list',
        name: 'again',
        message: 'Would you like run another program?',
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
