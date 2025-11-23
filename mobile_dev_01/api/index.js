const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');

// Initialize Express app
const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
mongoose.connect("mongodb+srv://root:1234@cluster0.7yoe1.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

// Create HTTP server
const server = app.listen(port, () => {
    console.log("Server is running on port 8000");
});

// WebSocket Server
const wss = new WebSocket.Server({ server });
const clients = new Map();

wss.on('connection', (ws, req) => {
    console.log('New WebSocket client connected');

    // Authenticate via query parameter or message
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const token = urlParams.get('token');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            clients.set(decoded.userId, ws);
            console.log(`User ${decoded.userId} authenticated via WebSocket`);
        } catch (err) {
            console.log('Invalid WebSocket token');
            ws.close();
        }
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'authenticate') {
                try {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'your-secret-key');
                    clients.set(decoded.userId, ws);
                    console.log(`User ${decoded.userId} authenticated`);
                } catch (err) {
                    console.log('Invalid authentication token');
                }
                return;
            }

            if (data.type === 'message') {
                const recipientWs = clients.get(data.to);
                if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                    recipientWs.send(JSON.stringify({
                        type: 'message',
                        from: data.from,
                        message: data.message,
                        timestamp: new Date().toISOString()
                    }));
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        for (let [userId, clientWs] of clients.entries()) {
            if (clientWs === ws) {
                clients.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// WebSocket helper function
function sendToUser(userId, data) {
    const clientWs = clients.get(userId);
    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(data));
    }
}

// Models
const Mechanic = require("./models/mechanic");
const User = require("./models/user");
const Order = require("./models/order");

// Utility Functions
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || "gamingguider77@gmail.com",
            pass: process.env.EMAIL_PASS || "ahnueyepvkppbgbi"
        }
    });

    const mailOptions = {
        from: "brakedownassistant.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your account: http://localhost:8000/verify/${verificationToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email:", error);
    }
};

const generateSecretKey = () => crypto.randomBytes(32).toString("hex");
const userSecretKey = generateSecretKey();
const mechanicSecretKey = generateSecretKey();

// Routes
app.get('/websocket-info', (req, res) => {
    res.json({
        message: 'Connect to ws://localhost:8000 for real-time communication',
        connectedClients: clients.size
    });
});

// User Registration
app.post("/register", async (req, res) => {
    try {
        const { name, address, idNo: id_no, mobileNo: mobile, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({ name, address, id_no, mobile, email, password });
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        await newUser.save();
        await sendVerificationEmail(newUser.email, newUser.verificationToken);
        
        res.status(201).json({ 
            message: "User registered successfully. Please verify your email.",
            userId: newUser._id
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Mechanic Registration
app.post("/mechanic_register", async (req, res) => {
    try {
        const { location, name, address, idNo: id_no, mobileNo: mobile, email, password } = req.body;

        const existingMechanic = await Mechanic.findOne({ email });
        if (existingMechanic) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newMechanic = new Mechanic({ location, name, address, id_no, mobile, email, password });
        newMechanic.verificationToken = crypto.randomBytes(20).toString("hex");

        await newMechanic.save();
        await sendVerificationEmail(newMechanic.email, newMechanic.verificationToken);
        
        res.status(201).json({ 
            message: "Mechanic registered successfully. Please verify your email.",
            mechanicId: newMechanic._id
        });

    } catch (error) {
        console.error("Error registering mechanic:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Email Verification
app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        // Check in both User and Mechanic collections
        let user = await User.findOne({ verificationToken: token });
        let userType = 'user';
        
        if (!user) {
            user = await Mechanic.findOne({ verificationToken: token });
            userType = 'mechanic';
            if (!user) {
                return res.status(404).json({ message: "Invalid verification token" });
            }
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ 
            message: "Email verified successfully",
            userType,
            userId: user._id
        });

    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Email verification failed" });
    }
});

// User Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const token = jwt.sign({ userId: user._id, role: 'user' }, userSecretKey, { expiresIn: '24h' });
        
        res.status(200).json({ 
            token, 
            userId: user._id,
            role: 'user'
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// Mechanic Login
app.post("/mechanic_login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const mechanic = await Mechanic.findOne({ email });
        if (!mechanic) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (mechanic.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!mechanic.verified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const token = jwt.sign({ userId: mechanic._id, role: 'mechanic' }, mechanicSecretKey, { expiresIn: '24h' });
        
        res.status(200).json({ 
            token, 
            userId: mechanic._id,
            role: 'mechanic'
        });

    } catch (error) {
        console.error("Mechanic login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// User Profile
app.get("/profile/:_id", async (req, res) => {
    try {
        const user = await User.findById(req.params._id).select('-password -verificationToken');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Mechanic Profile
app.get("/m_profile/:_id", async (req, res) => {
    try {
        const mechanic = await Mechanic.findById(req.params._id).select('-password -verificationToken');
        if (!mechanic) {
            return res.status(404).json({ message: "Mechanic not found" });
        }
        res.status(200).json(mechanic);
    } catch (error) {
        console.error("Error fetching mechanic profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Service Request Endpoint
app.post("/request-service", async (req, res) => {
    try {
        const { userId, mechanicId, problemDescription, location } = req.body;
        
        // Validate inputs
        if (!userId || !mechanicId || !problemDescription || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create new service request
        const newOrder = new Order({
            user: userId,
            mechanic: mechanicId,
            problemDescription,
            location,
            status: 'pending'
        });

        await newOrder.save();

        // Notify mechanic via WebSocket
        sendToUser(mechanicId, {
            type: 'service-request',
            orderId: newOrder._id,
            userId,
            problemDescription,
            location,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({ 
            message: "Service request created successfully",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("Error creating service request:", error);
        res.status(500).json({ message: "Failed to create service request" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});