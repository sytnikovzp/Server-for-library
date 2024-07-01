const yup = require('yup');

const { PERSON_VALIDATION_SCHEMA } = require('../utils/validationSchemas');

module.exports.validatePerson = async (req, res, next) => {
  const { body } = req;
  try {
    const validatedPerson = await PERSON_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });
    req.body = validatedPerson;
    next();
  } catch (error) {
    console.log(error.errors);
    next(`Error IS: ${error.errors}`);
  }
};
