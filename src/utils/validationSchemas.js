const yup = require('yup');

const AUTHOR_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  email: yup.string().email().required(),
});

const CUSTOMER_VALIDATION_SCHEMA = yup.object().shape({
  full_name: yup.string().trim().min(2).max(30).required(),
  email: yup.string().email().required(),
  phone: yup.string().nullable(),
  password: yup.string().required(),
});

const BOOK_VALIDATION_SCHEMA = yup.object().shape({
  title: yup.string().trim().min(2).max(30).required(),
  genre: yup.string().required(),
  shelves: yup.string().required(),
  description: yup.string(),
  image: yup.string().nullable(),
});

module.exports = {
  AUTHOR_VALIDATION_SCHEMA,
  CUSTOMER_VALIDATION_SCHEMA,
  BOOK_VALIDATION_SCHEMA,
};
