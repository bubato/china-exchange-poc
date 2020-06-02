"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const bluebird_1 = __importDefault(require("bluebird"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const secrets_1 = require("./util/secrets");
const express_validator_1 = require("express-validator");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, "./swagger/swagger.yaml"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
// Controllers (route handlers)
const transactionController = __importStar(require("./controllers/api/transaction"));
const accessController = __importStar(require("./controllers/api/access"));
const paymentMethodController = __importStar(require("./controllers/api/paymentMethod"));
const paymentAccountController = __importStar(require("./controllers/api/paymentAccount"));
const userController = __importStar(require("./controllers/api/user"));
const authController = __importStar(require("./controllers/api/authen"));
const consumerWebhookController = __importStar(require("./controllers/api/consumerWebhook"));
const superController = __importStar(require("./controllers/api/super"));
const dashboardController = __importStar(require("./controllers/api/dasboard"));
// API keys and Passport configuration
const passportConfig = __importStar(require("./config/passport"));
const authorizationConfig = __importStar(require("./config/authorization"));
const validationConfig = __importStar(require("./config/checkValidation"));
const superConfig = __importStar(require("./config/superUser"));
const apiKeyConfig = __importStar(require("./config/apiKey"));
const logger_1 = __importDefault(require("./util/logger"));
// Create Express server
const app = express_1.default();
const upload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: "dist/public/images/uploads",
        filename: (req, file, cb) => {
            cb(null, sanitize_filename_1.default(file.originalname.replace(/\s/g, "-")));
        },
    }),
});
const qrUpload = upload.single("qrImage");
// Connect to MongoDB
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default
    .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
})
    .catch((err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});
// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(cors_1.default());
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true,
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
app.use(lusca_1.default.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    else if (req.user && req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
/**
 * @deprecated
 * API api/accessToken
 */
app.get("/api/accessToken", accessController.getToken);
/**
 * API payment routes.
 */
app.get("/api/admin/transactions", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), transactionController.getAllTransactions);
app.get("/api/customer/transactions", apiKeyConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("merchandiser"), transactionController.getCustomerTransactions);
app.get("/api/agency/transactions", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("agency"), transactionController.getAllTransactions);
app.get("/api/merchandiser/transactions", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("merchandiser"), transactionController.getMerchandiserTransactions);
app.get("/api/transactions/:id", passportConfig.isAuthenticated, transactionController.getTransactionStatus);
app.post("/api/transactions", apiKeyConfig.isAuthenticated, [
    express_validator_1.check("amount").exists().isNumeric(),
    express_validator_1.check("paymentType").exists().isString(),
    express_validator_1.check("customerId").exists().isString(),
], validationConfig.checkValidation, authorizationConfig.isAuthorizeWithRole("merchandiser"), transactionController.createTransaction);
app.put("/api/transactions/:id/submit", [express_validator_1.check("senderAccountInfo").optional().isString()], validationConfig.checkValidation, apiKeyConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("merchandiser"), transactionController.submitTransaction);
app.put("/api/transactions/:id/approve", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), transactionController.approveTransaction);
app.put("/api/transactions/:id/reject", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), transactionController.rejectTransaction);
/**
 * API payment method routes
 */
app.get("/api/payment-methods", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), paymentMethodController.getPaymentMethods);
app.post("/api/payment-methods", [express_validator_1.check("name").exists()], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), paymentMethodController.postPaymentMethod);
app.put("/api/payment-methods/:id", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), paymentMethodController.editPaymentMethod);
app.get("/api/customer/payment-method-avaibilities", apiKeyConfig.isAuthenticated, paymentMethodController.getPaymentMethodAvaibilities);
/**
 * API payment account
 */
app.get("/api/payment-accounts", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), paymentAccountController.getPaymentAccounts);
app.post("/api/payment-accounts", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), qrUpload, paymentAccountController.postPaymentAccount);
/**
 * API for authentication
 */
app.post("/api/login", [express_validator_1.check("username").exists(), express_validator_1.check("password").exists()], validationConfig.checkValidation, authController.postLogin);
app.get("/api/current_user", passportConfig.isAuthenticated, authController.getCurrentUser);
app.get("/api/customer/current_merchandiser", apiKeyConfig.isAuthenticated, authController.getCurrentUser);
/**
 * API for admin, use to manage users
 */
app.post("/api/users", [
    express_validator_1.check("username").exists(),
    express_validator_1.check("password").exists(),
    express_validator_1.check("fullName").exists(),
], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), userController.addUser);
app.put("/api/users/:id/add_roles", [express_validator_1.check("roles").isArray().exists()], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), userController.addRoles);
app.put("/api/users/:id/remove_roles", [express_validator_1.check("roles").isArray().exists()], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), userController.removeRoles);
/**
 * API for consumer Webhook
 */
app.get("/api/admin/consumerWebhooks", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), consumerWebhookController.getAllConsumerWebhooks);
app.post("/api/admin/consumerWebhooks", [
    // eslint-disable-next-line @typescript-eslint/camelcase
    express_validator_1.check("url").isURL({ require_tld: false }).exists(),
    express_validator_1.check("userId").isString().exists(),
], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), consumerWebhookController.addConsumerWebhook);
app.put("/api/admin/consumerWebhooks/:id", [
    // eslint-disable-next-line @typescript-eslint/camelcase
    express_validator_1.check("url").optional().isURL({ require_tld: false }),
    express_validator_1.check("userId").optional().isString(),
], validationConfig.checkValidation, passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), consumerWebhookController.editConsumerWebhook);
app.delete("/api/admin/consumerWebhooks/:id", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), consumerWebhookController.deleteConsumerWebhook);
/**
 * API for dashboard
 */
app.get("/api/agency/dashboard", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("agency"), dashboardController.getAgencyDashboard);
app.get("/api/admin/dashboard", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("admin"), dashboardController.getAdminDashboard);
app.get("/api/merchandiser/dashboard", passportConfig.isAuthenticated, authorizationConfig.isAuthorizeWithRole("merchandiser"), dashboardController.getMerchandiserDashboard);
/**
 * Echo API for webhook testing
 */
app.post("/api/webhook", (req, res) => {
    logger_1.default.info(`webhook: received ${JSON.stringify(req.body)}`);
    res.status(200).json(req.body);
});
/**
 * API for super user
 */
app.post("/api/su/seed", superConfig.verifySuperUser, superController.seedUser);
/**
 * Wildcard route for react-router
 */
app.get("*", (req, res) => res.sendFile(path_1.default.join(__dirname, "public", "index.html")));
exports.default = app;
//# sourceMappingURL=app.js.map