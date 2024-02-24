import { RequestHandler, Request, Response } from "express";
import Cakes from "../models/cakemodel"; // Import cake models
import Cart from "../models/cartmodel";
import { ZodError } from "zod";
import { Op } from "sequelize";

import { validationSchemas } from "../validation/validate";

const { cakeSchema } = validationSchemas;
import { authorize } from "../middleware/authorize";

interface AuthRequest extends Request {
  user?: { userID: string; isAdmin: boolean }; // Add the user property
}

// Define the interface for the AJAX request body (price filtering functionality)
interface FilterRequest extends Request {
  body: {
    priceRange: number;
  };
}

export const findAllCakes: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const cakes = await Cakes.findAll();

    const userInfo = req.cookies.user ? await req.cookies.user : "";

    console.log(userInfo);

    res.locals.userDetails = userInfo !== "" ? JSON.parse(userInfo) : "";

    const userCart =
      userInfo !== ""
        ? await Cart.findAll({
            where: { userID: JSON.parse(userInfo).userID },
          })
        : null;

    res.locals.userCart = userCart;

    console.log(userCart);

    res.render("all-products", { cakes, currentPage: "index" });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        status: "failed",
        message: "Validation errors",
        errors: formattedErrors,
      });
    } else {
      console.error("Error fetching cakes:", error);
      res.status(500).json({ message: "Failed to fetch cakes", error });
    }
  }
};

export const getCakeById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const cakeID = req.params.id;
    const cake = await Cakes.findByPk(cakeID);

    const userInfo = req.cookies.user ? await req.cookies.user : "";

    res.locals.userDetails = userInfo !== "" ? JSON.parse(userInfo) : "";

    const userCart =
      userInfo !== ""
        ? await Cart.findAll({
            where: { userID: JSON.parse(userInfo).userID },
          })
        : null;

    res.locals.userCart = userCart;

    if (!cake) {
      return res.status(404).json({ message: "Cake Not Found" });
    }

    // res.status(200).json({ status: 'success', cake });
    res.status(200).render("product-detail", {
      cake,
      currentPage: "product-detail",
      successMessage: null,
    });
  } catch (error) {
    console.error("Error fetching cake:", error);
    res.status(500).json({ message: "Failed to fetch cake", error });
  }
};

export const getCakesByCategory: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryID = req.params.categoryid;

    const userInfo = await req.cookies.user;
    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    // Find cakes by category ID
    const cakes = await Cakes.findAll({
      where: { category: categoryID },
    });

    if (!cakes) {
      // res.json({ status: "successful", message: "No cakes in this category"})
      res.render("products", {
        message: "no cakes available in this category",
      });
    }

    res.render("products", { cakes, currentPage: "products" });
  } catch (error) {
    console.error("Error fetching cakes by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const filterCakesByPrice: RequestHandler = async (
  req: FilterRequest,
  res: Response
) => {
  try {
    const { priceRange } = req.body;

    const userInfo = await req.cookies.user;
    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    // Implement logic to filter cakes based on the price range
    const filteredCakes = await Cakes.findAll({
      where: {
        price: {
          [Op.lte]: priceRange, // Assuming you want cakes with price less than or equal to the selected range
        },
      },
    });

    // Render the filtered cakes on the page
    res.render("products", { cakes: filteredCakes, currentPage: "products" });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Helper function to handle errors in the controller
const handleControllerError = (error: any, res: Response) => {
  console.error("Error in controller:", error);
  res.status(500).json({ message: "Internal Server Error", error });
};
