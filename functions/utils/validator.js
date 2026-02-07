const Joi = require("joi");

/**
 * Email validation schema
 */
const emailSchema = Joi.object({
  to: Joi.alternatives().try(
      Joi.string().email().required(),
      Joi.array().items(Joi.string().email()).min(1).required(),
  ).required(),

  subject: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        "string.empty": "Subject cannot be empty",
        "string.max": "Subject must not exceed 500 characters",
      }),

  text: Joi.string()
      .min(1)
      .required()
      .messages({
        "string.empty": "Email text content cannot be empty",
      }),

  html: Joi.string()
      .optional()
      .allow(""),

  from: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "From must be a valid email address",
      }),

  replyTo: Joi.string()
      .email()
      .optional(),

  cc: Joi.alternatives().try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email()),
  ).optional(),

  bcc: Joi.alternatives().try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email()),
  ).optional(),
});

/**
 * Validate email data against schema
 * @param {Object} data - Email data to validate
 * @return {Object} Validation result
 */
function validateEmailData(data) {
  return emailSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  validateEmailData,
  emailSchema,
};
