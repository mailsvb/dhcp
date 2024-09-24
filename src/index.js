'use strict';

const dgram = require('node:dgram');
const events = require('node:events');
const { IpConverter, MacConverter, StripBinNull, DEFAULTS } = require('./utils.js');

const DHCPOptions = {};
DHCPOptions[DHCPOptions['Pad'] = 0] = 'Pad';
DHCPOptions[DHCPOptions['SubnetMask'] = 1] = 'SubnetMask';
DHCPOptions[DHCPOptions['TimeOffset'] = 2] = 'TimeOffset';
DHCPOptions[DHCPOptions['Gateways'] = 3] = 'Gateways';
DHCPOptions[DHCPOptions['TimeServer'] = 4] = 'TimeServer';
DHCPOptions[DHCPOptions['NameServer'] = 5] = 'NameServer';
DHCPOptions[DHCPOptions['DomainServer'] = 6] = 'DomainServer';
DHCPOptions[DHCPOptions['LogServer'] = 7] = 'LogServer';
DHCPOptions[DHCPOptions['QuotesServer'] = 8] = 'QuotesServer';
DHCPOptions[DHCPOptions['LPRServer'] = 9] = 'LPRServer';
DHCPOptions[DHCPOptions['ImpressServer'] = 10] = 'ImpressServer';
DHCPOptions[DHCPOptions['RLPServer'] = 11] = 'RLPServer';
DHCPOptions[DHCPOptions['Hostname'] = 12] = 'Hostname';
DHCPOptions[DHCPOptions['BootFileSize'] = 13] = 'BootFileSize';
DHCPOptions[DHCPOptions['MeritDumpFile'] = 14] = 'MeritDumpFile';
DHCPOptions[DHCPOptions['DomainName'] = 15] = 'DomainName';
DHCPOptions[DHCPOptions['SwapServer'] = 16] = 'SwapServer';
DHCPOptions[DHCPOptions['RootPath'] = 17] = 'RootPath';
DHCPOptions[DHCPOptions['ExtensionFile'] = 18] = 'ExtensionFile';
DHCPOptions[DHCPOptions['Forward'] = 19] = 'Forward';
DHCPOptions[DHCPOptions['SrcRte'] = 20] = 'SrcRte';
DHCPOptions[DHCPOptions['PolicyFilter'] = 21] = 'PolicyFilter';
DHCPOptions[DHCPOptions['MaxDGAssembly'] = 22] = 'MaxDGAssembly';
DHCPOptions[DHCPOptions['DefaultIpTtl'] = 23] = 'DefaultIpTtl';
DHCPOptions[DHCPOptions['MtuTimeout'] = 24] = 'MtuTimeout';
DHCPOptions[DHCPOptions['MtuPlateau'] = 25] = 'MtuPlateau';
DHCPOptions[DHCPOptions['MtuInterface'] = 26] = 'MtuInterface';
DHCPOptions[DHCPOptions['MtuSubnet'] = 27] = 'MtuSubnet';
DHCPOptions[DHCPOptions['BroadcastAddress'] = 28] = 'BroadcastAddress';
DHCPOptions[DHCPOptions['MaskDiscovery'] = 29] = 'MaskDiscovery';
DHCPOptions[DHCPOptions['MaskSupplier'] = 30] = 'MaskSupplier';
DHCPOptions[DHCPOptions['RouterDiscovery'] = 31] = 'RouterDiscovery';
DHCPOptions[DHCPOptions['RouterRequest'] = 32] = 'RouterRequest';
DHCPOptions[DHCPOptions['StaticRoute'] = 33] = 'StaticRoute';
DHCPOptions[DHCPOptions['Trailers'] = 34] = 'Trailers';
DHCPOptions[DHCPOptions['ArpTimeout'] = 35] = 'ArpTimeout';
DHCPOptions[DHCPOptions['Ethernet'] = 36] = 'Ethernet';
DHCPOptions[DHCPOptions['DefaultTcpTtl'] = 37] = 'DefaultTcpTtl';
DHCPOptions[DHCPOptions['KeepaliveTime'] = 38] = 'KeepaliveTime';
DHCPOptions[DHCPOptions['KeepaliveData'] = 39] = 'KeepaliveData';
DHCPOptions[DHCPOptions['NisDomain'] = 40] = 'NisDomain';
DHCPOptions[DHCPOptions['NisServers'] = 41] = 'NisServers';
DHCPOptions[DHCPOptions['NtpServers'] = 42] = 'NtpServers';
DHCPOptions[DHCPOptions['VendorSpecific'] = 43] = 'VendorSpecific';
DHCPOptions[DHCPOptions['NetbiosNameSrv'] = 44] = 'NetbiosNameSrv';
DHCPOptions[DHCPOptions['NetbiosDistSrv'] = 45] = 'NetbiosDistSrv';
DHCPOptions[DHCPOptions['NetbiosNoteType'] = 46] = 'NetbiosNoteType';
DHCPOptions[DHCPOptions['NetbiosScope'] = 47] = 'NetbiosScope';
DHCPOptions[DHCPOptions['XWindowFont'] = 48] = 'XWindowFont';
DHCPOptions[DHCPOptions['XWindowManmager'] = 49] = 'XWindowManmager';
DHCPOptions[DHCPOptions['AddressRequest'] = 50] = 'AddressRequest';
DHCPOptions[DHCPOptions['AddressTime'] = 51] = 'AddressTime';
DHCPOptions[DHCPOptions['Overload'] = 52] = 'Overload';
DHCPOptions[DHCPOptions['DhcpMessageType'] = 53] = 'DhcpMessageType';
DHCPOptions[DHCPOptions['DhcpServerId'] = 54] = 'DhcpServerId';
DHCPOptions[DHCPOptions['ParameterList'] = 55] = 'ParameterList';
DHCPOptions[DHCPOptions['DhcpMessage'] = 56] = 'DhcpMessage';
DHCPOptions[DHCPOptions['DhcpMaxMsgSize'] = 57] = 'DhcpMaxMsgSize';
DHCPOptions[DHCPOptions['RenewalTime'] = 58] = 'RenewalTime';
DHCPOptions[DHCPOptions['RebindingTime'] = 59] = 'RebindingTime';
DHCPOptions[DHCPOptions['ClassId'] = 60] = 'ClassId';
DHCPOptions[DHCPOptions['ClientId'] = 61] = 'ClientId';
DHCPOptions[DHCPOptions['NetwareIpDomain'] = 62] = 'NetwareIpDomain';
DHCPOptions[DHCPOptions['NetwareIpOption'] = 63] = 'NetwareIpOption';
DHCPOptions[DHCPOptions['TftpServer'] = 66] = 'TftpServer';
DHCPOptions[DHCPOptions['BootFile'] = 67] = 'BootFile';
DHCPOptions[DHCPOptions['End'] = 255] = 'End';

const DHCPMessageType = {};
DHCPMessageType[DHCPMessageType['discover'] = 1] = 'discover';
DHCPMessageType[DHCPMessageType['offer'] = 2] = 'offer';
DHCPMessageType[DHCPMessageType['request'] = 3] = 'request';
DHCPMessageType[DHCPMessageType['decline'] = 4] = 'decline';
DHCPMessageType[DHCPMessageType['ack'] = 5] = 'ack';
DHCPMessageType[DHCPMessageType['nak'] = 6] = 'nak';
DHCPMessageType[DHCPMessageType['release'] = 7] = 'release';
DHCPMessageType[DHCPMessageType['inform'] = 8] = 'inform';

const BOOTMessageType = {};
BOOTMessageType[BOOTMessageType['request'] = 1] = 'request';
BOOTMessageType[BOOTMessageType['reply'] = 2] = 'reply';

class Option {
    type;
    name;
    value;
    constructor(type, value) {
        this.type = type;
        this.name = DHCPOptions[type];
        if (value !== void 0) {
            this.value = value;
        }
    }

    static fromBuffer(data) {
        const option = new this();
        option.fromBuffer(data);
        return option;
    }

    static create(type, ...args) {
        const option = Option.getOption(type);
        return new option(...args)
    }

    static getOption(type) {
        switch (type) {
            case DHCPOptions.SubnetMask:
                return SubnetMaskOption;
            case DHCPOptions.Gateways:
                return GatewaysOption;
            case DHCPOptions.DomainServer:
                return DomainServerOption;
            case DHCPOptions.Hostname:
                return HostnameOption;
            case DHCPOptions.DomainName:
                return DomainNameOption;
            case DHCPOptions.AddressRequest:
                return AddressRequestOption;
            case DHCPOptions.VendorSpecific:
                return VendorSpecificOption;
            case DHCPOptions.AddressTime:
                return AddressTimeOption;
            case DHCPOptions.DhcpMessageType:
                return DHCPMessageTypeOption;
            case DHCPOptions.DhcpServerId:
                return DHCPServerIdOption;
            case DHCPOptions.ParameterList:
                return ParameterListOption;
            case DHCPOptions.DhcpMessage:
                return DhcpMessageOption;
            case DHCPOptions.DhcpMaxMsgSize:
                return DhcpMaxMsgSizeOption;
            case DHCPOptions.RenewalTime:
                return RenewalTimeOption;
            case DHCPOptions.RebindingTime:
                return RebindingTimeOption;
            case DHCPOptions.ClientId:
                return ClientIdentifierOption;
            case DHCPOptions.ClassId:
                return ClassIdOption;
            case DHCPOptions.TftpServer:
                return TftpServerOption;
            case DHCPOptions.BootFile:
                return BootFileOption;
            case DHCPOptions.BroadcastAddress:
                return BroadcastAddressOption;
            case DHCPOptions.NtpServers:
                return NtpServersOption;
            case DHCPOptions.End:
                return EndOption;
            default:
                return UnknownOption;
        }
    }
}

class EndOption extends Option {
    constructor() {
        super(DHCPOptions.End, null);
    }
    toBuffer() {
        return Buffer.from([255]);
    }
    fromBuffer(data) {
        this.value = null;
    }
}
class Uint8Option extends Option {
    toBuffer() {
        return Buffer.from([this.type, 1, this.value]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data[2];
    }
}
class Uint16Option extends Option {
    toBuffer() {
        const buf = Buffer.from([this.type, 2, 0, 0]);
        buf.writeUInt16BE(this.value, 2);
        return buf;
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.readUInt16BE(2);
    }
}
class Uint32Option extends Option {
    toBuffer() {
        const buf = Buffer.from([this.type, 4, 0, 0, 0, 0]);
        buf.writeUInt32BE(this.value, 2);
        return buf;
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.readUInt32BE(2);
    }
}
class DHCPMessageTypeOption extends Uint8Option {
    constructor(type = DHCPMessageType.discover) {
        super(DHCPOptions.DhcpMessageType, type);
    }
}
class IpAddressOption extends Option {
    toBuffer() {
        return Buffer.concat([
            Buffer.from([this.type, 4]),
            IpConverter.encode(this.value),
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = IpConverter.decode(data.slice(2));
    }
}
class NumberListOption extends Option {
    toBuffer() {
        return Buffer.concat([
            Buffer.from([this.type, this.value.length]),
            Buffer.from(this.value),
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        const buf = data.slice(2);
        const value = [];
        for (let i = 0; i < buf.length; i++) {
            value.push(buf[i]);
        }
        this.value = value;
    }
}
class BufferOption extends Option {
    toBuffer() {
        return Buffer.concat([
            Buffer.from([this.type, this.value.length]),
            this.value,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.slice(2);
    }
}
class Utf8Option extends Option {
    toBuffer() {
        const text = Buffer.from(this.value, 'utf8');
        return Buffer.concat([
            Buffer.from([this.type, text.byteLength]),
            text,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.slice(2).toString('utf8');
    }
}
class ParameterListOption extends NumberListOption {
    constructor(data) {
        super(DHCPOptions.ParameterList, data);
    }
}
class DhcpMessageOption extends BufferOption {
    constructor(data) {
        super(DHCPOptions.DhcpMessage, data);
    }
}
class DhcpMaxMsgSizeOption extends Uint16Option {
    constructor(data) {
        super(DHCPOptions.DhcpMaxMsgSize, data);
    }
}
class HostnameOption extends Utf8Option {
    constructor(data) {
        super(DHCPOptions.Hostname, data);
    }
}
class DomainNameOption extends Utf8Option {
    constructor(data) {
        super(DHCPOptions.DomainName, data);
    }
}
class AddressRequestOption extends IpAddressOption {
    constructor(data) {
        super(DHCPOptions.AddressRequest, data);
    }
}
class DHCPServerIdOption extends IpAddressOption {
    constructor(data) {
        super(DHCPOptions.DhcpServerId, data);
    }
}
class SubnetMaskOption extends IpAddressOption {
    constructor(data) {
        super(DHCPOptions.SubnetMask, data);
    }
}
class BroadcastAddressOption extends IpAddressOption {
    constructor(data) {
        super(DHCPOptions.BroadcastAddress, data);
    }
}
class AddressTimeOption extends Uint32Option {
    constructor(data) {
        super(DHCPOptions.AddressTime, data);
    }
}
class RenewalTimeOption extends Uint32Option {
    constructor(data) {
        super(DHCPOptions.RenewalTime, data);
    }
}
class RebindingTimeOption extends Uint32Option {
    constructor(data) {
        super(DHCPOptions.RebindingTime, data);
    }
}
class TftpServerOption extends Utf8Option {
    constructor(data) {
        super(DHCPOptions.TftpServer, data);
    }
}
class BootFileOption extends Utf8Option {
    constructor(data) {
        super(DHCPOptions.BootFile, data);
    }
}
class ClientIdentifierOption extends Option {
    constructor(data) {
        super(DHCPOptions.ClientId, data);
    }
    toBuffer() {
        const chaddr = MacConverter.encode(this.value.chaddr);
        return Buffer.concat([
            Buffer.from([this.type, chaddr.byteLength + 1, this.value.htype]),
            chaddr,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = {
            htype: data[2],
            chaddr: MacConverter.decode(data.slice(3)),
        };
    }
}
class IpAddressListOption extends Option {
    toBuffer() {
        let buffers = this.value.map((addr) => IpConverter.encode(addr));
        buffers = [Buffer.from([this.type, this.value.length * 4])].concat(buffers);
        return Buffer.concat(buffers);
    }
    fromBuffer(data) {
        const res = [];
        data = data.slice(2);
        const count = data.length / 4;
        for (let i = 0; i < count; i++) {
            res.push(IpConverter.decode(data.slice(i * 4, i * 4 + 4)));
        }
        this.value = res;
    }
}
class GatewaysOption extends IpAddressListOption {
    constructor(data) {
        super(DHCPOptions.Gateways, data);
    }
}
class DomainServerOption extends IpAddressListOption {
    constructor(data) {
        super(DHCPOptions.DomainServer, data);
    }
}
class NtpServersOption extends IpAddressListOption {
    constructor(data) {
        super(DHCPOptions.NtpServers, data);
    }
}
class ClassIdOption extends BufferOption {
    constructor(data) {
        super(DHCPOptions.ClassId, data);
    }
}
class VendorSpecificOption extends Option {
    constructor(data) {
        super(DHCPOptions.VendorSpecific, data);
    }
    toBuffer() {
        const buffer = [];
        const tags = Object.keys(this.value)
        tags.sort();
        for(const tag of tags) {
            // console.log(`${tag}: ${this.value[tag]}`);
            const value = this.value[tag];
            switch (tag) {
                case '1':
                case '3':
                case '4':
                    const tagData = Buffer.from(value.toString());
                    buffer.push(tag)
                    buffer.push(tagData.length.toString().toString(16))
                    buffer.push(...tagData)
                    break;
                case '2':
                    const vlanData = Buffer.alloc(4)
                    vlanData.writeUInt32BE(parseInt(value), 0);
                    buffer.push(tag)
                    buffer.push(vlanData.length.toString().toString(16))
                    buffer.push(...vlanData)
                    break;
            }
        }
        buffer.push(255)
        return Buffer.concat([
            Buffer.from([this.type, buffer.length]),
            Buffer.from(buffer),
        ]);
    }
    fromBuffer(data) {
        this.value = {};
        const length = parseInt(data[1]) - 1;
        const payload = data.slice(2, length + 2)
        for (let i = 0; i < length; ) {
            const tag = payload.readIntBE(i, 1);
            const tagLength = payload.readIntBE(i + 1, 1);
            const tagData = payload.subarray(i + 2, i + 2 + tagLength);
            switch (tag) {
                case 1:
                case 3:
                case 4:
                    this.value[tag] = tagData.toString();
                    break;
                case 2:
                    this.value[tag] = tagData.readUInt32BE();
                    break;
            }
            i += (1 + 1 + tagLength);
        }
    }
}

class UnknownOption extends BufferOption {
}

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
exports.Option = Option;
exports.DHCPOptions = DHCPOptions;
exports.DHCPMessageType = DHCPMessageType;
exports.BOOTMessageType = BOOTMessageType;
