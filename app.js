const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./src/plugins/swagger');
const routes = require('./src/routes');
const swaggerAuth = require('./src/middleware/swaggerAuth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(specs));
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Main Routes
app.use('/api', routes);

// Root Route (สำหรับเช็คว่า Server ทำงาน)
app.get('/', (req, res) => {
    res.send('Hello from Hostinger Node.js App! Go to /api-docs for documentation.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
