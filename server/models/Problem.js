import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Easy", "Medium", "Hard"],
        required: true,
    },
    Topic: {
        type: String,
        enum: ["Array", "String", "Math", "Dynamic Programming", "Tree", "Graph", "Greedy", "Stack", "Queue", "Hash Table", "Heap", "Binary Search", "Binary Tree", "Binary Search Tree", "Binary Indexed Tree", "Segment Tree", "Trie", "Union Find", "Disjoint Set", "Binary Search Tree", "Binary Indexed Tree", "Segment Tree", "Trie", "Union Find", "Disjoint Set"],
        
    },
    tags: {
        type: [String],
        
    },
    constraints: {
        type: String,
        required: true,
    },
    sampleInput: {
        type: String,
        required: true,
    },
    sampleOutput: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
   companiesAskedIn: {
    type: [String],
    default: [],
   },
   
})
export default mongoose.model("Problem", problemSchema);