const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required'),
  body('email')
    .isEmail().withMessage('Invalid email'),
  body('phone')
    .matches(/^\+?\d{10,15}$/).withMessage('Invalid phone number'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
  validate
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
validate
];

const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().matches(/^\+?\d{10,15}$/).withMessage('Invalid phone number'),
validate
];

const taskValidation = [
  body('name')
    .notEmpty().withMessage('Task name is required')
    .isLength({ max: 100 }).withMessage('Task name must be less than 100 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    validate  
];

const adminUpdateUserValidation = [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().matches(/^\+?\d{10,15}$/).withMessage('Invalid phone number'),
  validate
];

//validation برای تغییر role اضافه شد
const changeRoleValidation = [
  body('role')
    .notEmpty().withMessage('Role is required') // role اجباری شد
    .isIn(['user','admin']).withMessage('Invalid role'), // فقط user یا admin مجاز
  validate
];


const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter'),
  validate
];


module.exports={
  registerValidation,
  loginValidation,
  updateProfileValidation,
  taskValidation,
  adminUpdateUserValidation,
  changeRoleValidation,
  changePasswordValidation
}