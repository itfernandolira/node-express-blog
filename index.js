const express = require("express");
const app = express();
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");

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

app.get("/",function(req,res){
    Article.findAll().then(articles => {
        res.render("index", {articles: articles});
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
                res.render("article", {article: article});
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.listen(4000,()=>{console.log("Servidor ativo!");});