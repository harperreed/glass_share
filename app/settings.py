import os

DEBUG = True

SITE_NAME = "example app"
SITE_AUTHOR = "Harper Reed"
SITE_DOMAIN = "example.org"
SITE_EMAIL = "questions@"+SITE_DOMAIN

SENDGRID_USERNAME = ''
SENDGRID_KEY = ''
SENDGRID_REPLY = 'noreply@'+SITE_DOMAIN
SENDGRID_FROM = 'info@'+SITE_DOMAIN

SESSION_SECRET_KEY = ''

TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), "templates"))
