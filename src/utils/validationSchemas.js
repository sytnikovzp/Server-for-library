const yup = require('yup');

const AUTHOR_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  email: yup.string().email().required(),
});

const CUSTOMER_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  email: yup.string().email().required(),
  phone: yup.string(),
  password: yup.string().required(),
});

module.exports = {
  AUTHOR_VALIDATION_SCHEMA,
  CUSTOMER_VALIDATION_SCHEMA,
};
