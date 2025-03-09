// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('GraphFlow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('http://localhost:3000');
  });

  test('should load the home page', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/GraphFlow/);
    
    // Check that the main heading is present
    const heading = page.locator('h1:has-text("GraphFlow")');
    await expect(heading).toBeVisible();
  });

  test('should create, save, reload, and run a graph', async ({ page }) => {
    // Click the "Create New Graph" button
    await page.click('text=Create New Graph');
    
    // Wait for the graph editor to load
    await page.waitForSelector('.react-flow');
    
    // Add an LLM node
    await page.click('text=Add LLM Node');
    
    // Configure the LLM node
    await page.fill('input[name="node-name"]', 'My LLM Node');
    await page.fill('input[name="model-name"]', 'gpt-3.5-turbo');
    await page.fill('textarea[name="prompt-template"]', 'You are a helpful assistant. Answer the following question: {{input}}');
    await page.click('text=Save Node');
    
    // Add a transform node
    await page.click('text=Add Transform Node');
    
    // Configure the transform node
    await page.fill('input[name="node-name"]', 'JSON Extractor');
    await page.selectOption('select[name="transform-type"]', 'extract_json');
    await page.click('text=Save Node');
    
    // Connect the nodes
    // This is a simplified representation - in a real test, you would need to
    // interact with the ReactFlow canvas to create connections
    await page.evaluate(() => {
      // This would be replaced with actual code to connect nodes in ReactFlow
      window.connectNodes('My LLM Node', 'JSON Extractor');
    });
    
    // Save the graph
    await page.fill('input[name="graph-name"]', 'Test Graph');
    await page.fill('textarea[name="graph-description"]', 'A test graph created by e2e tests');
    await page.click('text=Save Graph');
    
    // Wait for the save confirmation
    await page.waitForSelector('text=Graph saved successfully');
    
    // Navigate to the graphs list
    await page.click('text=My Graphs');
    
    // Find and open the saved graph
    await page.click('text=Test Graph');
    
    // Wait for the graph to load
    await page.waitForSelector('.react-flow');
    
    // Verify that the nodes are present
    const llmNode = page.locator('text=My LLM Node');
    await expect(llmNode).toBeVisible();
    
    const transformNode = page.locator('text=JSON Extractor');
    await expect(transformNode).toBeVisible();
    
    // Run the graph
    await page.fill('textarea[name="input"]', 'What is the capital of France?');
    await page.click('text=Run Graph');
    
    // Wait for the execution to complete
    await page.waitForSelector('text=Execution completed');
    
    // Verify that the output is displayed
    const output = page.locator('.output-panel');
    await expect(output).toContainText('Paris');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Navigate to the graphs list
    await page.click('text=My Graphs');
    
    // Try to open a non-existent graph
    await page.goto('http://localhost:3000/graph/999');
    
    // Verify that an error message is displayed
    const errorMessage = page.locator('text=Graph not found');
    await expect(errorMessage).toBeVisible();
    
    // Create a new graph with invalid configuration
    await page.click('text=Create New Graph');
    
    // Wait for the graph editor to load
    await page.waitForSelector('.react-flow');
    
    // Add an LLM node with invalid configuration
    await page.click('text=Add LLM Node');
    
    // Leave required fields empty
    await page.click('text=Save Node');
    
    // Verify that validation errors are displayed
    const validationError = page.locator('text=Model name is required');
    await expect(validationError).toBeVisible();
  });

  test('should allow editing an existing graph', async ({ page }) => {
    // Navigate to the graphs list
    await page.click('text=My Graphs');
    
    // Find and open an existing graph
    await page.click('text=Test Graph');
    
    // Wait for the graph to load
    await page.waitForSelector('.react-flow');
    
    // Edit an existing node
    await page.click('text=My LLM Node');
    
    // Change the node properties
    await page.fill('input[name="model-name"]', 'gpt-4');
    await page.click('text=Save Node');
    
    // Save the updated graph
    await page.click('text=Save Graph');
    
    // Wait for the save confirmation
    await page.waitForSelector('text=Graph saved successfully');
    
    // Reload the graph
    await page.reload();
    
    // Wait for the graph to load
    await page.waitForSelector('.react-flow');
    
    // Verify that the changes were saved
    await page.click('text=My LLM Node');
    const modelNameInput = page.locator('input[name="model-name"]');
    await expect(modelNameInput).toHaveValue('gpt-4');
  });
}); 