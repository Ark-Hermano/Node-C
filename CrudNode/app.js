const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	port:'3306'
});

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));

sql.query("use nodejs");
//app.use('/img',express.static('img'));

//template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');
/*app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));*/


//routes and templates
app.get("/",function(req,res){
	//res.send("Esa é minha pagina principal");
	//res.sendFile(__dirname+"/index.html");
	//console.log(req.params.id)
	res.render('index');

});



app.get("/inserir",function(req,res){
     res.render("inserir");
});

app.get("/select/:id?",function(req,res){
	if(!req.params.id){
        sql.query("select * from usuario order by id asc",function(err, results,fields){
       	 res.render('select',{data:results});
       });
	}else{
		sql.query("select * from usuario where id=? order by id asc ",[req.params.id],function(err, results,fields){
       	 res.render('select',{data:results});
       });

	}
	
});

app.post("/controllerForm",urlencodeParser,function(req,res){
	sql.query("insert into usuario values (?,?,?)",[req.body.id,req.body.name,req.body.age]);
	res.render('controllerForm',{name:req.body.name});
});

app.get('/deletar/:id?',function(req,res){
   sql.query("delete from usuario where id=?",[req.params.id])
   res.render('deletar');
});

app.get("/update/:id",function(req,res){
	sql.query("select * from usuario where id=?",[req.params.id],function(err,results,fields){
		 res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
	});
});

app.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update usuario set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
    res.render('controllerUpdate');
});



//start server
app.listen(3000,function(req,res){
        console.log('Sucesso');
});



