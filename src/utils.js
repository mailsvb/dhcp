'use strict'

const DEFAULTS = Object.freeze({
    IP_SPLITTER: '.',
    MAC_SPLITTER: ':',
    IP: '0.0.0.0',
    MAC: '00:00:00:00:00:00',
    BROADCAST: '255.255.255.255'
})

const IpConverter = {
    encode(data) {
        if (!data) {
            data = DEFAULTS.IP;
        }
        const octets = data.split(DEFAULTS.IP_SPLITTER);
        const buffer = Buffer.alloc(octets.length);
        octets.forEach((octet, index) => buffer[index] = Number(octet));
        return buffer;
    },
    decode(data) {
        const res = [];
        for (let i = 0; i < data.length; i++) {
            res.push(data[i].toString());
        }
        return res.join(DEFAULTS.IP_SPLITTER);
    },
};
const MacConverter = {
    encode(data, len) {
        if (len) {
            const regex = new RegExp(`^([0-9a-f]{2}[:-]){${(len - 1)}}([0-9a-f]{2})`, 'i');
            if (!regex.test(data)) {
                throw new Error('Wrong MAC incoming data');
            }
        }
        if (!data) {
            data = DEFAULTS.IP;
        }
        const octets = data.replace(new RegExp(DEFAULTS.MAC_SPLITTER, 'g'), '');
        const buffer = Buffer.from(octets, 'hex');
        return buffer;
    },
    decode(data, len) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            res.push(Buffer.from([data[i]]).toString('hex').toUpperCase());
        }
        if (len) {
            res = res.slice(0, len);
        }
        return res.join(DEFAULTS.MAC_SPLITTER);
    },
};
const StripBinNull = (str) => {
    const pos = str.indexOf('\u0000');
    let res = str;
    if (pos !== -1) {
        res = str.substr(0, pos);
    }
    return res;
}

exports.IpConverter = IpConverter;
exports.MacConverter = MacConverter;
exports.StripBinNull = StripBinNull;
exports.DEFAULTS = DEFAULTS;
