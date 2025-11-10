const Joi = require('joi');

const createLectureSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  topic: Joi.string().optional(),
  lectureType: Joi.string().valid('Live', 'Recorded').default('Recorded'),
  youtubeUrl: Joi.string().uri().optional(),
  questions: Joi.array().items(Joi.string()).optional(),
  code: Joi.string().optional(),
  description: Joi.string().optional(),
  order: Joi.number().integer().min(1).default(1)
});

const updateLectureSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  topic: Joi.string().optional(),
  lectureType: Joi.string().valid('Live', 'Recorded').optional(),
  youtubeUrl: Joi.string().uri().optional(),
  questions: Joi.array().items(Joi.string()).optional(),
  code: Joi.string().optional(),
  description: Joi.string().optional(),
  order: Joi.number().integer().min(1).optional()
});

module.exports = { createLectureSchema, updateLectureSchema };


