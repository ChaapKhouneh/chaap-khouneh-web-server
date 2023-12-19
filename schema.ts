// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import path from 'path';
import fs from 'fs';
import { createRandomString } from './assets/js/random';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  checkbox,
  file,
  integer,
  bigInt,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';
import { COLOR_MODE, ORDER_STATE, PAGE_SIZE } from './assets/js/enums';
import { getFilesizeInBytes } from './assets/js/file';
import * as soap from 'soap';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({ ref: 'Post.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.posts',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: 'Tag.posts',

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),

  Order: list({
    access: allowAll,
    fields: {
      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'در انتظار پرداخت', value: ORDER_STATE[ORDER_STATE.WAITING_FOR_PAYMENT], },
          { label: 'پرداخت شده', value: ORDER_STATE[ORDER_STATE.PAYED], },
          { label: 'پرداخت منقضی شده', value: ORDER_STATE[ORDER_STATE.PAYMENT_EXPIRED], },
          { label: 'در دست', value: ORDER_STATE[ORDER_STATE.IN_HAND], },
          { label: 'ارسال شده', value: ORDER_STATE[ORDER_STATE.SENT], },
          { label: 'دریافت شده', value: ORDER_STATE[ORDER_STATE.RECEIVED], },
        ],
        defaultValue: ORDER_STATE[ORDER_STATE.WAITING_FOR_PAYMENT],
        // db: { map: 'my_select' },
        validation: { isRequired: true, },
        isIndexed: true,
        ui: { displayMode: 'select' },
      }),
      paymentAuthority: bigInt(),
      totalPrice: integer(),
      AddressInfo: relationship({ ref: 'AddressInfo.Order', many: false }),
      Files: relationship({ ref: 'File.Order', many: true }),
      ParsianPaymentInfo: relationship({ ref: 'ParsianPaymentInfo.Order', many: false }),
    },
    hooks: {
      resolveInput: async ({ resolvedData, context }) => {
        // const sudoContext = context.sudo();
        // const lastPaymentAuthority = (await sudoContext.db.Order.findMany({
        //   orderBy: {
        //     paymentAuthority: 'desc',
        //   },
        //   take: 1,
        // }))[0]?.paymentAuthority;
        // resolvedData.paymentAuthority = lastPaymentAuthority ? lastPaymentAuthority + 1 : '1';
        // resolvedData.paymentAuthority = createRandomString(5);
        // FIXME: Date.now() is not safe
        resolvedData.paymentAuthority = <any>BigInt(Date.now());

        console.log(process.env.NODE_ENV);
        let createResponse;
        if (process.env.NODE_ENV === 'production') {
          // create order in parsian
          const parsianURL = 'https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl';
          const soapClient = await soap.createClientAsync(parsianURL);
          const soapResponse = await soapClient.SalePaymentRequestAsync({
            requestData: {
              LoginAccount: '1cVFr74Se4m8yHO0fAjW',
              OrderId: resolvedData.paymentAuthority, // paymentAuthority
              Amount: <number>(resolvedData.totalPrice ?? 0) * 10,
              CallBackUrl: 'https://chaapkhouneh.ir/api/payment-callback',
              AdditionalData: '',
              Originator: resolvedData.AddressInfo?.create?.fullName,
            }
          });
          createResponse = soapResponse[0].SalePaymentRequestResult;
        }
        else {
          createResponse = { Token: 261577301770039, Message: 'عملیات موفق', Status: 0 };
        }

        console.log({
          createResponse,
        });

        if (createResponse.Status != 0) {
          throw new Error(createResponse.Message);
        }
        resolvedData.ParsianPaymentInfo = {
          create: {
            createResponseMessage: createResponse.Message,
            createResponseStatus: createResponse.Status,
            createResponseToken: createResponse.Token,
          }
        };

        return resolvedData;
      }
    }
  }),
  File: list({
    access: allowAll,
    fields: {
      bounding: checkbox(),
      colorMode: select({
        type: 'enum',
        options: [
          { label: 'سیاه و سفید لیزری', value: COLOR_MODE[COLOR_MODE.BLACK_WHITE_LASER], },
          { label: 'رنگی لیزری', value: COLOR_MODE[COLOR_MODE.COLOR_LASER], },
          { label: 'رنگی جوهر افشان', value: COLOR_MODE[COLOR_MODE.COLOR_INK], },
          { label: 'رنگی دیجیتال', value: COLOR_MODE[COLOR_MODE.COLOR_DIGITAL], },
        ],
        defaultValue: COLOR_MODE[COLOR_MODE.BLACK_WHITE_LASER],
        // db: { map: 'my_select' },
        validation: { isRequired: true, },
        isIndexed: true,
        ui: { displayMode: 'select' },
      }),
      data: file({ storage: 'fileStorage' }),
      dataAsBase64: text(),
      description: text(),
      double: checkbox(),
      name: text(),
      pageCount: integer(),
      pageSize: select({
        type: 'enum',
        options: [
          { label: 'A5', value: PAGE_SIZE[PAGE_SIZE.A5], },
          { label: 'A4', value: PAGE_SIZE[PAGE_SIZE.A4], },
          { label: 'A3', value: PAGE_SIZE[PAGE_SIZE.A3], },
        ],
        defaultValue: PAGE_SIZE[PAGE_SIZE.A4],
        // db: { map: 'my_select' },
        validation: { isRequired: true, },
        isIndexed: true,
        ui: { displayMode: 'select' },
      }),
      series: integer(),
      size: integer(),
      type: text(),
      Order: relationship({ ref: 'Order.Files', many: false }),
    },
    hooks: {
      resolveInput: ({ resolvedData }) => {
        const { name, dataAsBase64, data } = resolvedData;
        if (dataAsBase64) {
          const validBase64 = dataAsBase64.split(',')[1];
          const uniqueName = name.replace(/(\.[\w\d_-]+)$/i, `_${createRandomString(7)}$1`);
          // const data = Buffer.from(dataAsBase64, 'base64');
          const address = path.join(process.cwd(), 'public/files', uniqueName);
          fs.writeFileSync(address, validBase64, 'base64');
          data.filename = uniqueName;
          data.filesize = getFilesizeInBytes(address);
          resolvedData.dataAsBase64 = '';
          // console.log({ data });
        }

        return resolvedData;
      }
    }
  }),
  AddressInfo: list({
    access: allowAll,
    fields: {
      fullName: text(),
      city: text(),
      mobileNumber: text(),
      postalAddress: text(),
      postalCode: text(),
      province: text(),
      Order: relationship({ ref: 'Order.AddressInfo', many: false }),
    }
  }),
  ParsianPaymentInfo: list({
    access: allowAll,
    fields: {
      //#region create
      createResponseStatus: integer(),
      createResponseMessage: text(),
      createResponseToken: bigInt(), // this is long number but mentioned as text
      //#endregion
      //#region callback
      callbackToken: bigInt(),
      callbackOrderId: bigInt(),
      callbackTerminalNumber: bigInt(),
      // status = 0 and RRN > 0 || status = -138
      callbackRRN: bigInt(),
      callbackStatus: integer(),
      callbackAmountAsString: text(),
      callbackCardNumberHashed: text(),
      callbackAmount: bigInt(),
      //#endregion
      //#region confirm
      confirmResponseStatus: integer(),
      confirmResponseCardNumberMasked: text(),
      confirmResponseToken: bigInt(),
      confirmResponseRRN: bigInt(),
      //#endregion
      //#region reversal
      reversalResponseStatus: integer(),
      reversalResponseMessage: text(),
      reversalResponseToken: bigInt(),
      //#endregion

      Order: relationship({ ref: 'Order.ParsianPaymentInfo', many: false }),
    }
  })
};
