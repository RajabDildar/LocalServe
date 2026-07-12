Create a new Mongoose model for: $ARGUMENTS

Follow these rules exactly:

1. File goes in server/src/models/$ModelName.ts
2. Create an IModelName interface that extends Document
3. Use const schema = new Schema({...}, { timestamps: true })
4. Add appropriate indexes as comments explaining why each index exists
5. Export both the interface and the model: export default mongoose.model<IModelName>('ModelName', schema)
6. Match the patterns in server/src/models/User.ts exactly

After creating the model, show me the complete file.
