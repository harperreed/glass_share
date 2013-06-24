#Share Google Glass media to an email address

This is a simple glass mirror api that shares your media to an email. 

You can share to flickr, dropbox, ifttt, etc

**Coder?** Check out the goodies in [app/](https://github.com/harperreed/glass_share/tree/master/app)


###Usage

1. Go to: [https://glass-share.appspot.com/](https://glass-share.appspot.com/)
2. Login with your glass enabled account. 
3. Enter your email address
4. Share media with the contact called `GlassShare`
5. &nbsp;
6. Profit (or images shared to that email address)

####Protips:

* [Email a photo to flickr](http://www.flickr.com/account/uploadbyemail/)
* [Email media to tumblr](http://www.tumblr.com/docs/en/email_publishing)
* [Email media to Dropbox](http://www.labnol.org/software/upload-dropbox-files-by-email/18526/) (**ghetto**)
* [Email file to almost anything (ifttt)](https://ifttt.com/channels/email/triggers/25)

###Inspiration

Inspired by the need for a way to share media without going to plus. Also [@obra](http://twitter.com/obra) kept sharing to flickr from his glass and i wanted to do the same. 


###Contact

ok. hit me up

* [@harper](http://twitter.com/harper)
* [harper@nata2.org](mailto:harper@nata2.org)

###Thoughts on the mirror API

* **Confusing** - The ideas in the mirror api are interesting. However, it was hard to figure out **what the heck** was going on. The example apps are a bit "callbacky" and are not quite straight forward as they could have been. once i got my head wrapped around the metaphor, it was a bit easy to understand what the fuck was going on. 
* **Timeline** - does every piece of media on the timeline get posted back to googles servers? This makes for some interesting oppotunities (tweak this code and back up ALL media to dropbox, etc). It is weird however, that you cannot do anything without posting it to the timeline. 
* **Contacts** - The ideas around contacts is interesting. It is too bad that the API requires apps to be contacts to be able to send/share things with it. It sort of makes sense once you get going, but it is a weird metaphor to wrap your head around. 

More later..