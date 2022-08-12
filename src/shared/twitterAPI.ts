/* eslint-disable max-len */
import TwitterApi from "twitter-api-v2";

const token =
  "AAAAAAAAAAAAAAAAAAAAAGAsaAEAAAAA%2B5iOEMRE9r9mQrrhUmmDCjQ1GA0%3Dl5o8X1STsnuc6LOlecUq3lFeKw9xiVOZUWxfipds21HyxvPB4j";

// Instantiate with desired auth type (here's Bearer v2 auth)
export const twitterClient = new TwitterApi(
  process.env.TWITTER_APP_USER_TOKEN ?? token
);
const roClient = twitterClient.readOnly;

export const getAllUsers = async (
  tweetId: string,
  engagement: "like" | "retweet" | "quote",
  returnOnlyIds: boolean
) => {
  if (engagement === "like") {
    const users = await roClient.v2.tweetLikedBy(tweetId, {
      "user.fields": ["username"],
      asPaginator: true,
    });
    return !returnOnlyIds
      ? users.data.data
      : users?.data?.data
      ? users?.data?.data.map((d) => d.id)
      : [];
  }
  if (engagement === "retweet") {
    const get_users = await roClient.v2.tweetRetweetedBy(tweetId, {
      "user.fields": ["username"],
    });
    return !returnOnlyIds
      ? get_users.data
      : get_users?.data
      ? get_users?.data.map((d) => d.id)
      : [];
  }
  if (engagement === "quote") {
    const get_users = await roClient.v2.quotes(tweetId, {
      "user.fields": ["username"],
    });
    return !returnOnlyIds
      ? get_users.data
      : get_users?.data?.data
      ? get_users?.data?.data.map((d) => d.id)
      : [];
  }
};
