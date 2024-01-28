import mongoose from 'mongoose';

const { Schema } = mongoose;


const UserSchema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user', 'call_center'], 
    default: 'user'
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an Email!'],
    unique: [true, 'Email Exist'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    unique: false,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', UserSchema);