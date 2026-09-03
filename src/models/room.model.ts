import mongoose, { Schema, model, models } from "mongoose";

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Deluxe", "Suite", "Family", "Standard"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = models.Room || model("Room", RoomSchema);

export default Room;