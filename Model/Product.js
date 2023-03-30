import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Product Name"],
      maxlength: [100, "Name cannot be more than 100 Characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please Provide Product price"],
      default: 0,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 Characters"],
      required: [true, "Please Provide Product Description"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please Provide Product category"],
      enum: ["kitchen", "office", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please Provide Product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.pre("deleteOne", { document: true }, async function () {
  await this.model("Review").deleteMany({ product: this._id });
});

const Product = mongoose.model("Product", productSchema);

export default Product;
