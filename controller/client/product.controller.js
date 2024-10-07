const Product = require("../../models/product.model");

module.exports.index = ( async (req, res) => {

    const products = await Product.find({
        deleted: false
    }).sort( { position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price - ((item.price * item.discountPercentage)/100)).toFixed(0);
        return item;
    })
    
    res.render("client/pages/products/index", {
        pageTitle: "List of products",
        products: newProducts
    });
    
});  

module.exports.detail =  async (req, res) => {


    try {

        const find = {
            deleted: false,
            slug: req.params.slug
        }
    
        const product = await Product.findOne(find);
    
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });

    } catch (error) {

        res.redirect(`/products`);
        
    }
    
    
};  