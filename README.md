# dhcpd.js

dhcpd.js is a Node.js implementation of a DHCP server. It provides a
simple and efficient way to handle DHCP events in your network.

[![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/mailsvb/dhcp/master/LICENSE)
[![Node.js CI](https://github.com/mailsvb/dhcp/actions/workflows/test.yml/badge.svg)](https://github.com/mailsvb/dhcp/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/dhcpd.js.svg)](https://badge.fury.io/js/dhcpd.js)

[![NPM](https://nodei.co/npm/dhcpd.js.png)](https://nodei.co/npm/dhcpd.js/)

## Installation

You can install dhcpd.js using npm:

```bash
npm install dhcpd.js
```

### Monitor Example

```javascript
const { Server } = require('dhcpd.js');

const s = new Server('192.168.1.1');

s.on("dhcp", (e) => {
  console.log(e.packet.debug());
});

s.bind();
```

### Server Example

```javascript
const { BOOTMessageType, Server } = require('dhcpd.js');

const s = new Server({
  serverId: "192.168.1.1",
  gateways: ["192.168.1.1"],
  domainServer: ["192.168.1.1"]
});

s.on("listening", () => {
  console.log("Server start", s.address);
});

const ips = {};

s.on("discover", (e) => {
  const { packet } = e;
  console.log(packet.log());

  let ip = "0.0.0.0";
  if (Object.keys(ips).includes(packet.chaddr)) {
    ip = ips[packet.chaddr];
  } else {
    ip = `192.168.1.${Object.keys(ips).length + 2}`;
  }
  ips[packet.chaddr] = ip;

  const offer = s.createOffer(packet);
  offer.yiaddr = ip;

  console.log(offer.log());
  s.send(offer);
});

s.on("request", (e) => {
  const { packet } = e;
  console.log(packet.log());

  const ack = s.createAck(packet);
  ack.yiaddr = ips[packet.chaddr];

  console.log(ack.log());
  s.send(ack);
});

s.on("release", (e) => {
  const { packet } = e;
  console.log(packet.log());
  delete ips[packet.chaddr];
});

s.bind();
```

## RFC

For more information about DHCP, you can refer to the following RFCs:

- [Dynamic Host Configuration Protocol](https://tools.ietf.org/html/rfc2131)
- [DHCP Options and BOOTP Vendor Extensions](https://tools.ietf.org/html/rfc2132)

## Related Projects

- [dhcpjs](https://github.com/apaprocki/node-dhcpjs)
- [node-dhcpd](https://github.com/glaszig/node-dhcpd)
- [forge](https://github.com/konobi/forge/blob/master/lib/dhcpd.js)
