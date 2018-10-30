;(function(siteClientId, io, window, document) {
  var visitorId = getUniqueVisitorId()
  var socketOptions = {
    query: { token: siteClientId }
  }

  var socket = io('http://localhost:5000/', socketOptions)

  socket.on('connect', function() {
    console.log('connected')

    if (!visitorId) {
      visitorId = createUniqueVisitorId()
    }
  })

  window.onload = function() {
    this.console.log('send event: pageVisited')
    socket.send({
      visitorIdentity: visitorId,
      event: 'pageVisited',
      data: {        
        pathname: window.location.pathname,
        hostname: window.location.hostname,
        url: window.location.href
      }
    })
  }

  // window.document.onclick = function(event) {
  //   //IE doesn't pass in the event object
  //   event = event || window.event

  //   //IE uses srcElement as the target
  //   var target = event.target || event.srcElement
  //   if (target.localName === 'a') {
  //     console.log(target.href)
  //     socket.send({ event: 'linkClicked', link: target.href })
  //   }
  // }

  function createUniqueVisitorId(days = 365) {
    var expirationDate = new Date()
    expirationDate.setTime(
      expirationDate.getTime() + days * 60 * 60 * 24 * 1000
    )
    var value =
      Math.floor(Math.random() * 9000000000) +
      1000000000 +
      '.' +
      expirationDate.getTime()
    var expires = 'expires=' + expirationDate.toGMTString()
    window.document.cookie = 'analytics=' + value + '; ' + expires

    return value
  }

  function getUniqueVisitorId() {
    if (!visitorId) {
      visitorId = retrieveUniqueVisitorIdFromCookie()
    }

    return visitorId
  }

  function retrieveUniqueVisitorIdFromCookie() {
    var name = 'analytics='
    var cookies = window.document.cookie.split(';')

    for (var i = 0, length = cookies.length; i < length; i++) {
      var cookie = cookies[i].trim()

      if (cookie.indexOf(name) == 0)
        return cookie.substring(name.length, cookie.length)
    }

    return null
  }
})('7ih36n776lgq2vo3', io, window, document)
