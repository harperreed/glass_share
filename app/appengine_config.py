import logging
import os

logging.info("IMPORTING SETTINGS")

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

try:
    from google.appengine.dist import use_library
    use_library('django', '1.2')
except:
    pass

from django.conf import settings
_ = settings.TEMPLATE_DIRS

