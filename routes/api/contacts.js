const express = require('express');
const path = require("path");
const fs = require("fs").promises;
const router = express.Router()
const Joi = require('joi');

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
});

const dataFile = path.join(__dirname, "../../models", "contacts.json");

const readData = () => 
  new Promise((resolve, reject) => {
    fs.readFile(dataFile, "utf-8")
      .then(data => resolve(JSON.parse(data)))
      .catch(err => reject(err));
  });


const writeData = (data) => 
  new Promise((resolve, reject) => {
    fs.writeFile(dataFile, JSON.stringify(data, null, 4), "utf-8")
      .then(() => resolve())
      .catch(err => reject(err));
  });
  
  const updateContact = async (contactId, updateData) => {
    const data = await readData();
    const index = data.findIndex(c => c.id === contactId);

    if (index !== -1) {
      if (updateData.name) {
        data[index].name = updateData.name;
      }
      if (updateData.email) {
        data[index].email = updateData.email;
      }
      if (updateData.phone) {
        data[index].phone = updateData.phone;
      }

      await writeData(data);
      return data[index]; 
    } else {
      return null; 
    }
  };
  

router.get('/', async (req, res, next) => {
try {
  const data = await readData();
  res.status(200).json(data);

} catch (err) {
  console.error(err)
  res.status(500).json( {error: "Internal Server Error" } );
}
 
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const data = await readData();
    const contact = data.find(c => c.id === req.params.contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/', async (req, res) => {
  try {

    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const data = await readData();
    const newItem = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };
    data.push(newItem);
    await writeData(data);
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const data = await readData();
    const index = data.findIndex(c => c.id === req.params.contactId);
    if (index !== -1) {
      data.splice(index, 1);
      await writeData(data)
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.put('/:contactId', async (req, res) => {
  try {
    const { error } = putSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const updatedContact = await updateContact(req.params.contactId, {
      name,
      email,
      phone
    });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
