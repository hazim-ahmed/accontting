const whatsappService = require('../services/whatsappService');

const sendMessage = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

    const result = await whatsappService.sendMessage(ownerId, phone, message);
    
    if (result) {
      res.json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send message. Make sure your WhatsApp is paired and connected.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const pair = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    await whatsappService.initClient(ownerId, phone);
    res.json({ success: true, message: 'Pairing process initiated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to initiate pairing' });
  }
};

const getStatus = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const status = whatsappService.getStatus(ownerId);
    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get status' });
  }
};

const disconnect = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const result = await whatsappService.disconnectClient(ownerId);
    res.json({ success: result, message: result ? 'Disconnected successfully' : 'No active session found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
};

module.exports = {
  sendMessage,
  pair,
  getStatus,
  disconnect
};
