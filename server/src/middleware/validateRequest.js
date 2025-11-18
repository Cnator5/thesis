// src/middleware/validateRequest.js
const validateRequest = (schema) => async (req, res, next) => {
  try {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };
    const value = await schema.validateAsync(
      { body: req.body, params: req.params, query: req.query },
      options
    );

    req.body = value.body ?? req.body;
    req.params = value.params ?? req.params;
    req.query = value.query ?? req.query;

    next();
  } catch (err) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.details?.map((detail) => detail.message.replace(/['"]/g, "")) ?? []
    });
  }
};

export default validateRequest;