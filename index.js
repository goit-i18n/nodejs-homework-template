import app from './app.js'; // Asumând că app.js exportă instanța express configurată

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
