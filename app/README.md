#Glass upload. 
##A way to upload to flickr from glass


---

This was derived from the  Google Mirror API's Quickstart for Python

The documentation for this quickstart is maintained on developers.google.com.
Please see here for more information:
https://developers.google.com/glass/quickstart/python

---


##Generate session.secret

`python -c "import os; print os.urandom(64)" > session.secret`