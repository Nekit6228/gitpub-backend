import mongoose, { isValidObjectId } from "mongoose";

const { Types } = mongoose;
const COLLECTION = "tasks";

export async function create(ownerId, data) {
  const col = mongoose.connection.collection(COLLECTION);
  const now = new Date();

  const doc = {
    owner: new Types.ObjectId(ownerId),
    title: data.title,
    description: data.description || "",
    status: data.status || "todo",            // "todo" | "in_progress" | "done"
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  await col.insertOne(doc);
  return doc;
}

export async function list(ownerId, { status, page = 1, limit = 20 }) {
  const col = mongoose.connection.collection(COLLECTION);
  const filter = { owner: new Types.ObjectId(ownerId) };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const cursor = col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const [items, total] = await Promise.all([cursor.toArray(), col.countDocuments(filter)]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

export async function updateStatus(ownerId, id, status) {
  if (!isValidObjectId(id)) return { invalidId: true };

  const col = mongoose.connection.collection(COLLECTION);
  const _id = new Types.ObjectId(id);

  const res = await col.findOneAndUpdate(
    { _id, owner: new Types.ObjectId(ownerId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return res.value;
}
