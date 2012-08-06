from utilities import framework

"""
                     __                .__  .__                       
  ____  ____   _____/  |________  ____ |  | |  |   ___________  ______
_/ ___\/  _ \ /    \   __\_  __ \/  _ \|  | |  | _/ __ \_  __ \/  ___/
\  \__(  <_> )   |  \  |  |  | \(  <_> )  |_|  |_\  ___/|  | \/\___ \ 
 \___  >____/|___|  /__|  |__|   \____/|____/____/\___  >__|  /____  >
     \/           \/                                  \/           \/ 

"""
class RootHandler(framework.BaseHandler):
  def get(self):
      self.render("main.html",{})

class NotFoundHandler(framework.BaseHandler):
  def get(self):
      self.write("not found")

