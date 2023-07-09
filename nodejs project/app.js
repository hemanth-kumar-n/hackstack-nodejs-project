const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const session = require('express-session');
const uri='mongodb+srv://hemanthkumar6625:JaHTZAR9nzdgiBpt@cluster0.ckmnrfm.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
.then((result)=>console.log('mongodb connected') )
.catch((err)=>console.log(err));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({ secret:'key', resave: true, saveUninitialized: true }));
app.use(express.static('pages'));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

/*   mongodb   */

const signupSchema=new mongoose.Schema({
  emailid: {
    type:String,
    required:true
  },
  username: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  }
})
const collection=new mongoose.model('userdata',signupSchema);
/*   routing   */
app.listen(3000,()=>{
    console.log('server started');
});

app.get('/',(req,res)=>{
    const relativePath = './pages/homePage.html'; 

  res.sendFile(relativePath, { root: __dirname });
});

app.get('/login',(req,res)=>{
    
  res.render('loginPage');
});

app.get('/signup',(req,res)=>{
    
  res.render('signupPage');
});

app.get('/menu',(req,res)=>{
    
  res.render('menuPage',{
    cartitems:cartitems
  });
});
/* login */
app.post('/login_submit',async (req,res)=>{
  const check=await collection.findOne({emailid:req.body.emailid})
  if(check.password==req.body.password){
    res.redirect('/menu');
  }else{
    res.sendFile('./pages/goback.html',{root:__dirname});
  }
});
/* signup */
app.post('/signup_submit',async (req,res)=>{
const data={
  emailid:req.body.emailid,
  username:req.body.username,
  password:req.body.password
}
await collection.insertMany([data])
res.redirect('/login');
})

/* cart */
const cartitems=[ ];

const addtocart=(items)=>{
  cartitems.push(items);
};

app.post('/add_to_cart',(req,res)=>{
  const cartitem={
    title:req.body.productname,
    quantity:req.body.quantity,
    price: parseFloat(req.body.productprice) * req.body.quantity,
  }
  addtocart(cartitem);
  res.render('menuPage',{
    cartitems:cartitems
  });
});
/* order summary */
app.get('/order_summary',(req,res)=>{
  const cartitem={
    title:req.body.productname,
    quantity:req.body.quantity,
    price: parseFloat(req.body.productprice) * req.body.quantity
  }
  addtocart(cartitem);
  res.render('ordersummaryPage',{
    cartitems:cartitems
  });
});

/* confirmation page */
app.post('/orderhistory',async (req,res)=>{
  const data={
    emailid:req.body.emailid,
    username:req.body.username,
    password:req.body.password
  }
  await collection.insertMany([data])
  res.redirect('/menu');
  })

  /* User Profile */
app.get('/userprofile', (req, res) => {
  if (req.session.userdata) {
    const { username, emailid } = req.session.userdata;
    res.send(`Name: ${username}<br>Email: ${emailid}`);
  } else {
    res.redirect('error');
  }
});

  /* logout */
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  