const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status ;
    }
    
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex) {

        find.title = objectSearch.regex;

    }

    
    // Pagination

    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },

        req.query,

        countProducts
    );

    // End Pagination
    

    const products = await Product.find(find).sort( { position: "desc" } ).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Product", 
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });

};

module.exports.changeStatus = async (req, res) =>  {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });
   
    req.flash("success", "Update status sucessfully");

    res.redirect("back");
};

module.exports.changeMulti = async (req, res) =>  {
    
    const type = req.body.type;
    const ids = req.body.ids.split(", ")

    console.log(type);
    
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Update successfully ${ids.length} products`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Update successfully ${ids.length} products`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids }}, { 
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Update successfully ${ids.length} products`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
            }
            break;
        default:
            break;
    }

    res.redirect("back");
};

module.exports.deleteItem = async (req, res) =>  {
    
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true, 
        deletedAt: new Date()
    });

    res.redirect("back");
    
};

module.exports.create = async (req,res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add Product"
    });
};

module.exports.createPost = async (req,res) => {
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    
    if (req.body.position == "") {

        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;

    } else {

        req.body.position = parseInt(req.body.position);

    }

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
    
};


module.exports.edit = async (req,res) => {
   
    try {

        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit Product",
            product: product
        });

    } catch (error) {

        res.redirect(`${systemConfig.prefixAdmin}/products`);

    }

   
};

module.exports.editPatch = async (req,res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    try {

        await Product.updateOne( {_id: id}, req.body );
        req.flash("success", "Update successfully");

    } catch (error) {
         req.flash("Error", "Update failed");
    }

    res.redirect("back");
    
};

module.exports.detail = async (req,res) => {

    try {

        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });

    } catch (error) {

        res.redirect(`${systemConfig.prefixAdmin}/products`);
        
    }

};  

