import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  preferences: {
    type: Object,
    default: () => ({ genres: {}, languages: {}, providers: {} })
  }
});

userSchema.methods.incrementPreference = function (type, key, amount = 1) {
  this.preferences = this.preferences || { genres: {}, languages: {}, providers: {} };
  this.preferences[type] = this.preferences[type] || {};
  this.preferences[type][key] = (this.preferences[type][key] || 0) + amount;
  return this.save();
};

export default mongoose.model("User", userSchema);
