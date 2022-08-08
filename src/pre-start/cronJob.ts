import cron from "node-cron";

export const task = cron.schedule(
  "* * * * *",
  () => {
    console.log("running a task every minute");
  },
  {
    scheduled: false,
  }
);
