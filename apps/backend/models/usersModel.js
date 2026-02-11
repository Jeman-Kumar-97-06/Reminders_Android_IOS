import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const EnergyProfileSchema = new mongoose.Schema(
  {
    morning: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    afternoon: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    evening: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    wakeTimePreference: {
      type: String,
      default: "06:00",
    },

    energyProfile: {
      type: EnergyProfileSchema,
      default: () => ({}),
    },

    aiSettings: {
        sortMode: {
            type: String,
            enum: ["ai", "manual"],
            default: "ai",
        },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

//
// 🔐 SIGNUP
//
UserSchema.statics.signup = async function (name, email, pwd) {
  if (!name || !email || !pwd) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }

  if (!validator.isStrongPassword(pwd)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
  });

  return user;
};

//
// 🔐 LOGIN
//
UserSchema.statics.login = async function (email, pwd) {
  if (!email || !pwd) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }

  const match = await bcrypt.compare(pwd, user.password);
  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

//
// 🧼 Hide password in responses
//
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("ReminderUser", UserSchema);
