const { IpConverter, MacConverter } = require('./utils.js');

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

exports.DHCPOptions = DHCPOptions;
exports.DHCPMessageType = DHCPMessageType;
exports.BOOTMessageType = BOOTMessageType;
exports.AddressRequestOption = AddressRequestOption;
exports.BootFileOption = BootFileOption;
exports.BufferOption = BufferOption;
exports.ClassIdOption = ClassIdOption;
exports.ClientIdentifierOption = ClientIdentifierOption;
exports.DhcpMessageOption = DhcpMessageOption;
exports.DomainNameOption = DomainNameOption;
exports.HostnameOption = HostnameOption;
exports.IpAddressListOption = IpAddressListOption;
exports.IpAddressOption = IpAddressOption;
exports.NumberListOption = NumberListOption;
exports.Option = Option;
exports.ParameterListOption = ParameterListOption;
exports.RebindingTimeOption = RebindingTimeOption;
exports.RenewalTimeOption = RenewalTimeOption;
exports.TftpServerOption = TftpServerOption;
