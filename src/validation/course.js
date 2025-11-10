const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().optional(),
  isPublished: Joi.boolean().default(false)
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional(),
  isPublished: Joi.boolean().optional()
});

module.exports = { createCourseSchema, updateCourseSchema };


