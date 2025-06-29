/* import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit/beta'; // chat is a beta feature
import pdf from 'pdf-parse';
import fs from 'fs';
import { createInterface } from "node:readline/promises";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

(async () => {
  try {
    // Step 1: get command line arguments

    // Step 2: load PDF file

    // Step 3: construct prompt

    // Step 4: start chat

    // Step 5: chat loop

        // Step 1: get command line arguments
    const filename = process.argv[2];
    if (!filename) {
      console.error("Please provide a filename as a command line argument.");
      process.exit(1);
    }
      let dataBuffer = fs.readFileSync(filename);
    const { text } = await pdf(dataBuffer);

        // Step 3: construct prompt
    const prefix = process.argv[3] || "Sample prompt: Answer the user's questions about the contents of this PDF file.";
    const prompt = `
      ${prefix}
      Context:
      ${text}
    `;
        // Step 4: start chat
    const chat = ai.chat({ system: prompt });
    const readline = createInterface(process.stdin, process.stdout);
    console.log("You're chatting with Gemini. Ctrl-C to quit.\n");

        // Step 5: chat loop
    while (true) {
      const userInput = await readline.question("> ");
      const { text } = await chat.send(userInput);
      console.log(text);
    }

  } catch (error) {
    console.error("Error parsing PDF or interacting with Genkit:", error);
  }
      // Step 2: load PDF file
  

  
})(); // <-- don't forget the trailing parentheses to call the function!

 
 */
// index.ts

// 1. Import the required dependencies
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit/beta'; // chat is a beta feature
import pdf from 'pdf-parse';
import * as fs from 'fs';
import { createInterface, Interface } from "node:readline/promises";

// This import is for local development to load environment variables from a .env file.
import * as dotenv from 'dotenv';
dotenv.config();

// Utility function to introduce a delay for retry logic
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 2. Configure Genkit and the default model
// Ensure GEMINI_API_KEY is set as an environment variable (e.g., via setx on Windows).
const ai = genkit({ // Capture the genkit instance
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: gemini20Flash,
});

// Declare readline and chat variables outside try block for proper scoping in finally block
let readline: Interface | null = null;
let currentChatInstance: any; // Using 'any' as Genkit's chat object might not have a public Interface type readily available

// Main asynchronous function to run the application
(async () => {
  try {
    // Step 1: get command line arguments
    const filename = process.argv[2];
    if (!filename) {
      console.error("Please provide a filename as a command line argument (e.g., npx tsx src/index.ts my_document.pdf).");
      process.exit(1);
    }

    // Step 2: load PDF file and parse it
    console.log(`Loading and parsing PDF: ${filename}...`);
    let dataBuffer = fs.readFileSync(filename);
    const { text: pdfTextContent } = await pdf(dataBuffer);
    console.log(`PDF parsed successfully. Extracted text length: ${pdfTextContent.length} characters.`);
    console.log("Starting chat...");

    // Function to initialize or reset the chat instance
    const initializeChat = (pdfContent: string) => {
      const prefix = process.argv[3] || "Answer the user's questions about the contents of this PDF file.";
      const systemPrompt = `
        ${prefix}
        Context:
        ${pdfContent}
      `;
      // FIX: Use ai.chat() and pass the model explicitly, or rely on default set in genkit config
      // The `chat` method is on the `ai` object, not directly on the `ModelReference`
      const chat = ai.chat({ 
        model: googleAI.model('gemini-2.0-flash'), // Specify the model
        system: systemPrompt 
      });
      console.log("Chat context initialized/reset.");
      return chat;
    };

    currentChatInstance = initializeChat(pdfTextContent);

    // Initialize readline
    readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("\nYou're chatting with Gemini about the PDF. Type your questions.");
    console.log("Type 'reset' to clear the conversation history.");
    console.log("Press Ctrl-C or type 'exit' or 'quit' to end the chat.\n");

    // Step 5: chat loop with retry logic and context management
    const MAX_RETRIES = 5;
    const INITIAL_DELAY_MS = 1000; // 1 second

    while (true) {
      const userInput = await readline.question("> ");

      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log("Exiting chat. Goodbye!");
        readline.close();
        break; // Exit the loop
      }

      if (userInput.toLowerCase() === 'reset') {
        console.log("Resetting conversation history...");
        currentChatInstance = initializeChat(pdfTextContent); // Re-initialize chat
        continue; // Skip to next user input
      }

      let retryCount = 0;
      let delay = INITIAL_DELAY_MS;
      let geminiResponse = '';
      let success = false;

      while (retryCount < MAX_RETRIES && !success) {
        try {
          console.log(`Gemini thinking... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          const response = await currentChatInstance.send(userInput); // Use the current chat instance
          geminiResponse = response.text;
          success = true; // Successfully received a response
        } catch (error: any) {
          // Check for common transient errors: 503 (Service Unavailable), 429 (Too Many Requests),
          // or 400 (Bad Request) which often accompanies context length issues.
          const isRetryable = error.status === 503 || error.status === 429 ||
                              (error.status === 400 && error.message.includes("context")); // Look for "context" in 400 error message

          if (isRetryable && retryCount < MAX_RETRIES -1) { // Retrying if not last attempt
            console.warn(`Model error (Status: ${error.status}). Retrying in ${delay / 1000} seconds...`);
            await sleep(delay);
            delay *= 2; // Exponential backoff
            retryCount++;
          } else if (isRetryable && retryCount === MAX_RETRIES - 1) { // Last retry attempt failed
            console.error(`Failed to get a response after ${MAX_RETRIES} retries. This might be due to context length. Try typing 'reset' to clear history.`);
            success = false; // Ensure loop exits and outer if (success) block is skipped
            break; // Break from inner retry loop
          } else {
            // Log and exit for non-retryable or unexpected errors
            console.error("Non-retryable or unexpected error calling Gemini:", error);
            if (error.status) {
              console.error("Error status:", error.status);
            }
            console.error(JSON.stringify(error, null, 2));
            success = true; // Set to true to exit retry loop, but it's an error
            process.exit(1); // Exit the application for critical errors
          }
        }
      }

      if (success) {
        console.log(geminiResponse);
      } else {
        // This else block is reached if all retries failed due to a retryable error (like context limit)
        console.error("Please try resetting the conversation by typing 'reset' or try again later.");
      }
    }

  } catch (error) {
    // Catch-all for any unhandled errors in the main application flow
    console.error("An unhandled error occurred during application setup or PDF parsing:", error);
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    // Ensure readline interface is closed
    if (readline && !readline.close) {
      readline.close();
    }
  }
})();
