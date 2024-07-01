const yup = require('yup');

const PERSON_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  email: yup.string().email().required(),
});

module.exports = {
  PERSON_VALIDATION_SCHEMA,
};
