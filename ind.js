var mysql = require('mysql');
var nodemailer = require('nodemailer');
var express = require('express');  
var app = express();  
var fs = require('fs');
var bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
//app.use(express.static('public'));  
var dir = require('path').join(__dirname,'/'); 
app.use(express.static(dir));

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})  

app.get('/products.html', function (req, res) {   
   res.sendFile( __dirname + "/" + "products.html" );  
})
 
app.get('/about.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "about.html" );  
})

app.get('/contact.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "contact.html" );  
})

app.get('/single-product.html', function (req, res) {  
   req.params.var
   res.sendFile( __dirname + "/" + "single-product.html" );  
})

app.get('/custinfos.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "custinfos.html" );  
})

app.get('/paymentform.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "paymentform.html" );  
})

// Function update product quantity
function updatequantity() {
 fs.readFile('tempProdId.txt', function(err, data) {
    if (err) throw err; 
     const id = data;    
   fs.readFile('tempQuant.txt', function(err, data) {
      if (err) throw err; 
      const quantity = data; 
     fs.readFile('stock.json', function(err, data) {
        if (err) throw err; 
        const obj = JSON.parse(data);
        const newQuant = obj.stock[id-1].quantity-quantity; 
        obj.stock[id-1].quantity = newQuant;
       fs.writeFile('stock.json', JSON.stringify(obj, null, 2) , function (err) {
         if (err) throw err;

         });
        });
       });
      }); 
}

// get single-product price
 app.get('/productPrice', urlencodedParser, function (req, res) {  
   fs.readFile('tempProdId.txt', function(err, data) {
    let id = data; 
     fs.readFile('product.json', function(err, data) {
     const obj = JSON.parse(data);
        const s_price = obj.product[id-1].price;
        res.status(200).json(s_price);
    });
  });  
})  

// post product id   
 app.post('/postprodId/:var', function (req, res) {  
fs.writeFile('tempProdId.txt', req.params.var , function (err) {
     if (err) throw err;
       }); 
})  

// get single product quantity 
app.get("/pquantity", (req, res, next) => {
fs.readFile('tempProdId.txt', function(err, data) {
  let id = data;
    fs.readFile('stock.json', function(err, data) {
      const obj = JSON.parse(data);
      const quant = obj.stock[id-1].quantity;
      res.status(200).json(quant);
  });
 });    
}) 
 
// get product name 
app.get('/p_name', (req, res, next) => {
fs.readFile('tempProdId.txt', function(err, data) {
    let id = data;
    fs.readFile('product.json', function(err, data) {
      const obj = JSON.parse(data);
      const name = obj.product[id-1].name;
       // console.log(name);
        res.status(200).json(name);
        //res.send(JSON.stringify(name));
    });
  });
}) 

// get product image
app.get("/p_image", (req, res, next) => {
 fs.readFile('tempProdId.txt', function(err, data) {
    let id = JSON.parse(data.toString());
    //console.log(data.toString());
    res.status(200).json(id); 
  });  
}) 

//post quantity bought
app.post('/postquantity/:var', urlencodedParser, function (req, res) {  
//var quantity = 0; var email = ""; var name = ""; var adrress = ""; //var qi = 500; var qf = 100;
switch (req.params.var) {
  case "pquantity":
    fs.writeFile('tempQuant.txt', req.body.quantity , function (err) {
     if (err) throw err;
       });
    res.redirect('/custinfos.html'); 
    break;
  case "email":
    email = req.body.email;
    name = req.body.fname;
    address = req.body.address;
    res.redirect('/paymentform.html');
    break;
  case "confirmp":   
    
                      // send email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'moussabamba1920@gmail.com',
    pass: 'wuqhmuhyczozgcqb'
  }
});

var mailOptions = {
  from: 'moussabamba1920@gmail.com',
  to: email,
  subject: 'Order Confirmation',
  text: 'Thank you ' + name + ', this is to confirm that a transaction has been processed. Your order will be shipped at this address: ' + address

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) { 
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  } 
});
               // End send message
       
    updatequantity();
    res.redirect('/index.html');
    break;
 }  
})

// Get total price 
app.get('/tprice', function (req, res) {  
         var id = 0;
    var quantity = 0; 
fs.readFile('tempProdId.txt', function(err, data) {
    if (err) throw err; 
     id = data; 
  fs.readFile('tempQuant.txt', function(err, data) {
     if (err) throw err;      
     quantity = data; 
    fs.readFile('product.json', function(err, data) {
       if (err) throw err;  
       const obj = JSON.parse(data);   
       const tprice = (obj.product[id-1].price*quantity*1.0863).toFixed(2); 
       res.status(200).json(tprice);
   });
  });  
 });
})

// Get tax
app.get('/tax', function (req, res) { 
   var id = 0;
    var quantity = 0; 
fs.readFile('tempProdId.txt', function(err, data) {
    if (err) throw err; 
     id = data; 
  fs.readFile('tempQuant.txt', function(err, data) {
     if (err) throw err;      
     quantity = data; 
    fs.readFile('product.json', function(err, data) {
       if (err) throw err;  
       const obj = JSON.parse(data);   
       const tax = (obj.product[id-1].price*quantity*0.0863).toFixed(2);
       console.log(tax); 
       res.status(200).json(tax);
   });
  });  
 });
})
  
// Get price before tax
app.get('/p_price', function (req, res) {   
 fs.readFile('tempProdId.txt', function(err, data) {
    if (err) throw err; 
    var id = data; 
  fs.readFile('tempQuant.txt', function(err, data) {
     if (err) throw err;      
     var quantity = data; 
    fs.readFile('product.json', function(err, data) {
       if (err) throw err;  
       const obj = JSON.parse(data);   
       const price = (obj.product[id-1].price*quantity).toFixed(2); 
       res.status(200).json(price);
   });
  });  
 }); 
})

//Post message 
app.post('/postmessage', urlencodedParser, function (req, res) { 
   email = req.body.email;
    name = req.body.name;
    subject = req.body.subject;
    message = req.body.message; 
    console.log(message);
fs.appendFile('myMessages.txt', '\nname: ' + name + '\nemail: ' + email + '\nsubject: ' + subject + '\nmessage: ' + message + '\n\n-----------', function (err) {
  if (err) throw err;
});
res.redirect('/contact.html');
})
var server = app.listen(80, function () {  
  var host = server.address().address  
  var port = server.address().port  
  console.log("Example app listening at http://%s:%s", host, port)  
})  