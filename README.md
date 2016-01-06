# multicast-dns-service-types

Parse and stringify mdns service names

```
npm install multicast-dns-service-types
```

[![build status](http://img.shields.io/travis/mafintosh/multicast-dns-service-types.svg?style=flat)](http://travis-ci.org/mafintosh/multicast-dns-service-types)

## Usage

``` js
var types = require('multicast-dns-service-types')

console.log(types.stringify({
  name: 'http',
  protocol: 'tcp',
  subtypes: ['foo', 'bar']
})) // foo.bar._sub._http._tcp.local.

console.log(types.stringify({
  instance: 'TheService'
  name: 'http',
  protocol: 'tcp',
  serviceDomain: 'FoobarsLaptop',
  parentDomain: 'example.com'
})) // TheService._http._tcp.FoobarsLaptop.example.com

console.log(types.parse('foo.bar._sub._http._tcp.local.'))
/*
{
  instance: null,
  name: 'http',
  protocol: 'tcp',
  subtypes: ['foo', 'bar'],
  serviceDomain: null,
  parentDomain: 'local'
}
*/
```

The following shorthands also exist

``` js
types.tcp(data) // set protocol to tcp
types.tcp.http(data) // set protocol to tcp and name to http
types.udp(data) // set protocol to udp
```

## License

MIT
