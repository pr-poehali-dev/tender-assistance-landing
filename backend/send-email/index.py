import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту ak4urinal@yandex.ru через Яндекс SMTP."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    message = body.get('message', '')

    smtp_password = os.environ['YANDEX_SMTP_PASSWORD']
    from_email = 'ak4urinal@yandex.ru'
    to_email = 'ak4urinal@yandex.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name}'
    msg['From'] = from_email
    msg['To'] = to_email

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a2b4e; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #c9a03d; margin: 0; font-size: 22px;">Новая заявка с сайта ТендерПро</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;">Имя</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Телефон</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">{phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">{email if email else '—'}</td>
                </tr>
                {"<tr><td style='padding: 10px 0; color: #666;'>Сообщение</td><td style='padding: 10px 0;'>" + message + "</td></tr>" if message else ""}
            </table>
            <div style="margin-top: 24px; padding: 12px; background: #fff3cd; border-radius: 6px; font-size: 13px; color: #856404;">
                Ответьте на заявку в течение 30 минут — это повышает конверсию в клиента.
            </div>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
