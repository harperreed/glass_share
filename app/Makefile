runserver:
	python /usr/local/google_appengine/dev_appserver.py .
deploy :
	python /usr/local/google_appengine/appcfg.py --oauth2 update .

clean :
	find . -name \*.pyc | xargs -n 100 rm
