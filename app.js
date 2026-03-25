const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const financeRoutes = require('./routes/financeRoutes');
const supportRoutes = require('./routes/supportRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const staffRoutes = require('./routes/staffRoutes');
const projectRoutes = require('./routes/projectRoutes');
const missionRoutes = require('./routes/missionRoutes');
const roleRoutes = require('./routes/roleRoutes');
const luxuryItemRoutes = require('./routes/luxuryItemRoutes');
const accessPlanRoutes = require('./routes/accessPlanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const saasRoutes = require('./routes/saasRoutes');

const app = express();

// Middleware
app.use(
    cors({
        origin: [

            "http://localhost:5173",
            "https://your-live-domain.com",
            "https://zanezion.wenbear.online",
        ],
        credentials: true
    })
);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/concierge/luxury-items', luxuryItemRoutes);
app.use('/api/saas/plans', accessPlanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/saas/requests', saasRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ZaneZion Institutional Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
