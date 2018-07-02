const validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = validateRegisterInput = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.weight = !isEmpty(data.weight) ? data.weight : '';

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!validator.isLength(data.password, { min: 1, max: 8 })) {
    errors.password = 'Password must be less than 8 characters';
  }

  if (validator.isEmpty(data.weight)) {
    errors.weight = 'Weight field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};