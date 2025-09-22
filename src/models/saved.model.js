import mongoose from 'mongoose';

const savedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    }
}, {
    timestamps: true
})

const Save = mongoose.model('Save', savedSchema);
export default Save;        