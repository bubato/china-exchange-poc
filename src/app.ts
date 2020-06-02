import express, { NextFunction } from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import cors from "cors";
import multer from "multer";
import sanitize from "sanitize-filename";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import { check } from "express-validator";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load(
  path.join(__dirname, "./swagger/swagger.yaml")
);
const MongoStore = mongo(session);

// Controllers (route handlers)
import * as transactionController from "./controllers/api/transaction";
import * as accessController from "./controllers/api/access";
import * as paymentMethodController from "./controllers/api/paymentMethod";
import * as paymentAccountController from "./controllers/api/paymentAccount";
import * as userController from "./controllers/api/user";
import * as authController from "./controllers/api/authen";
import * as consumerWebhookController from "./controllers/api/consumerWebhook";
import * as superController from "./controllers/api/super";
import * as dashboardController from "./controllers/api/dasboard";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";
import * as authorizationConfig from "./config/authorization";
import * as validationConfig from "./config/checkValidation";
import * as superConfig from "./config/superUser";
import * as apiKeyConfig from "./config/apiKey";
import logger from "./util/logger";

// Create Express server
const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination: "dist/public/images/uploads",
    filename: (req, file, cb) => {
      cb(null, sanitize(file.originalname.replace(/\s/g, "-")));
    },
  }),
});
const qrUpload = upload.single("qrImage");
// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @deprecated
 * API api/accessToken
 */
app.get("/api/accessToken", accessController.getToken);

/**
 * API payment routes.
 */
app.get(
  "/api/admin/transactions",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  transactionController.getAllTransactions
);

app.get(
  "/api/customer/transactions",
  apiKeyConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("merchandiser"),
  transactionController.getCustomerTransactions
);

app.get(
  "/api/agency/transactions",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("agency"),
  transactionController.getAllTransactions
);

app.get(
  "/api/merchandiser/transactions",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("merchandiser"),
  transactionController.getMerchandiserTransactions
);

app.get(
  "/api/transactions/:id",
  passportConfig.isAuthenticated,
  transactionController.getTransactionStatus
);

app.post(
  "/api/transactions",
  apiKeyConfig.isAuthenticated,
  [
    check("amount").exists().isNumeric(),
    check("paymentType").exists().isString(),
    check("customerId").exists().isString(),
  ],
  validationConfig.checkValidation,
  authorizationConfig.isAuthorizeWithRole("merchandiser"),
  transactionController.createTransaction
);

app.put(
  "/api/transactions/:id/submit",
  [check("senderAccountInfo").optional().isString()],
  validationConfig.checkValidation,
  apiKeyConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("merchandiser"),
  transactionController.submitTransaction
);

app.put(
  "/api/transactions/:id/approve",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  transactionController.approveTransaction
);

app.put(
  "/api/transactions/:id/reject",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  transactionController.rejectTransaction
);

/**
 * API payment method routes
 */
app.get(
  "/api/payment-methods",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  paymentMethodController.getPaymentMethods
);

app.post(
  "/api/payment-methods",
  [check("name").exists()],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  paymentMethodController.postPaymentMethod
);

app.put(
  "/api/payment-methods/:id",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  paymentMethodController.editPaymentMethod
);

app.get(
  "/api/customer/payment-method-avaibilities",
  apiKeyConfig.isAuthenticated,
  paymentMethodController.getPaymentMethodAvaibilities
);

/**
 * API payment account
 */
app.get(
  "/api/payment-accounts",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  paymentAccountController.getPaymentAccounts
);

app.post(
  "/api/payment-accounts",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  qrUpload,
  paymentAccountController.postPaymentAccount
);

/**
 * API for authentication
 */

app.post(
  "/api/login",
  [check("username").exists(), check("password").exists()],
  validationConfig.checkValidation,
  authController.postLogin
);

app.get(
  "/api/current_user",
  passportConfig.isAuthenticated,
  authController.getCurrentUser
);

app.get(
  "/api/customer/current_merchandiser",
  apiKeyConfig.isAuthenticated,
  authController.getCurrentUser
);

/**
 * API for admin, use to manage users
 */
app.post(
  "/api/users",
  [
    check("username").exists(),
    check("password").exists(),
    check("fullName").exists(),
  ],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  userController.addUser
);

app.put(
  "/api/users/:id/add_roles",
  [check("roles").isArray().exists()],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  userController.addRoles
);

app.put(
  "/api/users/:id/remove_roles",
  [check("roles").isArray().exists()],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  userController.removeRoles
);

/**
 * API for consumer Webhook
 */

app.get(
  "/api/admin/consumerWebhooks",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  consumerWebhookController.getAllConsumerWebhooks
);

app.post(
  "/api/admin/consumerWebhooks",
  [
    // eslint-disable-next-line @typescript-eslint/camelcase
    check("url").isURL({ require_tld: false }).exists(),
    check("userId").isString().exists(),
  ],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  consumerWebhookController.addConsumerWebhook
);

app.put(
  "/api/admin/consumerWebhooks/:id",
  [
    // eslint-disable-next-line @typescript-eslint/camelcase
    check("url").optional().isURL({ require_tld: false }),
    check("userId").optional().isString(),
  ],
  validationConfig.checkValidation,
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  consumerWebhookController.editConsumerWebhook
);

app.delete(
  "/api/admin/consumerWebhooks/:id",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  consumerWebhookController.deleteConsumerWebhook
);

/**
 * API for dashboard
 */

app.get(
  "/api/agency/dashboard",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("agency"),
  dashboardController.getAgencyDashboard
);

app.get(
  "/api/admin/dashboard",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("admin"),
  dashboardController.getAdminDashboard
);

app.get(
  "/api/merchandiser/dashboard",
  passportConfig.isAuthenticated,
  authorizationConfig.isAuthorizeWithRole("merchandiser"),
  dashboardController.getMerchandiserDashboard
);
/**
 * Echo API for webhook testing
 */
app.post("/api/webhook", (req: express.Request, res: express.Response) => {
  logger.info(`webhook: received ${JSON.stringify(req.body)}`);
  res.status(200).json(req.body);
});

/**
 * API for super user
 */

app.post("/api/su/seed", superConfig.verifySuperUser, superController.seedUser);

/**
 * Wildcard route for react-router
 */
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

export default app;
