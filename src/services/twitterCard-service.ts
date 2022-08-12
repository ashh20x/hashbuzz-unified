import { prisma } from "@shared/prisma";

export const allActiveTwitterCard = async () => {
  console.log("allActiveTwitterCard::start")
	const allActiveCards = await prisma.campaign_twittercard.findMany({
    where:{
      card_status:"Running"
    }
  })
	return allActiveCards
};

export default {
	allActiveTwitterCard
} as const;
