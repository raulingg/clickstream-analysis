;(function(siteClientId, io, window) {
  var visitorId = undefined
  var cookieName = 'clickstream'
  var EVENT_TYPES = {
    PAGE_VISITED: 'pageVisited',
    LINK_CLICKED: 'linkClicked'
  }

  var socketOptions = {
    query: { token: siteClientId }
  }

  var socket = io('http://localhost:5000/', socketOptions)

  socket.on('connect', function() {
    console.log('Connected to socket server')    
  })

  window.onload = function() {
    console.log('send event: ' + EVENT_TYPES.PAGE_VISITED)

    if (!getUniqueVisitorId()) {
      visitorId = createUniqueVisitorId()
    }

    socket.send({
      visitorIdentity: visitorId,
      event: EVENT_TYPES.PAGE_VISITED,
      data: {
        pathname: window.location.pathname,
        hostname: window.location.hostname,
        url: window.location.href
      }
    })
  }

  window.document.onclick = function(event) {
    //IE doesn't pass in the event object
    event = event || window.event

    var currentPathName = window.location.pathname
    //IE uses srcElement as the target
    var target = event.target || event.srcElement

    if (target.localName !== 'a') {
      return
    }

    // it doesn't consider hash links
    if (target.hash) {
      return
    }

    console.log('send event: ' + EVENT_TYPES.LINK_CLICKED)

    socket.send({
      visitorIdentity: getUniqueVisitorId(),
      event: EVENT_TYPES.LINK_CLICKED,
      data: {
        referer: currentPathName,
        pathname: target.pathname,
        hostname: window.location.hostname,
        url: window.location.href
      }
    })
  }

  function createUniqueVisitorId(days = 365) {
    var expirationDate = new Date()
    expirationDate.setTime(
      expirationDate.getTime() + days * 60 * 60 * 24 * 1000
    )
    var uniqueVisitorId =
      Math.floor(Math.random() * 9000000000) +
      1000000000 +
      '.' +
      expirationDate.getTime()
    var expires = 'expires=' + expirationDate.toGMTString()
    window.document.cookie = cookieName + '=' + uniqueVisitorId + '; ' + expires

    return uniqueVisitorId
  }

  function getUniqueVisitorId() {
    if (visitorId === undefined) {
      visitorId = getCookieValue()
    }

    return visitorId
  }

  function resetCookie(days = 365) {
    var cookie = getCookie()

    if (cookie) {
      var expirationDate = new Date()
      expirationDate.setTime(
        expirationDate.getTime() + days * 60 * 60 * 24 * 1000
      )
      var expires = 'expires=' + expirationDate.toGMTString()
      window.document.cookie = cookieName + '=' + visitorId + '; ' + expires
    }
  }

  function getCookieValue() {
    var name = cookieName + '='
    var cookies = window.document.cookie.split(';')

    for (var i = 0, length = cookies.length; i < length; i++) {
      var cookie = cookies[i].trim()

      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length)
      }
    }

    return null
  }
})(siteClientId, io, window)
