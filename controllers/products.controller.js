const Product = require ('../models/Product');



// lista todos los productos
const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products); 
    }catch (error){
        res.status(500).json({message:'Error getting products', error: error.message});
    }
};
// obtener un producto por su ID
const getProductById = async (req, res) =>{
    try{
        const products = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    }catch (error){
        res.status(500).json({message: 'Error getting product', error : error.message});
    }
};

// Crear un producto (solo admin)
const createProduct = async (req , res ) => {
    try{
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    }catch (error){
        res.status(400).json({message: 'Error creating product', error : error.message});
    }
};

// actualizar un producto (solo admin)

const updateProduct = async (req , res) =>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if (!product){
            return res.status (404).json({message:'Product not found'});
        }
        res.json(product);
    } catch(error){
        res.status(400).json({message:'Error Updating product', error: error.message}) 
    }
    
};
// eliminar un producto (solo admin)

const deleteProduct = async (req , res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }
        res.json8({message: 'Product deleted successfully'});
    }catch (error){
        res.status(500).json({message:'Error deleting product, error: error.message'})
    }
};

module.exports={
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}