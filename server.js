const express = require("express");
const contactsRoutes = require("./routes/api/contacts");

const app = express();
app.use(express.json());

app.use("/api/contacts", contactsRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
