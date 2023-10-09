import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import process from'process';

//connectong mongoose database
mongoose.connect('mongodb+srv://malikrajbir348:vXKmduk8vBLufX4D@cluster0.eydbeld.mongodb.net/todolistDB');

const app=express();
const port=process.env.PORT||3000;
// const todaytasks=[];
// const workTasks=[];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const itemSchema=new mongoose.Schema({
    name:String
});

const Item= mongoose.model("Item",itemSchema);

const item1= new Item(
    {
        name:"You can add items using add button"
    }
);

const item2= new Item(
    {
        name:"By clicking the checkbox You can strike through"
    }
);
const defaultItems=[item1,item2];


//Render home /today page
app.get("/",async(req,res)=>{
        const foundItems=await Item.find({}); 
        
            if(foundItems.length===0){
                Item.insertMany(defaultItems);
                res.redirect("/");
            }else{
            res.render("index.ejs",{tasks:foundItems,workList:false});
            }
          
});

// Render Work list page
app.get("/work",(req,res)=>{
    res.render("index.ejs",{tasks:workTasks,workList:true});
});

//add in today list
app.post("/add",(req,res)=>{
    const task = req.body.task;
    if (task !== '') {
        const newItem= new Item(
            {
                name:task
            }
        );
        newItem.save();
    }
    res.redirect('/');
});

//add in work list
app.post("/addWork",(req,res)=>{
    const task = req.body.task;

    if (task !== '') {
        workTasks.push(task);
    }

    res.redirect("/work");

});
app.post("/remove",async(req,res)=>{
    console.log(req.body.id);
    
    await Item.findByIdAndRemove(req.body.id);
    res.redirect("/");
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});