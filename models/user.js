const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingPasswordError: "パスワードが与えられていません。",
        AttemptTooSoonError: "アカウントは現在ロックされています。後で再試行してください。",
        TooManyAttemptsError: "失敗したログイン試行回数が多すぎるため、アカウントがロックされました。",
        NoSaltValueStoredError: "認証に失敗しました。もう一度試してください。",
        IncorrectPasswordError: "パスワードまたはユーザー名が間違っています。",
        IncorrectUsernameError: "パスワードまたはユーザー名が間違っています。",
        UserExistsError: "指定されたユーザー名は既に登録されています。",
    },
});
module.exports = mongoose.model("User", userSchema);
