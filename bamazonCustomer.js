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
        var itembuy = res.item 
        console.log("Does this all look right?")
        console.log(`you will purchare ${res.amount} ${items[res.item-1].product_name}`)
        items[res.item-1].stock_quantity -= res.amount
        console.log(items[res.item-1])
        if(amount2buy <= items[itembuy-1].stock_quantity){

            inquire.prompt([
                {
                    name:'confirm',
                    type:'confirm',
                    message:`your total is ${parseInt(items[itembuy-1].price) * parseInt(amount2buy)}`
                }
            ]).then(function(res){
                
                if(res.confirm){
                    console.log("thank you for your business")
                    var update = "update "
                    connection()
                    buy();
                }else{
                    console.log("please review your order")
                    items[itembuy-1].stock_quantity += parseInt(amount2buy)
                    console.log(items[itembuy-1])
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
