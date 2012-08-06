"""GAE-god (http://gae-god.googlecode.com/) presents a very minimal admin
interface to App Engine APIs.

In your app.yaml file make sure that the anchor point for this app matches the
one specified in the 'root' global variable. Also make sure that ``login:
admin`` is specified in the app.yaml file::

    - url: /god/.*
      script: god.py
      login: admin

"""
from google.appengine.api import memcache
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from string import Template
import pprint


class MainPage(webapp.RequestHandler):

    """Main landing page for god."""

    html = Template("""
    <html>
        <head>
            <title>GAE-god</title>
        </head>
        <body>
        <p><a href="/">HOME</a>
        <p><a href="${logout}">Logout</a>
        <p><a href="forget">Flush memcache</a>
        <p>Memcache stats:<br>
        <pre>
            ${memcache_stats}
        </pre>
        <p style="font-size: xx-small">
            <a href="http://gae-god.googlecode.com/">GAE-god project page</a>
        </body>
    </html>""")

    def get(self):
        logout = users.create_logout_url('%s/' % root)
        stats = pprint.pformat(memcache.get_stats())
        self.response.out.write(self.html.substitute(logout=logout,
                                memcache_stats=stats))


class MemcacheFlush(webapp.RequestHandler):

    """Flush the memcache."""

    def get(self):
        result = memcache.flush_all()
        if not result:
            self.error(503)
        else:
            try:
                referrer = self.request.headers['referer']
            except KeyError:
                referrer = '%s/' % root
            self.redirect(referrer)


root = '/god'
pages = [('', MainPage),
         ('forget', MemcacheFlush),
        ]


god = webapp.WSGIApplication([('%s/%s' % (root, part), cls)
                                for part, cls in pages])


def main():
    run_wsgi_app(god)


if __name__ == '__main__':
    main()
