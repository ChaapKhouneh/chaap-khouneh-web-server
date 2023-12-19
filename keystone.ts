// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';
import express from 'express';
import { ORDER_STATE } from './assets/js/enums';
import * as soap from 'soap';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: 'file:../data/app.db',
    },
    lists,
    session,
    server: {
      port: 8080,
      extendExpressApp: (app, context) => {
        app.use(express.json({ limit: '1gb' }));
        app.use(express.urlencoded({ limit: '1gb' }));
        app.post('/api/payment-callback', async (req, res) => {
          console.log(req.body);

          const Token = BigInt(req.body.Token);
          const OrderId = BigInt(req.body.OrderId);
          const TerminalNo = req.body.TerminalNo;
          const RRN = BigInt(req.body.RRN);
          const status = Number(req.body.status);
          const AmountAsString = req.body.Amount.replaceAll(/,/g, '');
          const Amount = BigInt(AmountAsString.slice(0, AmountAsString.length - 1));
          // const SwAmount = BigInt(req.body.SwAmount);
          const HashCardNumber = req.body.HashCardNumber;

          if (status === 0 && RRN > 0) {
            // check if order exists and is not previously paid and amount matches
            const sudoContext = context.sudo();
            const relatedOrder = (await sudoContext.db.Order.findMany({
              where: {
                paymentAuthority: {
                  equals: OrderId,
                }
              },
              take: 1,
            }))[0];

            const relatedParsianPaymentInfo = (await sudoContext.db.ParsianPaymentInfo.findMany({
              where: {
                id: {
                  equals: relatedOrder.ParsianPaymentInfoId,
                },
                createResponseToken: {
                  equals: Token,
                }
              },
              take: 1,
            }))[0];

            console.log({ relatedOrder, info: relatedParsianPaymentInfo ? 'info found' : 'info not found' });
            await context.db.ParsianPaymentInfo.updateOne({
              where: { id: relatedParsianPaymentInfo.id },
              data: {
                callbackToken: Token,
                callbackOrderId: OrderId,
                callbackTerminalNumber: TerminalNo,
                callbackRRN: RRN,
                callbackStatus: status,
                callbackAmountAsString: AmountAsString,
                callbackCardNumberHashed: HashCardNumber,
                callbackAmount: Amount,
              },
            });

            if (
              relatedOrder
              && relatedParsianPaymentInfo
              && relatedOrder.status === ORDER_STATE[ORDER_STATE.WAITING_FOR_PAYMENT]
              && relatedOrder.totalPrice == Amount) {
              console.log('every thing ok');
              // confirm payment
              const parsianConfirmURL = 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?wsdl';
              const soapClient = await soap.createClientAsync(parsianConfirmURL);
              const soapResponse = await soapClient.ConfirmPaymentAsync({
                requestData: {
                  LoginAccount: '1cVFr74Se4m8yHO0fAjW',
                  Token,
                }
              });
              const confirmResponse = soapResponse[0].ConfirmPaymentResult;
              console.log({ confirmResponse });

              await context.db.ParsianPaymentInfo.updateOne({
                where: { id: relatedParsianPaymentInfo.id },
                data: {
                  confirmResponseStatus: confirmResponse.Status,
                  confirmResponseCardNumberMasked: confirmResponse.CardNumberMasked,
                  confirmResponseToken: BigInt(confirmResponse.Token),
                  confirmResponseRRN: BigInt(confirmResponse.RRN),
                },
              });

              await context.db.Order.updateOne({
                where: { id: relatedOrder.id },
                data: {
                  status: ORDER_STATE.PAYED,
                },
              });

              res.redirect('https://chaapkhouneh.ir/pay');
            }
            else {
              // reject payment
              res.redirect('https://chaapkhouneh.ir/pay');
            }
          }
          else {
            res.redirect('https://chaapkhouneh.ir/pay');
          }
        });
      },
      // maxFileSize: 25_000_000,
    },
    graphql: {
      playground: true,
    },
    storage: {
      fileStorage: {
        kind: 'local',
        type: 'file',
        generateUrl: path => `https://chaapkhouneh.ir/files${path}`,
        serverRoute: {
          path: '/files',
        },
        storagePath: 'public/files',
      },
    }
  })
);
