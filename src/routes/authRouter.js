import express from 'express';

import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import { jwtSing, jwtVerify, verifyHandle } from '../utils/jwtHandle.js';

const router = express.Router();

router.post('/register', async (request, response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    phone,
    country,
    city,
    role,
  } = request.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return response.status(400).json({ email: 'Email already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
      country,
      city,
      role: role || 'user',
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    await User.updateOne({ _id: user._id });
    response.json({ ok: 'ok' });
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server error');
  }
});

router.get('/me', verifyHandle, async (request, response) => {
    try {
      
      const user = await User.findById(request.user.id).select('-password'); 
      if (!user) {
        return response.status(404).json({ msg: 'User not found' });
      }
  
      const userData = {
        city: user.city,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        _id: user._id,
      };
  
      response.json({ user: userData });
    } catch (error) {
      console.error(error.message);
      response.status(500).send('Server error');
    }
  });

router.post('/login', async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ email: 'Email not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid password' });
    }
    const payload = {
      id: user.id,
    };
    const token = jwtSing(payload);
    return response.json({
      token,
      user: {
        city: user.city,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/isuser', verifyHandle, async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.user.id });
    const userData = {
      city: user.city,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      _id: user._id,
    };

    return response.json({ user: userData });
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server error');
  }
});

router.get('/isuser/:id', async (request, response) => {
  try {
    const { id } = request.params;
    await generateNewWallet(id); //TODO: WHY?


    return response.json({ ok: 'ok' });
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server error');
  }
});

export default router;
