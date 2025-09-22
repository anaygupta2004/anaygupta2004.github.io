const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple in-memory queue for testing
class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(message) {
    this.queue.push({
      id: Date.now() + Math.random(),
      message: message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    console.log(`Message enqueued: ${JSON.stringify(message)}`);
    return this.queue.length;
  }

  dequeue() {
    if (this.queue.length === 0) return null;
    const message = this.queue.shift();
    message.status = 'processing';
    console.log(`Message dequeued: ${JSON.stringify(message)}`);
    return message;
  }

  getQueueStatus() {
    return {
      totalMessages: this.queue.length,
      pendingMessages: this.queue.filter(m => m.status === 'pending').length,
      processingMessages: this.queue.filter(m => m.status === 'processing').length
    };
  }
}

const messageQueue = new MessageQueue();

// Webhook endpoint to receive messages
app.post('/webhook', (req, res) => {
  try {
    const { message, type = 'test' } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        received: req.body 
      });
    }

    // Add message to queue
    const queueLength = messageQueue.enqueue({
      message,
      type,
      source: 'webhook',
      receivedAt: new Date().toISOString()
    });

    console.log(`Webhook received message: "${message}" (Type: ${type})`);
    console.log(`Queue length: ${queueLength}`);

    res.json({
      success: true,
      message: 'Message received and queued successfully',
      queueLength,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Endpoint to check queue status
app.get('/queue/status', (req, res) => {
  const status = messageQueue.getQueueStatus();
  res.json({
    success: true,
    queue: status,
    timestamp: new Date().toISOString()
  });
});

// Endpoint to process messages from queue
app.post('/queue/process', (req, res) => {
  try {
    const message = messageQueue.dequeue();
    
    if (!message) {
      return res.json({
        success: true,
        message: 'No messages in queue',
        processed: false
      });
    }

    // Simulate message processing
    setTimeout(() => {
      message.status = 'completed';
      console.log(`Message processed successfully: ${JSON.stringify(message)}`);
    }, 1000);

    res.json({
      success: true,
      message: 'Message processing started',
      processed: true,
      messageId: message.id
    });

  } catch (error) {
    console.error('Queue processing error:', error);
    res.status(500).json({
      error: 'Queue processing error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Webhook Queue Test Server',
    version: '1.0.0',
    endpoints: {
      'POST /webhook': 'Send messages to the queue',
      'GET /queue/status': 'Check queue status',
      'POST /queue/process': 'Process messages from queue',
      'GET /health': 'Health check'
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Webhook server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Queue status: http://localhost:${port}/queue/status`);
});