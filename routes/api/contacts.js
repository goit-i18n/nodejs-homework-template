const express = require('express');
const path = require("path");
const fs = require("fs").promises;

const router = express.Router()

const dataFile = path.join(__dirname, "../../models", "contacts.json");

const readData = () => 
  new Promise((resolve, reject) => {
    fs.readFile(dataFile, "utf-8")
      .then(data => resolve(JSON.parse(data)))
      .catch(err => reject(err));
  });


const writeData = (data) => 
  new Promise((resolve, reject) => {
    fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8")
      .then(data => resolve(data))
      .catch(err => reject(err));
  });


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

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
