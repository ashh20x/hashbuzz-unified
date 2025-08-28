import { StatusError } from "@hashgraph/sdk";
import { toast } from "react-toastify";

/**
 * Maps Hedera status codes to user-friendly messages.
 * Works for both Precheck and Receipt errors.
 */
const HEDERA_ERROR_MESSAGES: Record<string, string> = {
  INSUFFICIENT_PAYER_BALANCE: "Your account does not have enough HBAR to pay for this transaction.",
  INVALID_SIGNATURE: "One or more signatures are invalid.",
  TRANSACTION_EXPIRED: "The transaction has expired. Please try again.",
  PAYER_ACCOUNT_NOT_FOUND: "The payer account does not exist on the network.",
  INSUFFICIENT_TX_FEE: "The transaction fee is insufficient for processing.",
  INSUFFICIENT_ACCOUNT_BALANCE: "Account balance too low to complete this transaction.",
  BUSY: "The network is busy. Please try again later.",
  INVALID_TRANSACTION_START: "Invalid transaction start time.",
  DUPLICATE_TRANSACTION: "This transaction has already been submitted.",
  INVALID_NODE_ACCOUNT: "Invalid node account specified.",
  INVALID_TRANSACTION_BODY: "The transaction body is malformed or invalid.",
  INVALID_TRANSACTION_ID: "The transaction ID is invalid.",
  RECEIPT_NOT_FOUND: "Transaction receipt not found.",
  RECORD_NOT_FOUND: "Transaction record not found.",
  CONTRACT_EXECUTION_EXCEPTION: "Smart contract execution failed.",
  INVALID_CONTRACT_ID: "The specified contract ID is invalid.",
  CONTRACT_DELETED: "The contract has been deleted.",
  MAX_GAS_LIMIT_EXCEEDED: "Transaction exceeds maximum gas limit.",
  INSUFFICIENT_GAS: "Insufficient gas for contract execution.",
};

/**
 * Maps common error patterns to user-friendly messages
 */
const COMMON_ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /illegal buffer|invalid buffer|buffer.*invalid/i,
    message: "Invalid transaction data received. Please try again or contact support."
  },
  {
    pattern: /user rejected|user denied|user cancelled/i,
    message: "Transaction was cancelled by user."
  },
  {
    pattern: /insufficient.*balance|balance.*insufficient/i,
    message: "Insufficient account balance for this transaction."
  },
  {
    pattern: /network.*error|connection.*failed|fetch.*failed/i,
    message: "Network connection error. Please check your internet and try again."
  },
  {
    pattern: /timeout|timed out/i,
    message: "Transaction timed out. Please try again."
  },
  {
    pattern: /invalid.*format|malformed|parse.*error/i,
    message: "Invalid data format. Please try again or contact support."
  },
  {
    pattern: /unauthorized|permission.*denied|access.*denied/i,
    message: "You don't have permission to perform this action."
  },
  {
    pattern: /rate.*limit|too.*many.*requests/i,
    message: "Too many requests. Please wait a moment and try again."
  },
  {
    pattern: /server.*error|internal.*error|500/i,
    message: "Server error occurred. Please try again later."
  },
  {
    pattern: /not.*found|404/i,
    message: "Requested resource not found."
  }
];

export function useHederaErrorHandler() {
  const parseHederaError = (error: any) => {
    console.debug("Parsing Hedera error:", error);

    // 1️⃣ Handle composite WalletConnect error object
    if (error?.txError || error?.queryError) {
      if (error.txError?.message === "USER_REJECT") {
        return { status: "REJECTED", message: "Transaction signing was cancelled by the user." };
      }

      if (error.txError) {
        const message = error.txError.message || "Transaction failed.";
        return { status: "FAILED", message: getUserFriendlyMessage(message) };
      }

      if (error.queryError) {
        const message = error.queryError.message || "Query failed.";
        return { status: "FAILED", message: getUserFriendlyMessage(message) };
      }
    }

    // 2️⃣ Handle direct Hedera StatusError
    if (error instanceof StatusError) {
      const statusMessage = HEDERA_ERROR_MESSAGES[error.status.toString()] || `${error.status}: ${error.message}`;
      return { status: "FAILED", message: statusMessage };
    }

    // 3️⃣ Handle EIP-1193 wallet rejections
    if (typeof error?.message === "string" && error.message.toLowerCase().includes("user rejected")) {
      return { status: "REJECTED", message: "Transaction signing was cancelled by the user." };
    }
    if (error?.code === 4001) {
      return { status: "REJECTED", message: "Transaction signing was cancelled by the user." };
    }

    // 4️⃣ Handle RTK Query errors
    if (error?.data?.message) {
      return { status: "FAILED", message: getUserFriendlyMessage(error.data.message) };
    }

    // 5️⃣ Handle network/fetch errors
    if (error?.name === "TypeError" && error?.message?.includes("fetch")) {
      return { status: "NETWORK_ERROR", message: "Network connection failed. Please check your internet connection." };
    }

    // 6️⃣ Handle common error patterns
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    const friendlyMessage = getUserFriendlyMessage(errorMessage);
    
    return { status: "FAILED", message: friendlyMessage };
  };

  const getUserFriendlyMessage = (errorMessage: string): string => {
    // Check for common error patterns
    for (const { pattern, message } of COMMON_ERROR_PATTERNS) {
      if (pattern.test(errorMessage)) {
        return message;
      }
    }

    // Check for Hedera status codes in the message
    for (const [status, message] of Object.entries(HEDERA_ERROR_MESSAGES)) {
      if (errorMessage.includes(status)) {
        return message;
      }
    }

    // Return original message if no pattern matches, but clean it up
    return cleanErrorMessage(errorMessage);
  };

  const cleanErrorMessage = (message: string): string => {
    // Remove technical stack traces and unnecessary details
    const cleaned = message
      .split('\n')[0] // Take only the first line
      .replace(/^Error:\s*/i, '') // Remove "Error:" prefix
      .replace(/at\s+.*$/g, '') // Remove stack trace info
      .trim();

    // If the cleaned message is too technical or empty, provide a generic message
    if (!cleaned || cleaned.length < 10 || /chunk-|\.js|\.ts/.test(cleaned)) {
      return "An unexpected error occurred. Please try again.";
    }

    return cleaned;
  };

  const handleErrorWithToast = (error: any, customMessage?: string) => {
    const parsed = parseHederaError(error);
    const message = customMessage || parsed.message;
    
    switch (parsed.status) {
      case "REJECTED":
        toast.warn(message);
        break;
      case "NETWORK_ERROR":
        toast.error(message);
        break;
      default:
        toast.error(message);
        break;
    }
    
    return parsed;
  };

  const isRetryableError = (error: any): boolean => {
    const parsed = parseHederaError(error);
    const retryableStatuses = ["BUSY", "NETWORK_ERROR"];
    const retryablePatterns = [
      /network.*error/i,
      /timeout/i,
      /busy/i,
      /rate.*limit/i,
      /server.*error/i
    ];

    // Check status
    if (retryableStatuses.includes(parsed.status)) {
      return true;
    }

    // Check message patterns
    return retryablePatterns.some(pattern => pattern.test(parsed.message));
  };

  return { 
    parseHederaError, 
    getUserFriendlyMessage, 
    handleErrorWithToast,
    isRetryableError 
  };
}

export default useHederaErrorHandler;
