const sql = require("mysql")
const inquire = require("inquirer")

let items = []

const connection = sql.createConnection(
    {
        host:"localhost",
        port:3306,
        user:"root",
        password:"password1",
        database:"bamazonDB"
    }
)

connection.connect(function(err){
    if (err) throw err;
    console.log(`connected with id: ${connection.threadId}\n`)
    var query = "select * from products"
    connection.query(query,function(err,res){
        if(err)throw err;
        for (let i = 0; i < res.length; i++) {
            items.push(res[i])
        }
    start()
    })
})

function start(){
    inquire.prompt([
        {
            name:"choice",
            type:"list",
            message:"Hello Boss, what would you like to do?",
            choices:["Products for sale",`Low inventory`,`Add inventory`,`New product`]
        }
    ]).then(function(res){
        console.log(res)
        switch(res.choice){
            case `Products for sale`:
                products()
                break;
            case `Low inventory`:
                lowInv()
                break;
            case `Add inventory`:
                addInv()
                break;
            case `New product`:
                newPro()
                break;
            default:
                break;
        }
    })
}

function products(){
    let query = `select * from products`
    connection.query(query,function(err,res){
        if(err) throw err
        for (let i = 0; i < res.length; i++) {
            console.log(`id: ${res[i].item_id}
name: ${res[i].product_name}
price: $${res[i].price}
instock: ${res[i].stock_quantity}
==================================================`)  
        }
    start()
    })
}

function lowInv(){
    let query = `select * from products where stock_quantity < 30`
    connection.query(query,function(err,res){
        for (let i = 0; i < res.length; i++) {
            console.log(`id: ${res[i].item_id}
name: ${res[i].product_name}
price: $${res[i].price}
instock: ${res[i].stock_quantity}
==================================================`)  
        }
        start()
    })
}

function addInv(){
    inquire.prompt([
        {
            name:"item",
            type:"input",
            message:"Please enter the product id that your would like to add.",
        },
        {
            name:"amount",
            type:"input",
            message:"Please enter the amount you would like to add."
        }
    ]).then(function(res){
        let item = res.item - 1 
        let amount = res.amount
        items[item].stock_quantity += parseInt(amount)
        let update = `update products set stock_quantity = ${items[item].stock_quantity + parseInt(amount)} where item_id = ${item+1}`
        connection.query(`update products set stock_quantity = ? where item_id = ?`,[items[item].stock_quantity,item+1],function(err,res,field){
            connection.query(`select * from products where item_id = ${item+1} `,function(err,res){
                console.log(res)
                start()
            })
        })
    })
}

function newPro(){
    inquire.prompt([
        {
            name:'id',
            type:'input',
            message:'Please enter item id'
        },
        {
            name:`name`,
            type:`input`,
            message:`Please enter product name `
        },
        {
            name:`price`,
            type:`input`,
            message:`please enter product price`
        },
        {
            name:`quantity`,
            type:`input`,
            message:`please enter quanity`
        },
        {
            name:`department`,
            type:`input`,
            message:`please enter department`
        }
    ]).then(function(res){
        let insert = `insert into products(product_name,department_name,price,stock_quantity)`
        let values = `${res.name},${res.department},${res.price},${res.quantity}`
        connection.query(`insert into products (item_id,product_name,departent_name,price,stock_quantity) VALUES (?, ?, ?, ?, ?)`, [res.id,res.name,res.department,res.price,res.quantity])
        connection.query(`select * from products`,function(err,res){
            console.log(res)
            start()
        })
    })
}
