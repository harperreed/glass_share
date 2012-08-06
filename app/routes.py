import webapp2
from handlers import site

"""
                      __                 
_______  ____  __ ___/  |_  ____   ______
\_  __ \/  _ \|  |  \   __\/ __ \ /  ___/
 |  | \(  <_> )  |  /|  | \  ___/ \___ \ 
 |__|   \____/|____/ |__|  \___  >____  >
                               \/     \/ 
"""


API = []

SITE = [
    webapp2.Route(r'/', site.RootHandler),
    ]

ADMIN = []

ROUTES = []
ROUTES.extend(SITE)
ROUTES.extend(ADMIN)
ROUTES.append(webapp2.Route(r'/.*$', site.NotFoundHandler))


