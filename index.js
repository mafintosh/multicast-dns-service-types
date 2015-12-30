var prefix = function (name) {
  return '_' + name
}

var defined = function (name) {
  return name
}

var flatten = function (arr) {
  return Array.prototype.concat.apply.bind(Array.prototype.concat, [])(arr)
}

exports.stringify = function (data) {
  var domain = [data.serviceDomain, data.parentDomain || 'local'].filter(defined)
  var service = [data.name, data.protocol]

  // Do we have subtypes?
  if (data.subtypes && data.subtypes.length) {
    // _sub has to go to the front of the service
    service.unshift('sub')
  }

  return flatten([data.instance, data.subtypes, service.map(prefix), domain].filter(defined)).join('.')
}

exports.parse = function (str) {
  var parts = str.split('.')

  // Pull off subtypes or instance
  var subtypes = []
  if (parts.indexOf('_sub') !== -1) {
    subtypes = parts.splice(0, parts.indexOf('_sub'))

    // Discard _sub
    parts.shift()
  }

  // Remove leading _
  for (var i = 0; i < parts.length; i++) {
    if (parts[i][0] !== '_') continue
    parts[i] = parts[i].slice(1)
  }

  var instance = parts.shift()
  var name = parts.shift()
  var protocol = parts.shift()

  // If name is tcp or udp, it means we didnt have an instance name
  // so protocol goes back, name becomes instance and protocol becomes name
  // and instance becomes null
  if (name === 'tcp' || name === 'udp') {
    parts.unshift(protocol)
    protocol = name
    name = instance
    instance = null
  }

  var serviceDomain = parts.shift()
  var parentDomain = parts.shift()

  // Service domain is optional
  if (!parentDomain) {
    parentDomain = serviceDomain
    serviceDomain = null
  }

  // Trim trailing dot from parent domain if present
  if (parentDomain && parentDomain[parentDomain.length - 1] === '.') {
    parentDomain = parentDomain.slice(0, parentDomain.length - 1)
  }

  return {
    instance: instance,
    name: name,
    protocol: protocol,
    serviceDomain: serviceDomain,
    parentDomain: parentDomain,
    subtypes: subtypes
  }
}

exports.tcp = function (data) {
  data = data || {}
  data.protocol = 'tcp'
  return exports.stringify(data)
}

exports.tcp.http = function (data) {
  data = data || {}
  data.protocol = 'tcp'
  data.name = 'http'
  return exports.stringify(data)
}

exports.udp = function (data) {
  data = data || {}
  data.protocol = 'udp'
  return exports.stringify(data)
}
