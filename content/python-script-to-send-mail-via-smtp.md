Title: Python script to send mail via SMTP
Date: 2011-02-20 12:43
Author: nipunbatra
Category: Blog
Tags: Python
Slug: python-script-to-send-mail-via-smtp

    import smtplib
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 587
    sender = 'a@a.com '##Enter your mail id here
    password = ''####Enter your password here
    recipient = ''##Enter recepient mail id here
    subject = ''##Enter subject here
    body = 'Enter here the body of the mail'
    "Sends an e-mail to the specified recipient."
    body = "" + body + ""
    headers = ["From: " + sender,
               "Subject: " + subject,
               "To: " + recipient,
               "MIME-Version: 1.0",
               "Content-Type: text/html"]
    headers = "\r\n".join(headers)
    session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    session.ehlo()
    session.starttls()
    session.ehlo
    session.login(sender, password)
    session.sendmail(sender, recipient, headers + "\r\n\r\n" + body)
    session.quit()

Liked it??
