const { Client, LocalAuth } = require('whatsapp-web.js');

class WhatsAppService {
  constructor() {
    this.clients = new Map(); // Key: ownerId, Value: { client, isReady, qr, pairingCode, status }
  }

  // Get status of a client
  getStatus(ownerId) {
    if (!this.clients.has(ownerId)) {
      return { status: 'disconnected', isReady: false };
    }
    const session = this.clients.get(ownerId);
    return {
      status: session.status,
      isReady: session.isReady,
      qr: session.qr,
      pairingCode: session.pairingCode
    };
  }

  // Initialize a client for an owner
  async initClient(ownerId, phoneNumber = null) {
    if (this.clients.has(ownerId)) {
      const existing = this.clients.get(ownerId);
      if (existing.isReady || existing.status === 'initializing') {
        return existing;
      }
      // If it failed or disconnected, destroy it first
      try {
        await existing.client.destroy();
      } catch (e) {}
      this.clients.delete(ownerId);
    }

    console.log(`Initializing WhatsApp Client for owner: ${ownerId}...`);
    
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: `owner-${ownerId}` }),
      puppeteer: {
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    });

    const session = {
      client,
      isReady: false,
      qr: null,
      pairingCode: null,
      status: 'initializing'
    };

    this.clients.set(ownerId, session);

    client.on('qr', async (qr) => {
      session.qr = qr;
      session.status = 'qr_ready';
      
      if (phoneNumber) {
        try {
          const cleanPhone = phoneNumber.replace(/\D/g, '');
          const code = await client.requestPairingCode(cleanPhone);
          session.pairingCode = code;
          session.status = 'pairing_ready';
          console.log(`Pairing code generated for owner ${ownerId}: ${code}`);
        } catch (error) {
          console.error(`Failed to request pairing code for owner ${ownerId}:`, error);
        }
      }
    });

    client.on('ready', () => {
      console.log(`WhatsApp Client for owner ${ownerId} is READY!`);
      session.isReady = true;
      session.status = 'connected';
      session.qr = null;
      session.pairingCode = null;
    });

    client.on('auth_failure', (msg) => {
      console.error(`WhatsApp Auth failure for owner ${ownerId}`, msg);
      session.status = 'auth_failure';
    });

    client.on('disconnected', (reason) => {
      console.log(`WhatsApp Client for owner ${ownerId} was disconnected`, reason);
      session.isReady = false;
      session.status = 'disconnected';
      try {
        client.destroy();
      } catch (e) {}
      this.clients.delete(ownerId);
    });

    client.initialize().catch(err => {
      console.error(`Error initializing client for owner ${ownerId}:`, err);
      session.status = 'failed';
    });

    return session;
  }

  // Send a message using a specific owner's client session
  async sendMessage(ownerId, to, message) {
    if (!this.clients.has(ownerId)) {
      console.log(`Cannot send message. WhatsApp Client not initialized for owner ${ownerId}.`);
      return false;
    }
    
    const session = this.clients.get(ownerId);
    if (!session.isReady) {
      console.log(`Cannot send message. WhatsApp Client for owner ${ownerId} is not ready.`);
      return false;
    }

    try {
      let formattedNumber = to.replace(/\D/g, '');
      if (!formattedNumber.endsWith('@c.us')) {
        formattedNumber = `${formattedNumber}@c.us`;
      }
      
      await session.client.sendMessage(formattedNumber, message);
      console.log(`Message sent from owner ${ownerId} to ${formattedNumber}`);
      return true;
    } catch (error) {
      console.error(`Error sending message from owner ${ownerId}:`, error);
      return false;
    }
  }

  // Disconnect client
  async disconnectClient(ownerId) {
    if (this.clients.has(ownerId)) {
      const session = this.clients.get(ownerId);
      try {
        await session.client.logout();
        await session.client.destroy();
      } catch (e) {
        console.error(`Error logging out/destroying client for owner ${ownerId}:`, e);
      }
      this.clients.delete(ownerId);
      return true;
    }
    return false;
  }
}

module.exports = new WhatsAppService();
