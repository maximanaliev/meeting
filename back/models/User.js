const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nanoid = require("nanoid");

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                if (!this.isModified('email')) return true;
                const user = await User.findOne({email: value});
                if (user) throw new Error('Пользователь с таким email уже существует');
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function () {
                if (this.password.length < 6) {
                    throw new Error("Пароль дожен содержать не менее 6 символов");
                }
            }
        },
    },
    username: {
        type: String,
        required: true,
        validate: {
            validator: async function () {
                if (this.username.length < 3) {
                    throw new Error("Имя пользователя должно содержать не менее 3-х символов");
                }
            }
        },
    },
    token: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

UserSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();

});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;