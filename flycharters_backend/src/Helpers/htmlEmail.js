export function EmailVerification(VerificationCode){
    const emailhtml=`<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .header h1 {
                margin: 0;
                color: #333333;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
            }
            .content p {
                color: #666666;
                font-size: 16px;
                line-height: 1.5;
            }
            .content .code {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #dddddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <h2>Hello,</h2>
                <p>Thank you for registering with us. To complete your registration, please verify your email address by entering the following verification code:</p>
                <div class="code">${VerificationCode}</div>
                <p>If you did not request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Flycharts. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `
    return emailhtml
}
export const generateWelcomeEmailHtml =(name) => {
  return `
          <html>
            <head>
              <style>
                .email-container {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  padding: 20px;
                  background-color: #f0f8ff;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: auto;
                }
                .email-header {
                  background-color: #007BFF;
                  color: white;
                  padding: 10px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .email-body {
                  padding: 20px;
                  background-color: white;
                  border-radius: 0 0 10px 10px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .email-footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #555;
                }
                .cta-button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  background-color: #007BFF;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                }
                .cta-button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="email-header">
                  <h1>Welcome to FlyCharters!</h1>
                </div>
                <div class="email-body">
                  <p>Hi ${name},</p>
                  <p>We're thrilled to have you on board! Your email has been successfully verified, and you're now ready to explore the world with FlyCharters.</p>
                  <p>Book your next adventure with ease and enjoy exclusive offers tailored just for you.</p>
                  <a href="https://flycharters.com" class="cta-button">Start Booking Now</a>
                  <p>If you have any questions or need assistance, our support team is here to help.</p>
                  <p>Safe travels!<br/>The FlyCharters Team</p>
                </div>
                <div class="email-footer">
                  <p>&copy; 2024 FlyCharters. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;
};

export const securityAlertEmailHtml= `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Security Alert: Email Updated</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .header h1 {
                margin: 0;
                color: #d9534f;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
            }
            .content p {
                color: #666666;
                font-size: 16px;
                line-height: 1.5;
            }
            .content .alert {
                font-size: 20px;
                font-weight: bold;
                color: #d9534f;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Security Alert: Email Updated</h1>
            </div>
            <div class="content">
                <h2>Hello {username},</h2>
                <p>Your email address has been successfully updated.</p>
                <p><strong>Old Email:</strong> {oldEmail}</p>
                <p><strong>New Email:</strong> {newEmail}</p>
                <p>If you did not make this change, please contact support immediately.</p>
                <p class="alert">If this was you, no further action is required.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Flycharts. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
export function DocumentReceivedNotification() {
    const DocumentVerification = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Received</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            color: #333333;
            font-size: 22px;
        }
        .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Document Received</h1>
        </div>
        <div class="content">
            <h2>Hello,</h2>
            <p>We have successfully received your document.</p>
            <p>Thank you for submitting the required documentation. Our team at <strong>flight Charters</strong> will begin the verification process shortly.</p>
            <p>You will be notified once the verification is complete or if additional information is needed.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 flight charters. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    return DocumentVerification;
}
export function DocumentVerificationCompletedNotification(submittedDate) {
    const formattedDate = new Date(submittedDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const DocumentVerificationCompleted = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Verification Completed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #28a745;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            color: #333333;
            font-size: 22px;
        }
        .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }
        .highlight {
            font-weight: bold;
            color: #333333;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verification Completed</h1>
        </div>
        <div class="content">
            <h2>Congratulations!</h2>
            <p>Your documents submitted to <span class="highlight">Flight Charter</span> on <span class="highlight">${formattedDate}</span> have been successfully verified.</p>
            <p>The verification process is now complete. You may proceed with the next steps.</p>
            <p>If you need further assistance, please reach out to our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 flight charter. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    return DocumentVerificationCompleted;
}
export function MissingOrAdditionalDocumentsNotification(recipientCompany, submittedDate, missingInfo) {
    const formattedDate = new Date(submittedDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const DocumentMissingNotification = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Additional Documents Required</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #ffc107;
            color: #333333;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            color: #333333;
            font-size: 22px;
        }
        .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }
        .highlight {
            font-weight: bold;
            color: #333333;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Additional Documents Needed</h1>
        </div>
        <div class="content">
            <h2>Attention Required</h2>
            <p>We received your documents submitted to <span class="highlight">${recipientCompany}</span> on <span class="highlight">${formattedDate}</span>.</p>
            <p>However, to proceed further with the verification process, we need the following additional or missing documents/information:</p>
            <p class="highlight">${missingInfo}</p>
            <p>Please submit the required documents at your earliest convenience. If you have already sent them, kindly ignore this message.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ${recipientCompany}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    return DocumentMissingNotification;
}
export function DocumentVerificationRejectedNotification(submittedDate) {
    const formattedDate = new Date(submittedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const DocumentVerificationRejected = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Verification Rejected</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #dc3545;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            color: #333333;
            font-size: 22px;
        }
        .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }
        .highlight {
            font-weight: bold;
            color: #333333;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verification Rejected</h1>
        </div>
        <div class="content">
            <h2>We're Sorry</h2>
            <p>Your documents submitted to <span class="highlight">Flight Charter</span> on <span class="highlight">${formattedDate}</span> could not be verified.</p>
            <p>Please review the documents and resubmit them as per the required guidelines.</p>
            <p>If you have questions or need assistance, contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Flight Charter. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    
    return DocumentVerificationRejected;
}
export function GenericEmailTemplate(title, message) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        margin: 0;
        color: #333333;
      }
      .content {
        padding: 20px;
      }
      .content p {
        color: #444444;
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        <p>${message}</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Flycharts. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
  return html;
}

