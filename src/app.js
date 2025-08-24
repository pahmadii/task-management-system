const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)

app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
