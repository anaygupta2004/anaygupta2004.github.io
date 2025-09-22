const https = require('https');
const http = require('http');

// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';
const QUEUE_STATUS_URL = process.env.QUEUE_STATUS_URL || 'http://localhost:3000/queue/status';
const QUEUE_PROCESS_URL = process.env.QUEUE_PROCESS_URL || 'http://localhost:3000/queue/process';

// Test messages to send
const testMessages = [
  {
    message: "Test webhook message 1 - Queue fix verification",
    type: "test"
  },
  {
    message: "Test webhook message 2 - Production queue test",
    type: "production"
  },
  {
    message: "Test webhook message 3 - Queue processing verification",
    type: "verification"
  }
];

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test function to send messages to webhook
async function testWebhookMessages() {
  console.log('🚀 Starting webhook queue test...\n');
  
  try {
    // Test 1: Check server health
    console.log('1. Checking server health...');
    const healthResponse = await makeRequest(WEBHOOK_URL.replace('/webhook', '/health'));
    console.log(`   Health Status: ${healthResponse.status === 200 ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data)}\n`);

    // Test 2: Check initial queue status
    console.log('2. Checking initial queue status...');
    const initialStatus = await makeRequest(QUEUE_STATUS_URL);
    console.log(`   Initial Queue Status: ${JSON.stringify(initialStatus.data)}\n`);

    // Test 3: Send test messages
    console.log('3. Sending test messages to webhook...');
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      console.log(`   Sending message ${i + 1}: "${message.message}"`);
      
      const response = await makeRequest(WEBHOOK_URL, {
        method: 'POST',
        body: message
      });
      
      if (response.status === 200) {
        console.log(`   ✅ Message ${i + 1} sent successfully`);
        console.log(`   Queue length: ${response.data.queueLength}`);
      } else {
        console.log(`   ❌ Message ${i + 1} failed: ${response.status}`);
        console.log(`   Error: ${JSON.stringify(response.data)}`);
      }
      console.log('');
    }

    // Test 4: Check queue status after sending messages
    console.log('4. Checking queue status after sending messages...');
    const finalStatus = await makeRequest(QUEUE_STATUS_URL);
    console.log(`   Final Queue Status: ${JSON.stringify(finalStatus.data)}\n`);

    // Test 5: Process messages from queue
    console.log('5. Processing messages from queue...');
    for (let i = 0; i < testMessages.length; i++) {
      console.log(`   Processing message ${i + 1}...`);
      
      const response = await makeRequest(QUEUE_PROCESS_URL, {
        method: 'POST'
      });
      
      if (response.status === 200) {
        console.log(`   ✅ Message ${i + 1} processing ${response.data.processed ? 'started' : 'skipped'}`);
        if (response.data.messageId) {
          console.log(`   Message ID: ${response.data.messageId}`);
        }
      } else {
        console.log(`   ❌ Message ${i + 1} processing failed: ${response.status}`);
      }
      console.log('');
    }

    // Test 6: Final queue status check
    console.log('6. Final queue status check...');
    const endStatus = await makeRequest(QUEUE_STATUS_URL);
    console.log(`   End Queue Status: ${JSON.stringify(endStatus.data)}\n`);

    console.log('🎉 Webhook queue test completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   - Messages sent: ${testMessages.length}`);
    console.log(`   - Queue processing: ${endStatus.data.queue.totalMessages === 0 ? 'All messages processed' : `${endStatus.data.queue.totalMessages} messages remaining`}`);
    console.log(`   - Server status: ${healthResponse.status === 200 ? 'Healthy' : 'Issues detected'}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testWebhookMessages();
}

module.exports = { testWebhookMessages, makeRequest };