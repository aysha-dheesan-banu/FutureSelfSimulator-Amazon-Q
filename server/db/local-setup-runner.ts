import { setupLocalTables } from "./setup-local";

/**
 * Script to set up local DynamoDB tables
 */
async function main() {
  console.log("Setting up local DynamoDB tables...");
  
  try {
    await setupLocalTables();
    console.log("✅ Local DynamoDB setup complete!");
  } catch (error) {
    console.error("❌ Error setting up local DynamoDB:", error);
    process.exit(1);
  }
}

// Run the setup
main().catch(console.error);