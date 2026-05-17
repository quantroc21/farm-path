const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required" }).trim().min(1, "Password cannot be empty")
  })
});

module.exports = { loginSchema };
