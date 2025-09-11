import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import SibApiV3Sdk from 'sib-api-v3-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
host: "sandbox.smtp.mailtrap.io",
port: 2525,
auth: {
    user: "5c5b02c2a785c4",
    pass: "730ba728d83743"
}
});

// Load template and replace placeholders
function loadTemplate(templateName, replacements = {}) {
  const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
  let html = fs.readFileSync(templatePath, "utf-8");

  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, replacements[key]);
  }
  return html;
}

// Send blog email
export async function sendBlogEmail(subscribers, blog, unsubscribeLinkBase) {
  try {
    // Convert blog.sections array → HTML
    const sectionsHtml = blog.sections
      .map(
        (sec) => `
        <div class="section">
          <h2>${sec.title}</h2>
          <p>${sec.body}</p>
        </div>
      `
      )
      .join("");

    // 3. Prepare Brevo SMTP client
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    const smtpClient = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Send email to each subscriber with personalized unsubscribe link
    for (const sub of subscribers) {
      const unsubscribeLink = `${unsubscribeLinkBase}${sub.unsubscribeToken}`;
      const htmlContent = loadTemplate("mailTemplate", {
        title: blog.title,
        blogImage: blog.blogImage,
        sections: sectionsHtml,
        unsubscribe_link: unsubscribeLink,
      });

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: sub.email }];
      sendSmtpEmail.sender = { email: 'oussama.chaouch@sesame.com.tn', name: 'Blog Updates' };
      sendSmtpEmail.subject = `New Blog Post: ${blog.title}`;
      sendSmtpEmail.htmlContent = htmlContent;

      await smtpClient.sendTransacEmail(sendSmtpEmail);
    }

    // const info = await transporter.sendMail({
    //     from: '"BlogTech Newsletter" <newsletter@blogtech.com>', // sender name + fake email
    //     to: "test@example.com", // this won’t go to real email, it goes to Mailtrap inbox
    //     subject: `New Blog Post: ${blog.title}`,
    //     text: "Hello, thanks for subscribing!",
    //     html: htmlContent,
    // });
    console.log("✅ Blog email sent to subscribers!");

  } catch (err) {
    console.error("❌ Error sending blog email:", err);
  }
}