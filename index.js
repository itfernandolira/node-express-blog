const express = require("express");
const app = express();
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./users/User");

//database
//CREATE database `blog` DEFAULT CHARACTER SET utf8 ;
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com a base de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// Instrução para o Express usar o EJS como View engine
app.set('view engine','ejs');

//Express-session
app.use(session({
    secret: "qualquercoisa", 
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 300000 }
}))


app.use(express.static('public'));

// Body parser
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/",categoriesController);    
app.use("/",articlesController);
app.use("/",usersController);

app.get("/session",function(req,res){
    req.session.nome="Fernando";
    req.session.ano="1974";
    req.session.user= {
        username: "flira",
        email:"it.fernandolira@gmail.com",
        id:5
    }
    res.send("Ok");
});

app.get("/leitura",function(req,res){
    res.json({nome: req.session});
});

app.get("/",function(req,res){
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        }, include: Article
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})

app.listen(4000,()=>{console.log("Servidor ativo!");});