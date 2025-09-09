import {
  handleCampaignPublishTransaction,
  publishCampaignSecondContent,
  publshCampaignContentHandler,
  publshCampaignErrorHandler,
} from '@V201/modules/campaigns';
import createPrismaClient from '@shared/prisma';
import type { PrismaClient } from '@prisma/client';
import { EventPayloadMap } from '@V201/types';
import Logger from 'jet-logger';
import { BalanceEvents, CampaignEvents } from './AppEvents';
import { safeStringifyData } from './Modules/common';
import { consumeFromQueue } from './redisQueue';

const processEvent = async (
  eventId: number,
  eventType: string,
  payload: any
) => {
  Logger.info(`Processing event ${String(eventType)} - payload: ${safeStringifyData(
    payload
  )}`);

  switch (eventType) {
    // handle event CAMPAIGN_PUBLISH_CONTENT event
    case CampaignEvents.CAMPAIGN_PUBLISH_CONTENT: {
      const publishContentPayload =
        payload as EventPayloadMap[CampaignEvents.CAMPAIGN_PUBLISH_CONTENT];
      await publshCampaignContentHandler(publishContentPayload);
      break;
    }

    // handle event CAMPAIGN_PUBLISH_DO_SM_TRANSACTION event
    case CampaignEvents.CAMPAIGN_PUBLISH_DO_SM_TRANSACTION: {
      const trnsactionPayload =
        payload as EventPayloadMap[CampaignEvents.CAMPAIGN_PUBLISH_DO_SM_TRANSACTION];
      await handleCampaignPublishTransaction(trnsactionPayload);
      break;
    }

    case CampaignEvents.CAMPAIGN_PUBLISH_SECOND_CONTENT: {
      const secondContentPayload =
        payload as EventPayloadMap[CampaignEvents.CAMPAIGN_PUBLISH_SECOND_CONTENT];
      await publishCampaignSecondContent(secondContentPayload);
      break;
    }

    // handle event CAMPAIGN_PUBLISH_ERROR event
    case CampaignEvents.CAMPAIGN_PUBLISH_ERROR: {
      const errorPayload =
        payload as EventPayloadMap[CampaignEvents.CAMPAIGN_PUBLISH_ERROR];
      await publshCampaignErrorHandler(errorPayload);
      break;
    }

    case CampaignEvents.CAMPAIGN_DRAFT_SUCCESS: {
      const draftPayload =
        payload as EventPayloadMap[CampaignEvents.CAMPAIGN_DRAFT_SUCCESS];
      Logger.info(
        `Campaign Drafted Successfully with payload ${safeStringifyData(
          draftPayload
        )}`
      );
      break;
    }

    // User Balance updates

    case BalanceEvents.CAMPAIGNER_FUNGIBLE_BALANCE_UPDATE: {
      const balanceUpdatePayload =
        payload as EventPayloadMap[BalanceEvents.CAMPAIGNER_FUNGIBLE_BALANCE_UPDATE];
      Logger.info(
        `Campaigner Fungible Balance Updated with payload ${safeStringifyData(
          balanceUpdatePayload
        )}`
      );
      //  send sse event to the client regard the balance update
      break;
    }

    case BalanceEvents.CAMPAIGNER_HABR_BALANCE_UPDATE: {
      const hbarBalanceUpdatePayload =
        payload as EventPayloadMap[BalanceEvents.CAMPAIGNER_HABR_BALANCE_UPDATE];
      Logger.info(
        `Campaigner HBAR Balance Updated with payload ${safeStringifyData(
          hbarBalanceUpdatePayload
        )}`
      );

      //  send sse event to the client regard the balance update
      break;
    }

    default:
      break;
  }
  const prisma = (await createPrismaClient()) as PrismaClient;
  // delete the outbox record by id after successful processing using raw SQL
  await prisma.$executeRaw`DELETE FROM event_out_box WHERE id = ${eventId}`;
};

Logger.info('Starting event consumer...');

consumeFromQueue('event-queue', (event) => {
  // event may already be parsed by safeParsedData in redisQueue
  const raw = typeof event === 'string' ? JSON.parse(event) : event;
  if (!raw || !raw.eventId || !raw.eventType) {
    Logger.err(`Invalid event format: ${safeStringifyData(raw)}`);
    return;
  }

  // spawn async handler so the queue callback stays synchronous/void
  (async () => {
    try {
      const eventId = Number(raw.eventId);
      await processEvent(eventId, String(raw.eventType), raw.payload);
    } catch (err) {
      Logger.err(`Error processing event: ${String(err)}`);
    }
  })();
});
