/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import dotenv from 'dotenv';
import { task } from './cronJob';



(() => {
    // Setup command line options
    dotenv.config();
    task.start();
})();
