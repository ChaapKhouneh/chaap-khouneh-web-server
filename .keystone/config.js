"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_path = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));

// assets/js/random.ts
function createRandomString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// schema.ts
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");

// assets/js/enums.ts
var ORDER_STATE = /* @__PURE__ */ ((ORDER_STATE2) => {
  ORDER_STATE2[ORDER_STATE2["WAITING_FOR_PAYMENT"] = 0] = "WAITING_FOR_PAYMENT";
  ORDER_STATE2[ORDER_STATE2["PAYED"] = 1] = "PAYED";
  ORDER_STATE2[ORDER_STATE2["PAYMENT_EXPIRED"] = 2] = "PAYMENT_EXPIRED";
  ORDER_STATE2[ORDER_STATE2["IN_HAND"] = 3] = "IN_HAND";
  ORDER_STATE2[ORDER_STATE2["SENT"] = 4] = "SENT";
  ORDER_STATE2[ORDER_STATE2["RECEIVED"] = 5] = "RECEIVED";
  return ORDER_STATE2;
})(ORDER_STATE || {});
var PAGE_SIZE = /* @__PURE__ */ ((PAGE_SIZE2) => {
  PAGE_SIZE2[PAGE_SIZE2["A5"] = 0] = "A5";
  PAGE_SIZE2[PAGE_SIZE2["A4"] = 1] = "A4";
  PAGE_SIZE2[PAGE_SIZE2["A3"] = 2] = "A3";
  return PAGE_SIZE2;
})(PAGE_SIZE || {});
var COLOR_MODE = /* @__PURE__ */ ((COLOR_MODE2) => {
  COLOR_MODE2[COLOR_MODE2["BLACK_WHITE_LASER"] = 0] = "BLACK_WHITE_LASER";
  COLOR_MODE2[COLOR_MODE2["COLOR_LASER"] = 1] = "COLOR_LASER";
  COLOR_MODE2[COLOR_MODE2["COLOR_INK"] = 2] = "COLOR_INK";
  COLOR_MODE2[COLOR_MODE2["COLOR_DIGITAL"] = 3] = "COLOR_DIGITAL";
  return COLOR_MODE2;
})(COLOR_MODE || {});

// assets/js/file.ts
var import_fs = __toESM(require("fs"));
function getFilesizeInBytes(filename) {
  var stats = import_fs.default.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

// schema.ts
var soap = __toESM(require("soap"));
var lists = {
  User: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    }
  }),
  Post: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our Post list
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // with this field, you can set a User as the author for a Post
      author: (0, import_fields.relationship)({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true
        },
        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false
      }),
      // with this field, you can add some Tags to Posts
      tags: (0, import_fields.relationship)({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",
        // a Post can have many Tags, not just one
        many: true,
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      })
    }
  }),
  // this last list is our Tag list, it only has a name field for now
  Tag: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true
    },
    // this is the fields for our Tag list
    fields: {
      name: (0, import_fields.text)(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: (0, import_fields.relationship)({ ref: "Post.tags", many: true })
    }
  }),
  Order: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0631\u062F\u0627\u062E\u062A", value: ORDER_STATE[0 /* WAITING_FOR_PAYMENT */] },
          { label: "\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647", value: ORDER_STATE[1 /* PAYED */] },
          { label: "\u067E\u0631\u062F\u0627\u062E\u062A \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647", value: ORDER_STATE[2 /* PAYMENT_EXPIRED */] },
          { label: "\u062F\u0631 \u062F\u0633\u062A", value: ORDER_STATE[3 /* IN_HAND */] },
          { label: "\u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647", value: ORDER_STATE[4 /* SENT */] },
          { label: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F\u0647", value: ORDER_STATE[5 /* RECEIVED */] }
        ],
        defaultValue: ORDER_STATE[0 /* WAITING_FOR_PAYMENT */],
        // db: { map: 'my_select' },
        validation: { isRequired: true },
        isIndexed: true,
        ui: { displayMode: "select" }
      }),
      paymentAuthority: (0, import_fields.bigInt)(),
      totalPrice: (0, import_fields.integer)(),
      AddressInfo: (0, import_fields.relationship)({ ref: "AddressInfo.Order", many: false }),
      Files: (0, import_fields.relationship)({ ref: "File.Order", many: true }),
      ParsianPaymentInfo: (0, import_fields.relationship)({ ref: "ParsianPaymentInfo.Order", many: false })
    },
    hooks: {
      resolveInput: async ({ resolvedData, context }) => {
        resolvedData.paymentAuthority = BigInt(Date.now());
        console.log(process.env.NODE_ENV);
        let createResponse;
        if (process.env.NODE_ENV === "production") {
          const parsianURL = "https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl";
          const soapClient = await soap.createClientAsync(parsianURL);
          const soapResponse = await soapClient.SalePaymentRequestAsync({
            requestData: {
              LoginAccount: "1cVFr74Se4m8yHO0fAjW",
              OrderId: resolvedData.paymentAuthority,
              // paymentAuthority
              Amount: resolvedData.totalPrice ?? 0 * 10,
              CallBackUrl: "https://chaapkhouneh.ir/api/payment-callback",
              AdditionalData: "",
              Originator: resolvedData.AddressInfo?.create?.fullName
            }
          });
          createResponse = soapResponse[0].SalePaymentRequestResult;
        } else {
          createResponse = { Token: 261577301770039, Message: "\u0639\u0645\u0644\u06CC\u0627\u062A \u0645\u0648\u0641\u0642", Status: 0 };
        }
        console.log({
          createResponse
        });
        if (createResponse.Status != 0) {
          throw new Error(createResponse.Message);
        }
        resolvedData.ParsianPaymentInfo = {
          create: {
            createResponseMessage: createResponse.Message,
            createResponseStatus: createResponse.Status,
            createResponseToken: createResponse.Token
          }
        };
        return resolvedData;
      }
    }
  }),
  File: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      bounding: (0, import_fields.checkbox)(),
      colorMode: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "\u0633\u06CC\u0627\u0647 \u0648 \u0633\u0641\u06CC\u062F \u0644\u06CC\u0632\u0631\u06CC", value: COLOR_MODE[0 /* BLACK_WHITE_LASER */] },
          { label: "\u0631\u0646\u06AF\u06CC \u0644\u06CC\u0632\u0631\u06CC", value: COLOR_MODE[1 /* COLOR_LASER */] },
          { label: "\u0631\u0646\u06AF\u06CC \u062C\u0648\u0647\u0631 \u0627\u0641\u0634\u0627\u0646", value: COLOR_MODE[2 /* COLOR_INK */] },
          { label: "\u0631\u0646\u06AF\u06CC \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644", value: COLOR_MODE[3 /* COLOR_DIGITAL */] }
        ],
        defaultValue: COLOR_MODE[0 /* BLACK_WHITE_LASER */],
        // db: { map: 'my_select' },
        validation: { isRequired: true },
        isIndexed: true,
        ui: { displayMode: "select" }
      }),
      data: (0, import_fields.file)({ storage: "fileStorage" }),
      dataAsBase64: (0, import_fields.text)(),
      description: (0, import_fields.text)(),
      double: (0, import_fields.checkbox)(),
      name: (0, import_fields.text)(),
      pageCount: (0, import_fields.integer)(),
      pageSize: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "A5", value: PAGE_SIZE[0 /* A5 */] },
          { label: "A4", value: PAGE_SIZE[1 /* A4 */] },
          { label: "A3", value: PAGE_SIZE[2 /* A3 */] }
        ],
        defaultValue: PAGE_SIZE[1 /* A4 */],
        // db: { map: 'my_select' },
        validation: { isRequired: true },
        isIndexed: true,
        ui: { displayMode: "select" }
      }),
      series: (0, import_fields.integer)(),
      size: (0, import_fields.integer)(),
      type: (0, import_fields.text)(),
      Order: (0, import_fields.relationship)({ ref: "Order.Files", many: false })
    },
    hooks: {
      resolveInput: ({ resolvedData }) => {
        const { name, dataAsBase64, data } = resolvedData;
        if (dataAsBase64) {
          const validBase64 = dataAsBase64.split(",")[1];
          const uniqueName = name.replace(/(\.[\w\d_-]+)$/i, `_${createRandomString(7)}$1`);
          const address = import_path.default.join(process.cwd(), "public/files", uniqueName);
          import_fs2.default.writeFileSync(address, validBase64, "base64");
          data.filename = uniqueName;
          data.filesize = getFilesizeInBytes(address);
          resolvedData.dataAsBase64 = "";
        }
        return resolvedData;
      }
    }
  }),
  AddressInfo: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      fullName: (0, import_fields.text)(),
      city: (0, import_fields.text)(),
      mobileNumber: (0, import_fields.text)(),
      postalAddress: (0, import_fields.text)(),
      postalCode: (0, import_fields.text)(),
      province: (0, import_fields.text)(),
      Order: (0, import_fields.relationship)({ ref: "Order.AddressInfo", many: false })
    }
  }),
  ParsianPaymentInfo: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      //#region create
      createResponseStatus: (0, import_fields.integer)(),
      createResponseMessage: (0, import_fields.text)(),
      createResponseToken: (0, import_fields.bigInt)(),
      // this is long number but mentioned as text
      //#endregion
      //#region callback
      callbackToken: (0, import_fields.bigInt)(),
      callbackOrderId: (0, import_fields.text)(),
      callbackTerminalNumber: (0, import_fields.bigInt)(),
      // status = 0 and RRN > 0 || status = -138
      callbackRRN: (0, import_fields.bigInt)(),
      callbackStatus: (0, import_fields.integer)(),
      callbackAmountAsString: (0, import_fields.text)(),
      callbackCardNumberHashed: (0, import_fields.text)(),
      callbackAmount: (0, import_fields.bigInt)(),
      //#endregion
      //#region confirm
      confirmResponseStatus: (0, import_fields.integer)(),
      confirmResponseCardNumberMasked: (0, import_fields.text)(),
      confirmResponseToken: (0, import_fields.bigInt)(),
      confirmResponseRRN: (0, import_fields.bigInt)(),
      //#endregion
      //#region reversal
      reversalResponseStatus: (0, import_fields.integer)(),
      reversalResponseMessage: (0, import_fields.text)(),
      reversalResponseToken: (0, import_fields.bigInt)(),
      //#endregion
      Order: (0, import_fields.relationship)({ ref: "Order.ParsianPaymentInfo", many: false })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var import_express = __toESM(require("express"));
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./data/app.db"
    },
    lists,
    session,
    server: {
      port: 8080,
      extendExpressApp: (app) => {
        app.use(import_express.default.json({ limit: "1gb" }));
        app.use(import_express.default.urlencoded({ limit: "1gb" }));
      }
      // maxFileSize: 25_000_000,
    },
    graphql: {
      playground: true
    },
    storage: {
      fileStorage: {
        kind: "local",
        type: "file",
        generateUrl: (path2) => `https://chaapkhouneh.ir/files${path2}`,
        serverRoute: {
          path: "/files"
        },
        storagePath: "public/files"
      }
    }
  })
);
//# sourceMappingURL=config.js.map
