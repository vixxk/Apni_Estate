import mongoose from "mongoose";

export const normalizeRoom = (id1, id2) => {
  const a = new mongoose.Types.ObjectId(id1);
  const b = new mongoose.Types.ObjectId(id2);
  if (a.toString() < b.toString()) {
    return { participantA: a, participantB: b, aIsFirst: true };
  }
  return { participantA: b, participantB: a, aIsFirst: false };
};
