import mongoose  from 'mongoose';
const employeeSchema = new mongoose.Schema(
    {
        EID: {
            type: Number,
            required: true,
            index: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: String,
        email: { type: String, required: true, unique: true },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Non-binary', 'Genderqueer', 'Agender', 'Bigender', 'Genderfluid', 'Polygender'],
        },
        ip_address: String

    },
    { collection: "employees" },
); 

const Employee = mongoose.model("Employee", employeeSchema);

export { Employee };