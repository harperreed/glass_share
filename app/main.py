import os
import hashlib
import base64
import urllib
import logging
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import xmpp_handlers
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from google.appengine.api import urlfetch
from google.appengine.ext import search 
from google.appengine.api import taskqueue

from django.utils import simplejson 
from google.appengine.api import memcache
from google.appengine.api import users
from google.appengine.ext.webapp.util import login_required
import hashlib
import base64
import traceback
import sys
from google.appengine.api import mail
import time
import math

from django.conf import settings

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'contrib'))

import appengine_config

from routes import ROUTES

import webapp2
from handlers import site

"""
               .__        
  _____ _____  |__| ____  
 /     \\__  \ |  |/    \ 
|  Y Y  \/ __ \|  |   |  \
|__|_|  (____  /__|___|  /
      \/     \/        \/ 

"""

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': settings.SESSION_SECRET_KEY,
}

application = webapp2.WSGIApplication(ROUTES, config=config, debug=settings.DEBUG)

"""
def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
  
"""
