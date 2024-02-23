import { Request, NextFunction, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //console.log("Hi from validator");
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
  };
};
export const loginValidator = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage(
      "Password is required and should contain at least 6 characters"
    ),
  body("email").trim().isEmail().withMessage("Email is required"),
];
export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator,
];

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message cannot be empty."),
];
