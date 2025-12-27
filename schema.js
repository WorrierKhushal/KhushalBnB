const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[A-Za-z\s]+$/)   // 🔥 NO NUMBERS ALLOWED
      .required()
      .messages({
        "string.empty": "Title is required",
        "string.min": "Title should be at least 3 characters long",
        "string.pattern.base": "Title should contain only letters"
      }),

    description: Joi.string()
      .trim()
      .min(10)
      .required()
      .messages({
        "string.empty": "Description is required",
        "string.min": "Description should be at least 10 characters"
      }),

    location: Joi.string()
      .trim()
      .pattern(/^[A-Za-z\s,]+$/)
      .required()
      .messages({
        "string.pattern.base": "Location should contain only letters",
        "string.empty": "Location is required"
      }),

    country: Joi.string()
      .trim()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "Country should contain only letters",
        "string.empty": "Country is required"
      }),

    price: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required"
      }),

    image: Joi.alternatives().try(
      Joi.object({
        filename: Joi.string().allow("", null),
        url: Joi.string().uri().allow("", null)
      }).allow(null),
      Joi.string().allow("", null)
    )
  }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required(),
    }).required(),
})