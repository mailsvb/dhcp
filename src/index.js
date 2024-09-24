'use strict';

const dgram = require('node:dgram');
const events = require('node:events');
const { IpConverter, MacConverter, StripBinNull, DEFAULTS } = require('./utils.js');
const { DHCPOptions, DHCPMessageType, BOOTMessageType, Option } = require('./options.js');

class Packet {
    op = BOOTMessageType.request;
    htype = 1;
    hlen = 6;
    hops = 0;
    xid = 0;
    secs = 0;
    flags = 0;
    ciaddr = DEFAULTS.IP;
    yiaddr = DEFAULTS.IP;
    siaddr = DEFAULTS.IP;
    giaddr = DEFAULTS.IP;
    chaddr = DEFAULTS.MAC;
    sname = '';
    file = '';
    options = [];
    reinfo;
    get type() {
        let dhcpType = 0;
        this.options.some((option) => {
            if (option.type === DHCPOptions.DhcpMessageType) {
                dhcpType = option.value;
            }
            return !!dhcpType;
        });
        return dhcpType;
    }

    /**
     * Create Packet from buffer data.
     * @param {buffer} buffer 
     * @returns {*} new Packet instance
     */
    static fromBuffer(buffer) {
        const packet = new Packet();
        packet.fromBuffer(buffer);
        return packet;
    }

    /**
     * Get data from DHCP option
     * @param {number} type - Type of option
     * @returns {object} The data from the DHCP option
     */
    find(type) {
        let res = null;
        const options = this.options.filter((o) => o.type === type);
        if (options.length) {
            res = options[0];
        }
        return res;
    }

    /**
     * Sort options by type, ASC
     */
    sortOptions() {
        this.options.sort((a, b) => a.type < b.type ? -1 : (a.type > b.type ? 1 : 0))
    }

    /**
     * Turn packet instance into buffer
     * @returns {buffer} The packet in buffer format.
     */
    toBuffer() {
        const buffer = Buffer.alloc(512);
        buffer.fill(0);
        buffer[0] = this.op;
        buffer[1] = this.htype;
        buffer[2] = this.hlen;
        buffer[3] = this.hops;
        buffer.writeUIntBE(this.xid, 4, 4);
        buffer.writeUIntBE(this.secs, 8, 2);
        buffer.writeUIntBE(this.flags, 10, 2);
        buffer.write(IpConverter.encode(this.ciaddr).toString('binary'), 12, 16, 'binary');
        buffer.write(IpConverter.encode(this.yiaddr).toString('binary'), 16, 20, 'binary');
        buffer.write(IpConverter.encode(this.siaddr).toString('binary'), 20, 24, 'binary');
        buffer.write(IpConverter.encode(this.giaddr).toString('binary'), 24, 28, 'binary');
        const chaddr = MacConverter.encode(this.chaddr, this.hlen).toString('binary');
        buffer.write(chaddr, 28, chaddr.length, 'binary');
        buffer.write(this.sname, 44, 64, 'ascii');
        buffer.write(this.file, 108, 128, 'ascii');
        const lastOption = this.options[this.options.length - 1];
        if (lastOption && lastOption.type !== DHCPOptions.End) {
            this.options.push(Option.create(DHCPOptions.End));
        }
        buffer.write(Buffer.from([99, 130, 83, 99]).toString('binary'), 236, 4, 'binary');
        const options = this.options.map((option) => option.toBuffer());
        const raw = Buffer.concat(options).toString('binary');
        buffer.write(raw, 240, raw.length, 'binary');
        return buffer.subarray(0, 240 + raw.length);
    }

    /**
     * Import data into packet from buffer
     * @param {buffer} buffer - The packet in buffer format
     */
    fromBuffer(buffer) {
        this.op = buffer[0];
        this.htype = buffer[1];
        this.hlen = buffer[2];
        this.hops = buffer[3];
        this.xid = buffer.readUIntBE(4, 4);
        this.secs = buffer.readUIntBE(8, 2);
        this.flags = buffer.readUIntBE(10, 2);
        this.ciaddr = IpConverter.decode(buffer.slice(12, 16));
        this.yiaddr = IpConverter.decode(buffer.slice(16, 20));
        this.siaddr = IpConverter.decode(buffer.slice(20, 24));
        this.giaddr = IpConverter.decode(buffer.slice(24, 28));
        this.chaddr = MacConverter.decode(buffer.slice(28, 28 + this.hlen));
        this.sname = StripBinNull(buffer.toString('ascii', 44, 108));
        this.file = StripBinNull(buffer.toString('ascii', 108, 236));
        const optionsBuffer = buffer.slice(240);
        let pos = 0;
        let loop = true;
        while (loop) {
            if (optionsBuffer[pos] === 255 || pos >= optionsBuffer.length) {
                this.options.push(Option.create(DHCPOptions.End));
                loop = false;
            }
            else {
                const tag = optionsBuffer[pos];
                const len = optionsBuffer[pos + 1];
                const data = optionsBuffer.slice(pos, pos + 2 + len);
                const OptionClass = Option.getOption(tag);
                const option = OptionClass.fromBuffer(data);
                this.options.push(option);
                pos += len + 2;
            }
        }
    }

    /**
     * Print log of package
     * @returns {string} log output for packet.
     */
    log() {
        const str = [];
        str.push(`DHCP: ${DHCPMessageType[this.type] || 'UNKNOWN'}`);
        str.push(`xid: ${this.xid}`);
        str.push(`chaddr: ${this.chaddr}`);
        str.push(`ciaddr: ${this.ciaddr}`);
        str.push(`yiaddr: ${this.yiaddr}`);
        return str.join(' ');
    }

    /**
     * Print debug log of package
     * @returns {string} debug output for packet.
     */
    debug() {
        const str = [];
        str.push(`DHCP: ${DHCPMessageType[this.type] || 'UNKNOWN'}`);
        str.push(`=====================================`);
        str.push(`Message type (op): ${BOOTMessageType[this.op]}`);
        str.push(`Hardware address type (htype): ${this.htype}`);
        str.push(`hops: ${this.hops}`);
        str.push(`Transaction ID (xid): ${this.xid}`);
        str.push(`Seconds (secs): ${this.secs}`);
        str.push(`Flags: ${this.flags}`);
        str.push(`Client IP (ciaddr): ${this.ciaddr}`);
        str.push(`Your IP (yiaddr): ${this.yiaddr}`);
        str.push(`Server IP (siaddr): ${this.siaddr}`);
        str.push(`Relay agent IP (giaddr): ${this.giaddr}`);
        str.push(`Client hardware address (chaddr): ${this.chaddr}`);
        str.push(`Server host name (sname): ${this.sname}`);
        str.push(`Boot file name (file): ${this.file}`);
        str.push(`Options:`);
        this.options.map((option) => {
            let item = 'UNKNOWN';
            const val = option.value;
            if (Buffer.isBuffer(val)) {
                item = val.toString('hex');
            }
            else if (Array.isArray(val)) {
                item = `[${val.join(', ')}]`;
            }
            else if (typeof val === 'object') {
                item = JSON.stringify(val);
            }
            else {
                item = `${val}`;
            }
            str.push(`  ${DHCPOptions[option.type]}(${option.type}): ${item}`);
        });
        return str.join('\n');
    }
}

class Socket extends events.EventEmitter {
    listenPort;
    sendPort;
    type;
    socket;
    get address() {
        return this.socket.address();
    }
    constructor(type = 'udp4', inPort = 67, outPort = 68) {
        super();
        this.socket = dgram.createSocket(type);
        this.type = type;
        this.listenPort = inPort;
        this.sendPort = outPort;
        this.socket.on('listening', () => {
            this.socket.setBroadcast(true);
            this.emit('listening');
        });
        this.socket.on('error', (err) => {
            this.emit('error', err);
        });
        this.socket.on('message', this.onMessage.bind(this));
    }
    close() {
        this.emit('close');
        this.socket.close();
    }
    on() {
        return super.on.apply(this, arguments);
    }
    once() {
        return super.once.apply(this, arguments);
    }
    emit() {
        return super.emit.apply(this, arguments);
    }
    bind(address) {
        this.socket.bind(this.listenPort, address);
    }
    send(packet, address = DEFAULTS.BROADCAST, sendPort) {
        this.emit('send', {
            target: this,
            packet,
            address,
            sendPort,
        });
        packet.sortOptions();
        const buf = packet.toBuffer();
        if (typeof sendPort !== 'number') {
            sendPort = this.sendPort;
        }
        this.socket.send(buf, 0, buf.length, sendPort, address);
    }
    onMessage(msg, reinfo) {
        const buf = Buffer.from(msg, 'binary');
        const packet = Packet.fromBuffer(buf);
        packet.reinfo = reinfo;
        if ((packet.op === BOOTMessageType.request || packet.op === BOOTMessageType.reply) &&
            packet.options.some((option) => option.type === DHCPOptions.DhcpMessageType)) {
            this.emit('dhcp', { target: this, packet });
        }
    }
}

class Server extends Socket {
    /** @property {string} - The server identifier. */
    serverId = '127.0.0.1';
    ipAddress = {
        min: 10,
        max: 244,
    };
    netmask = '255.255.255.0';
    addressTime = 86400;
    renewalTime = 43200;
    rebindingTime = 21600;
    domainServer = [];
    gateways = [];
    domainName = 'osem.local'
    constructor(param) {
        super('udp4', 67, 68);
        if (typeof param === 'string') {
            this.serverId = param;
        }
        else {
            this.serverId = param.serverId;
            if (param.ipAddress) {
                if (param.ipAddress.min) {
                    this.ipAddress.min = param.ipAddress.min;
                }
                if (param.ipAddress.max) {
                    this.ipAddress.max = param.ipAddress.max;
                }
            }
            if (param.netmask) {
                this.netmask = param.netmask;
            }
            if (param.addressTime) {
                this.addressTime = param.addressTime;
                this.renewalTime = (this.addressTime * 0.5);
                this.rebindingTime = (this.renewalTime * 0.5);
            }
            if (param.domainServer) {
                this.domainServer = param.domainServer;
            }
            if (param.gateways) {
                this.gateways = param.gateways;
            }
            if (param.domainName) {
                this.domainName = param.domainName;
            }
        }
        this.on('dhcp', (e) => {
            const packet = e.packet;
            if (packet.op === BOOTMessageType.request) {
                const event = {
                    packet, target: this,
                };
                this.emit(DHCPMessageType[packet.type], event);
            }
        });
    }
    on() {
        return super.on.apply(this, arguments);
    }
    once() {
        return super.once.apply(this, arguments);
    }
    createOffer(pkt) {
        const p = new Packet();
        p.op = BOOTMessageType.reply;
        p.siaddr = this.serverId;
        p.giaddr = pkt.giaddr;
        p.xid = pkt.xid;
        p.flags = pkt.flags;
        p.chaddr = pkt.chaddr;
        p.options.push(Option.create(DHCPOptions.DhcpMessageType, DHCPMessageType.offer));
        p.options.push(Option.create(DHCPOptions.SubnetMask, this.netmask));
        if (this.gateways.length) {
            p.options.push(Option.create(DHCPOptions.Gateways, this.gateways));
        }
        p.options.push(Option.create(DHCPOptions.DomainName, this.domainName));
        if (this.domainServer.length) {
            p.options.push(Option.create(DHCPOptions.DomainServer, this.domainServer));
        }
        p.options.push(Option.create(DHCPOptions.AddressTime, this.addressTime));
        p.options.push(Option.create(DHCPOptions.RenewalTime, this.renewalTime));
        p.options.push(Option.create(DHCPOptions.RebindingTime, this.rebindingTime));
        p.options.push(Option.create(DHCPOptions.DhcpServerId, this.serverId));
        return p;
    }
    createAck(pkt) {
        const p = new Packet();
        p.op = BOOTMessageType.reply;
        p.xid = pkt.xid;
        p.siaddr = this.serverId;
        p.giaddr = pkt.giaddr;
        p.flags = pkt.flags;
        p.chaddr = pkt.chaddr;
        p.options.push(Option.create(DHCPOptions.DhcpMessageType, DHCPMessageType.ack));
        p.options.push(Option.create(DHCPOptions.SubnetMask, this.netmask));
        if (this.gateways.length) {
            p.options.push(Option.create(DHCPOptions.Gateways, this.gateways));
        }
        p.options.push(Option.create(DHCPOptions.DomainName, this.domainName));
        if (this.domainServer.length) {
            p.options.push(Option.create(DHCPOptions.DomainServer, this.domainServer));
        }
        p.options.push(Option.create(DHCPOptions.AddressTime, this.addressTime));
        p.options.push(Option.create(DHCPOptions.RenewalTime, this.renewalTime));
        p.options.push(Option.create(DHCPOptions.RebindingTime, this.rebindingTime));
        p.options.push(Option.create(DHCPOptions.DhcpServerId, this.serverId));
        return p;
    }
    createNak(pkt) {
        const p = new Packet();
        p.op = BOOTMessageType.reply;
        p.xid = pkt.xid;
        p.giaddr = pkt.giaddr;
        p.options.push(Option.create(DHCPOptions.DhcpMessageType, DHCPMessageType.nak));
        p.options.push(Option.create(DHCPOptions.DhcpServerId, this.serverId));
        return p;
    }
}


exports.Packet = Packet;
exports.Server = Server;
exports.Socket = Socket;
