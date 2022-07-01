const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const CategoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const Categories = await Category.find();
      res.json(Categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const image = req.file.filename;

      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "This category already exists." });

      const newCategory = new Category({ name, image });
      await newCategory.save();
      res.json({ msg: "Category is added" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id).then((docs) => {
        docs.products.forEach(async (element) => {
          await Product.findByIdAndDelete(element._id);

          await Customer.find({ "cart.product": element._id }).then(
            async (docs) => {
              for (let i = 0; i < docs.length; i++) {
                await Customer.findByIdAndUpdate(
                  docs[i]._id,
                  {
                    $pull: { cart: { product: element._id } },
                  },
                  { safe: true, multi: true }
                );
              }
            }
          );
        });
      });
      res.json({ msg: "Category is Deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const image = req.file.filename;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name, image });

      res.json({ msg: "Category is updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = CategoryCtrl;
