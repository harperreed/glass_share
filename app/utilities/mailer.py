from django.conf import settings
from simple_sendgrid import simple_sendgrid
import os
from django.template.loader import render_to_string

class mailer:
  def __init__(self):
    self.sendgrid = simple_sendgrid(api_user=settings.SENDGRID_USERNAME,api_key=settings.SENDGRID_KEY)

    self.misc_tags = {
        'current_version':os.environ["CURRENT_VERSION_ID"],
        'site_name':settings.SITE_NAME,
        'site_email':settings.SITE_EMAIL,
        'site_address':settings.SITE_ADDRESS,
        'site_phone':settings.SITE_PHONE,
        'site_domain':os.environ['SERVER_NAME'],
        'unsubscribe_link':'http://'+os.environ['SERVER_NAME']+'/account/email'

        }

  def send(self, to_address="", from_address=None,fromname=None, replyto=None, subject="", template="generic", values={}):
    template_values = dict(values, **self.misc_tags)

    text_filename = "email_"+template+".txt"
    text_body = render_to_string(text_filename, template_values)

    html_filename = "email_"+template+".html"
    html_body= render_to_string(html_filename, template_values)

    if not from_address:
      from_address=settings.SENDGRID_FROM

    if not fromname:
      fromname=settings.SITE_NAME

    if not replyto:
      replyto=settings.SENDGRID_REPLY

    request = {
      'to_address':to_address,
      'from_address':from_address,
      'fromname':fromname,
      'subject':'['+settings.SITE_NAME+'] '+subject,
      'text':text_body,
      'html':html_body,
      'replyto':replyto


    }

    return self.sendgrid.mail_send(**request)

