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
        console.log(res)
        let items = []
        for (let i = 0; i < res.length; i++){
            items.push(res[i].department_name)
        }
        console.log(items)
    })
}

// SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(items.product_sales) AS product_sales, sum(items.product_sales - departments.over_head_costs) AS total_sales FROM  departments JOIN  items ON departments.department_name = items.department_name WHERE departments.department_name = "home" 

function createDepartment() { 
    console.log('createDepartment')
    
}

run()

