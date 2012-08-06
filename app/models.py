"""
                  .___     .__          
  _____   ____   __| _/____ |  |   ______
 /     \ /  _ \ / __ |/ __ \|  |  /  ___/
|  Y Y  (  <_> ) /_/ \  ___/|  |__\___ \ 
|__|_|  /\____/\____ |\___  >____/____  >
      \/            \/    \/          \/ 

"""
class Example(db.Model):
    title = db.StringProperty(required=True)
    description = db.TextProperty()
    date_added = db.DateTimeProperty(auto_now_add=True)
    date_last_edited = db.DateTimeProperty(auto_now=True)
 

