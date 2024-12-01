const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt
const crypto = require('crypto');

const encryptionKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdbd" // Replace with a securely generated key
const algorithm = "aes-256-cbc"; 
const iv = crypto.randomBytes(16);
const UserSchema = new mongoose.Schema({
    p: { // This will hold the password
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    m: {
        type: String,
        required: true,
    },
    isverified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
    mobile: {
        type: String,
        set: encryptField
    },
    accounts: {
        type: Array,
        default: [],
    },
});

function encryptField(value) {
    if (!value) return value; // Handle empty values gracefully
   // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

function decryptField(value) {
    if (!value) return value;
    try {
        const [storedIv, encryptedData] = value.split(':');
        const decipher = crypto.createDecipheriv(algorithm, encryptionKey, Buffer.from(storedIv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        return value;
    }
}

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('p')) { // Only hash the password if it has been modified (or is new)
        try {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            this.p = await bcrypt.hash(this.p, salt); // Hash the password
            next(); // Proceed to save
        } catch (error) {
            next(error); // Pass error to next middleware
        }
    } else {
        next(); // If password is not modified, proceed without hashing
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.p);
};

module.exports = mongoose.model("User", UserSchema);