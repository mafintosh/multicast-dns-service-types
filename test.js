var tape = require('tape')
var type = require('./')

tape('stringifies', function (t) {
  t.same(type.stringify({
    name: 'http',
    protocol: 'tcp'
  }), '_http._tcp.local')
  t.same(type.stringify({
    name: 'http',
    protocol: 'tcp',
    serviceDomain: 'FoobarsLaptop'
  }), '_http._tcp.FoobarsLaptop.local')
  t.same(type.stringify({
    name: 'http',
    protocol: 'tcp',
    serviceDomain: 'FoobarsLaptop',
    instance: 'TheService'
  }), 'TheService._http._tcp.FoobarsLaptop.local')
  t.same(type.stringify({
    name: 'http',
    protocol: 'tcp',
    serviceDomain: 'FoobarsLaptop',
    subtypes: ['foo']
  }), 'foo._sub._http._tcp.FoobarsLaptop.local')
  t.same(type.stringify({
    name: 'http',
    protocol: 'tcp',
    serviceDomain: 'FoobarsLaptop',
    subtypes: ['foo', 'bar']
  }), 'foo.bar._sub._http._tcp.FoobarsLaptop.local')
  t.end()
})

tape('parses', function (t) {
  t.same(type.parse('_http._tcp.local'), {
	instance: null,
    name: 'http',
    protocol: 'tcp',
    parentDomain: 'local',
    serviceDomain: null,
    subtypes: []
  })
  t.same(type.parse('_http._tcp.FoobarsLaptop.local'), {
	instance: null,
    name: 'http',
    protocol: 'tcp',
    parentDomain: 'local',
    serviceDomain: 'FoobarsLaptop',
    subtypes: []
  })
  t.same(type.parse('TheService._http._tcp.FoobarsLaptop.local'), {
	instance: 'TheService',
    name: 'http',
    protocol: 'tcp',
    parentDomain: 'local',
    serviceDomain: 'FoobarsLaptop',
    subtypes: []
  })
  t.same(type.parse('foo._sub._http._tcp.FoobarsLaptop.local'), {
	instance: null,
    name: 'http',
    protocol: 'tcp',
    parentDomain: 'local',
    serviceDomain: 'FoobarsLaptop',
    subtypes: ['foo']
  })
  t.same(type.parse('bar.foo._sub._http._tcp.FoobarsLaptop.local'), {
	instance: null,
    name: 'http',
    protocol: 'tcp',
    parentDomain: 'local',
    serviceDomain: 'FoobarsLaptop',
    subtypes: ['bar', 'foo']
  })
  t.end()
})

tape('shorthands', function (t) {
  t.same(type.tcp({
    name: 'http'
  }), '_http._tcp.local')
  t.same(type.udp({
    name: 'http'
  }), '_http._udp.local')
  t.same(type.tcp.http(), '_http._tcp.local')
  t.end()
})
