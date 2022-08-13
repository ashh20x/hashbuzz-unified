import { prisma } from "@shared/prisma";
import logger from "jet-logger";

//types

export interface TwitterStats {
  like_count?: number;
  retweet_count?: number;
  quote_count?: number;
}

export interface RewardCatalog{
  retweet_reward:number, like_reward:number, quote_reward:number
}

export const allActiveTwitterCard = async () => {
  console.info("allActiveTwitterCard::start");
  const allActiveCards = await prisma.campaign_twittercard.findMany({
    where: {
      card_status: "Running",
    },
  });
  return allActiveCards;
};

const twitterCardStats = async (cardId: bigint) => {
  console.info("twitterCardStatus::Start");
  const cardStatus = await prisma.campaign_tweetstats.findUnique({
    where: {
      twitter_card_id: cardId,
    },
  });
  return cardStatus;
};

const updateTwitterCardStats = async (body: TwitterStats, cardId: bigint | number) => {
  console.info("updateTwitterCardStats::start");

  const update = await prisma.campaign_tweetstats.update({
    where: { twitter_card_id: cardId },
    data: {
      like_count:body.like_count??0,
      quote_count:body.quote_count??0,
      retweet_count:body.retweet_count??0,
    },
  });
  return update.id
};

const addNewCardStats = async(body:TwitterStats , cardId: bigint | number) => {

  console.info("addNewCardStats::start");

  const addNewStats = prisma.campaign_tweetstats.create({
    data:{
      twitter_card_id:cardId,
      like_count:body.like_count??0,
      quote_count:body.quote_count??0,
      retweet_count:body.retweet_count??0,
      last_update: new Date().toISOString()
    }
  })

  return addNewStats;
}

const updateTotalSpentAmount = (id:number|bigint,amount_spent:number) => {
  const updateTotalSpentBudget = prisma.campaign_twittercard.update({
    where:{id},
    data:{
    amount_spent
    }
  })
  return updateTotalSpentBudget
}

export default {
  allActiveTwitterCard,
  twitterCardStats,
  updateTwitterCardStats,
  addNewCardStats,
  updateTotalSpentAmount
} as const;
