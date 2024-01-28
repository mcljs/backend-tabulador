
import { User} from 'models-business';
import bcrypt from 'bcryptjs';

export class UserService {

  async register(args) {

    const { data, session } = args;

    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
      interest,
      country,
      city,
    } = data[0];
    let user = await User.findOne({ email }).session(session);
    if (user) {
      throw new Error('Email already exists');
    }

    const emailLower = email.toLowerCase();
    user = new User({
      firstName,
      lastName,
      email: emailLower,
      password,
      dateOfBirth,
      phone,
      interest,
      country,
      city,
      referralCode: referral,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    if (aoutoRef) user.referralCode = user._id;
    await user.save({ session });

    console.log(wll);
    await User.updateOne({ _id: user._id }, { session });
    return { message: 'ok' };
  }

  async getUserById(id) {
    const user = await User.findById(id).or([
      { deleteAt: null },
      { isBannded: false },
    ]);
    if (!user) throw new Error('User not found');
    return user;
  }
}
