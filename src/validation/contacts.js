import Joi from 'joi';

export const validationBody = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(5).max(17),
  isFavourite: Joi.boolean(),
});

const bodyToVAlidate = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '0000000000',
  isFavourite: false,
};

const validationResult = validationBody.validate(bodyToVAlidate, {
  abortEarly: false,
});
if (validationResult.error) {
  console.error(validationResult.error.message);
} else {
  console.log(`GG WP`);
}

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid('male', 'female', 'other'),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});
