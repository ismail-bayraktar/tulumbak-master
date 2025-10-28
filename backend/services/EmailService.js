import nodemailer from 'nodemailer';

/**
 * Email Service for sending transactional emails
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  /**
   * Initialize SMTP transporter
   */
  init() {
    if (!process.env.SMTP_HOST) {
      console.warn('Email service not configured. Set SMTP environment variables to enable email notifications.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log('Email service initialized');
  }

  /**
   * Send email with confirmation
   * @param {Object} mailOptions - Email options
   * @returns {Promise<Object>}
   */
  async sendEmail(mailOptions) {
    if (!this.transporter) {
      console.log('Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send order confirmation email
   * @param {Object} orderData - Order details
   * @param {String} to - Recipient email
   * @returns {Promise<Object>}
   */
  async sendOrderConfirmation(orderData, to) {
    const mailOptions = {
      from: `"Tulumbak Baklava" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Siparişiniz Alındı - #' + orderData.orderId,
      html: this.getOrderConfirmationTemplate(orderData),
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Send order status update email
   * @param {Object} orderData - Order details
   * @param {String} status - New status
   * @param {String} to - Recipient email
   * @returns {Promise<Object>}
   */
  async sendOrderStatusUpdate(orderData, status, to) {
    const mailOptions = {
      from: `"Tulumbak Baklava" <${process.env.SMTP_USER}>`,
      to,
      subject: `Sipariş Durumunuz Güncellendi - #${orderData.orderId}`,
      html: this.getOrderStatusUpdateTemplate(orderData, status),
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Send courier assignment email
   * @param {Object} orderData - Order details
   * @param {String} to - Recipient email
   * @returns {Promise<Object>}
   */
  async sendCourierAssignment(orderData, to) {
    const mailOptions = {
      from: `"Tulumbak Baklava" <${process.env.SMTP_USER}>`,
      to,
      subject: `Siparişiniz Yola Çıktı - #${orderData.orderId}`,
      html: this.getCourierAssignmentTemplate(orderData),
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Send delivery completed email
   * @param {Object} orderData - Order details
   * @param {String} to - Recipient email
   * @returns {Promise<Object>}
   */
  async sendDeliveryCompleted(orderData, to) {
    const mailOptions = {
      from: `"Tulumbak Baklava" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Siparişiniz Teslim Edildi - Tulumbak',
      html: this.getDeliveryCompletedTemplate(orderData),
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Get order confirmation email template
   * @param {Object} orderData - Order details
   * @returns {String}
   */
  getOrderConfirmationTemplate(orderData) {
    const itemsHtml = orderData.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₺${item.price?.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₺${(
          item.price * item.quantity
        ).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #d4af37; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .total { font-size: 18px; font-weight: bold; color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧁 Siparişiniz Alındı!</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Siparişiniz başarıyla alındı. Sipariş numaranız: <strong>#${orderData.orderId || orderData._id}</strong></p>
              <p>Sipariş detaylarınız:</p>
              <table>
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Adet</th>
                    <th>Birim Fiyat</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              <p class="total">Toplam Tutar: ₺${orderData.amount.toFixed(2)}</p>
              <p><strong>Ödeme Yöntemi:</strong> ${orderData.paymentMethod}</p>
              <p>Teşekkür ederiz!</p>
              <p>Tulumbak İzmir Baklava</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get order status update email template
   * @param {Object} orderData - Order details
   * @param {String} status - New status
   * @returns {String}
   */
  getOrderStatusUpdateTemplate(orderData, status) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .status { background: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Sipariş Durumunuz Güncellendi</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Siparişinizin (#${orderData.orderId || orderData._id}) durumu güncellendi.</p>
              <div class="status">
                <strong>Yeni Durum: ${status}</strong>
              </div>
              <p>Siparişinizi takip etmeye devam edebilirsiniz.</p>
              <p>Teşekkür ederiz!</p>
              <p>Tulumbak İzmir Baklava</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get courier assignment email template
   * @param {Object} orderData - Order details
   * @returns {String}
   */
  getCourierAssignmentTemplate(orderData) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .tracking { background: #2196F3; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 Siparişiniz Yola Çıktı!</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Siparişiniz (#${orderData.orderId || orderData._id}) kuryeye teslim edildi ve yola çıktı!</p>
              ${orderData.courierTrackingId ? `<div class="tracking"><strong>Takip Numarası:</strong> ${orderData.courierTrackingId}</div>` : ''}
              <p>Siparişiniz yakında kapınızda olacak.</p>
              <p>Teşekkür ederiz!</p>
              <p>Tulumbak İzmir Baklava</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get delivery completed email template
   * @param {Object} orderData - Order details
   * @returns {String}
   */
  getDeliveryCompletedTemplate(orderData) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .success { background: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Siparişiniz Teslim Edildi!</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Harika haber! Siparişiniz (#${orderData.orderId || orderData._id}) başarıyla teslim edildi.</p>
              <div class="success">
                <strong>Afiyet olsun! 🧁</strong>
              </div>
              <p>Bizimle alışveriş yaptığınız için teşekkür ederiz. Tekrar görüşmek üzere!</p>
              <p>Sevgiler,<br>Tulumbak İzmir Baklava</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

const emailService = new EmailService();

export default emailService;

