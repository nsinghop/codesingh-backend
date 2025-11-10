const { sendError } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return sendError(res, error.details.map(d => d.message).join(', '), 400);
    }
    next();
  };
};

module.exports = { validate };


