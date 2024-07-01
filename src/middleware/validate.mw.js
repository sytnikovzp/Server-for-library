const yup = require('yup');

const { AUTHOR_VALIDATION_SCHEMA } = require('../utils/validationSchemas');

module.exports.validateAuthor = async (req, res, next) => {
  const { body } = req;
  try {
    const validatedAuthor = await AUTHOR_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });
    req.body = validatedAuthor;
    next();
  } catch (error) {
    console.log(error.errors);
    next(`Error IS: ${error.errors}`);
  }
};
