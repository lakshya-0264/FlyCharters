import nodemailer from "nodemailer"
import { ApiError } from "./apierror.js";
import {EmailVerification,DocumentReceivedNotification,DocumentVerificationCompletedNotification,DocumentVerificationRejectedNotification} from "./htmlEmail.js"
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
export async function emailverificationemail(email,verificationToken){
  const email_html=EmailVerification(verificationToken)
  try{
     const info=await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:email,
      subject:"Email Verification",
      html:email_html
     })
  }
  catch(err){
     console.log(err)
     throw new ApiError(500,"some problem with email sending process")
  }
}
export async function DocumentReceivedemail(email){
  const email_html=DocumentReceivedNotification()
  try{
     const info=await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:email,
      subject:"Email Verification",
      html:email_html
     })
  }
  catch(err){
     console.log(err)
     throw new ApiError(500,"some problem with email sending process")
  }
}
export async function DocumentVerificationemail(email,date){
  const email_html=DocumentVerificationCompletedNotification(date)
  try{
     const info=await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:email,
      subject:"Email Verification",
      html:email_html
     })
  }
  catch(err){
     console.log(err)
     throw new ApiError(500,"some problem with email sending process")
  }
}
export async function DocumentVerificationRejectionemail(email,date){
  const email_html=DocumentVerificationRejectedNotification(date)
  try{
     const info=await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:email,
      subject:"Email Verification",
      html:email_html
     })
  }
  catch(err){
     console.log(err)
     throw new ApiError(500,"some problem with email sending process")
  }
}
export async function notifyByEmail(email, subject, messageHtml) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:email,
      subject,
      html: messageHtml,
    });
    return info;
  } catch (err) {
    console.error('Email sending error:', err);
    throw new ApiError(500, 'Problem sending email notification');
  }
}

