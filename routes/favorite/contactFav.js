const Contact = require("../../service/contactDatabaseSchema");

async function updateStatusContact(contactId, { favorite }) {
    try {
        const contactStatus = await Contact.findById(contactId);
        if (!contactStatus) {
            throw new Error("Could not find contact");
        }
        contactStatus.favorite = favorite;
        await contactStatus.save();
        return contactStatus;
    } catch (error) {
        throw new Error(`Failed to update contact status: ${error.message}`);
    }
}

module.exports = { updateStatusContact };
