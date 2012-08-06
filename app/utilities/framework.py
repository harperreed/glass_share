from google.appengine.ext import webapp
import os
from google.appengine.api import users
from google.appengine.ext.webapp.util import login_required

import traceback
from django.utils import simplejson 

from django.conf import settings
import sys
import logging
from google.appengine.api import mail
from google.appengine.ext.webapp import template

from django.template.loader import render_to_string

import webapp2
from webapp2_extras import sessions

import pprint
from webapp2_extras.security import generate_random_string,ASCII_PRINTABLE

"""
        __  .__.__  .__  __  .__               
 __ ___/  |_|__|  | |__|/  |_|__| ____   ______
|  |  \   __\  |  | |  \   __\  |/ __ \ /  ___/
|  |  /|  | |  |  |_|  ||  | |  \  ___/ \___ \ 
|____/ |__| |__|____/__||__| |__|\___  >____  >
                                     \/     \/ 
"""

class BaseHandler(webapp2.RequestHandler):
  def __init__(self, request, response):
    next_url = '/'
    self.initialize(request, response)

    self.misc_tags = {
        'current_version':os.environ["CURRENT_VERSION_ID"],
        'site_name':settings.SITE_NAME,
        'site_email':settings.SITE_EMAIL,
        }
    user = users.get_current_user()

   
    admin = users.is_current_user_admin()

    self.user = {
        'user':user,
        'is_admin':admin,
        'login_url':users.create_login_url(next_url),
        'logout_url':users.create_logout_url(next_url),
        }

  def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)

  @webapp2.cached_property
  def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

  def handle_exception(self, exception, debug_mode):
    error_message = []

    subject = 'Caught Exception for ' + os.environ['APPLICATION_ID']+': v'+os.environ['CURRENT_VERSION_ID']
    error_message.append(subject)

    error_message.append(str(exception))

    lines = ''.join(traceback.format_exception(*sys.exc_info()))
    error_message.append(lines)

    env = []
    for k, v in os.environ.iteritems():
      env.append(str(k) + " : "+ str(v))
    env = "\n".join(env)
    error_message.append(env)


    body = "\n------\n".join(error_message)
    logging.error(body)

    mail.send_mail_to_admins(sender='harper@nata2.org', subject=subject, body=body)
    template_values = {}
    template_values = dict(template_values, **self.user)
    template_values = dict(template_values, **self.misc_tags)
    if users.is_current_user_admin() or os.environ['SERVER_SOFTWARE']=='Development/1.0':
      template_values['traceback'] = body
    self.response.out.write(render_to_string('error.html', template_values))

  def render(self, filename, template_values):
    template_values = dict(template_values, **self.user)
    template_values = dict(template_values, **self.misc_tags)
    self.response.out.write(render_to_string(filename, template_values))

  def write(self, message):
    self.response.out.write(message)

  def write_json(self, json_object):
    self.response.out.write(simplejson.dumps(json_object))


def access_required(func):
  def wrapper(self, *args, **kw):
    if not self.user['user']:
      self.redirect('/')
    else:
      try:
        if not self.user['profile'].access:
          self.redirect('/invitation/?next='+self.request.uri)
          return 
      except:
        access = UserProfile(user=self.user['user'], access=False)
        access.save()
        self.redirect('/invitation/?next='+self.request.uri)
        return 
      func(self, *args, **kw)
  return wrapper

