import { truncate } from 'fs';
import moongoose, { Mongoose } from 'mongoose';

const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
});

const User = Mongoose.model('user', UserSchema);

export default User;