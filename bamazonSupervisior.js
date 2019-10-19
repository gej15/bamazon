let mysql = require('mysql')
let inquirer = require('inquirer')
const cTable = require('console.table')
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
        name: 'pick',
        message: 'What would you like to do?',
        choices: ['View products sales by department', 'Create new department']
        }
    ]).then (function(choice){
        switch(choice.pick) {
            case 'View products sales by department':
                departmentSales()
                break
            case 'Create new department':
                createDepartment()
                break
        }
    })
}


function departmentSales(){
    console.log('departmentsales')
    connection.query('SELECT * FROM departments', function(err, res){
        if (err) throw err;
        let items = []
        for (let i = 0; i < res.length; i++){
            items.push(res[i].department_name)
        }
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "What department would you like to look at?",
                choices: items
            },
        ]).then(function(item, err) {
            connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(items.product_sales) AS product_sales, sum(items.product_sales) - departments.over_head_costs AS total_sales FROM  departments JOIN  items ON departments.department_name = items.department_name WHERE departments.department_name = "' + item.department + '"', function(err, res){
                console.log('\n')
                console.table([
                    {
                      ID: res[0].department_id,
                      Department_Name: res[0].department_name,
                      Over_Head_Costs: res[0].over_head_costs,
                      Product_Sales: res[0].product_sales,
                      Total_Sales: res[0].total_sales,
                    }
                  ]);
                console.log('\n')
                again()
            })
        })
    })
}

function createDepartment() { 
    console.log('createDepartment')
    inquirer.prompt([
            {
                type: "input",
                name: "department",
                message: "What is the name of the department?"
            },
            {
                type: "input",
                name: "cost",
                message: "What is the over head cost of this department?",
            },
        ]).then(function(item, err) {
            insertDepartment(item.department, item.cost)
        })
}
       
    
function insertDepartment(department, cost) {
        connection.query(
            "INSERT INTO departments SET ?",
                {
                department_name: department,
                over_head_costs: cost
                }
            );
        console.log("\n::Created:: \nNew department: " + department + "\nOver head cost: " + cost  +"\n")
        inquirer.prompt([
        
            {
            type: 'list',
            name: 'again',
            message: 'Would you like to make another department?',
            choices: ['Yes', 'No']
            }
        ]).then (function(choice){
            if (choice.again === "Yes") {
                console.log('\n')
                createDepartment()
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

