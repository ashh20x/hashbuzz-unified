import { allActiveTwitterCard } from "@services/twitterCard-service";
import { getAllUsers } from "@shared/twitterAPI";

const manageTwitterCardStatus = async () => {
  console.info("manageTwitterCardStatus::start");
  const allActiveCard = await allActiveTwitterCard();

  await Promise.all(
    allActiveCard.map(async (card) => {
      const liked_users = await getAllUsers(card.tweet_id ?? "", "quote", true);
      console.log("liked_users:::", liked_users);
    })
  );
};

export default {
  updateCardStatus: manageTwitterCardStatus,
} as const;
