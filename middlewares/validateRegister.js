import express from 'express';
import Joi from 'joi';

const userRegister = Joi.object({
    name: Joi.string().min(8).pattern(/^[a-zA-Z ]+$/).required().messages({
        'string.pattern.base': "Special characters and numbers are not allowed"
    }),
    password: Joi.string().min(8).max(14).required(),
    email: Joi.string().email({ maxDomainSegments: 2, tlds: { allow: ['com', 'gov', 'net'] } }).required(),
    mobile: Joi.number().integer().min(6200000000).max(9999999999),
}).unknown(true);

export function validateRegister(req, res,next) {
    const result = userRegister.validate(req.body);
    console.log(result);
    if(result.error) {
        return res.status(401).json({message:result.error.message});
    }
    else{ next() };
}