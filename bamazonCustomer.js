var sql = require("mysql");
var inquire = require("inquirer");

var items = []

var connection = sql.createConnection(
    {
        host:"localhost",
        port:3306,
        user:"root",
        password:"password1",
        database:"bamazonDB"
    }
)

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id: "+connection.threadId+"\n")
    start();
})

function start(){
    var query = "select * from products"
    connection.query(query,function(err,res){
        if(err)throw err;
        for (let i = 0; i < res.length; i++) {
            items.push(res[i])
        }
        buy();
    })
}

function buy(){
    inquire.prompt([
        {
            name:'item',
            type:'input',
            message:'Please enter the item id you would like to purchase: '
        },
        {
            name:'amount',
            type:'input',
            message:'How many would you like to buy? '
        }
    ]).then(function(res){
        var amount2buy = res.amount
        var itembuy = res.item - 1
        console.log("Does this all look right?")
        console.log(`you will purchare ${res.amount} ${items[itembuy].product_name}`)
        // connection.query(`select * from products where item_id = ${itembuy+1}`,function(err,res){
        //     console.log(res)
        // })
        // console.log(items[itembuy].stock_quantity)
        
        if(amount2buy <= items[itembuy].stock_quantity){
            items[itembuy].stock_quantity -= res.amount
            var newQuant = items[itembuy].stock_quantity
            inquire.prompt([
                {
                    name:'confirm',
                    type:'confirm',
                    message:`your total is ${parseInt(items[itembuy].price) * parseInt(amount2buy)}$`
                }
            ]).then(function(res){
                
                if(res.confirm){
                    console.log(newQuant+" remaining")
                    console.log("thank you for your business")
                    var update = "update"
                    connection.query(`update products set stock_quantity = ? where item_id = ?`,[newQuant,itembuy+1], function(err,res,field){
                    })
                    
                    buy();
                }else{
                    console.log("please review your order")
                    items[itembuy].stock_quantity += parseInt(amount2buy)
                    console.log(items[itembuy])
                    buy();
                    
                }

            })
        }else{
            console.log("That amount exceeds our current stock")
            buy()
        }
    })
}

// console.log(
//     res[i].item_id,
//     res[i].product_name, 
//     res[i].price, 
//     res[i].stock_quantity);  
