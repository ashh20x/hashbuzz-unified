import twitterCardService, { TwitterStats } from "@services/twitterCard-service";
import { getEngagedUsers } from "@shared/twitterAPI";
import logger from "jet-logger";

const manageTwitterCardStatus = async () => {
  console.info("manageTwitterCardStatus::start");

  const dataToUpdate: TwitterStats = {};

  //? get all active cards from DB
  const allActiveCard = await twitterCardService.allActiveTwitterCard();

  //! looping through each card
  await Promise.all(
    allActiveCard.map(async (card) => {
      // refactor card object
      const { tweet_id, retweet_reward, like_reward, quote_reward, comment_reward, id } = card;
      const { like, quote, retweet } = await getEngagedUsers(tweet_id ?? "");

      const _likeCount = like?.meta.result_count;
      const _qoteCount = quote?.meta.result_count;
      const _retweetCount = retweet?.meta.result_count;

      //?  get card count status from DB.
      const cardStatus = await twitterCardService.twitterCardStatus(id);

      if (cardStatus) {
        //! compare counts with existing record and then update
        const { like_count, retweet_count, quote_count } = cardStatus;

        //!  if count changes update the data.

        if (like_count !== _likeCount) dataToUpdate.like_count = _likeCount;
        if (quote_count !== _qoteCount) dataToUpdate.quote_count = _qoteCount;
        if (retweet_count !== _retweetCount) dataToUpdate.retweet_count = _retweetCount;

        //? update stats to DB
        await twitterCardService.updateTwitterCardStats(dataToUpdate, id);
      } else {
        //!! if not available in db then update the DB by adding new record.
        await twitterCardService.addNewCardStats(
          {
            like_count: _likeCount,
            retweet_count: _retweetCount,
            quote_count: _qoteCount,
          },
          id
        );
      }
    })
  );
};

export default {
  updateCardStatus: manageTwitterCardStatus,
} as const;
