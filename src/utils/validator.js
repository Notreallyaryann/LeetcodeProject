const validator = require("validator");

const validate = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Request body missing or invalid");
    }

    // Mandatory fields
    const mandatoryField = ["firstName", "emailId", "password"];
    const missingFields = mandatoryField.filter((field) => !data.hasOwnProperty(field));

    if (missingFields.length > 0) {
        throw new Error("Missing fields: " + missingFields.join(", "));
    }

    // Validate email
    if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid Email");
    }

    // Validate password strength
    if (!validator.isStrongPassword(data.password)) {
        throw new Error("Weak password");
    }

    // Optional: You can validate age if present
    if (data.age && (data.age < 10 || data.age > 80)) {
        throw new Error("Age must be between 10 and 80");
    }
};

module.exports = validate;



