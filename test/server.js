
const assert = require('assert');
const { Server, Packet } = require ('../src/index.js');

describe("Server", () => {

    const pkt = new Packet();
    const hex = "0101060074c6d3c9000000000000000000000000000000000000000054a050e7dfd700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501033d070154a050e7dfd73204ac1102833604ac1102030c084b6972696c6c5043510b0000004b6972696c6c50433c084d53465420352e30370d0103060f1f212b2c2e2f79f9fcff";
    const hexWithSortedOptions = "0101060074c6d3c9000000000000000000000000000000000000000054a050e7dfd700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253630c084b6972696c6c50433204ac1102833501033604ac110203370d0103060f1f212b2c2e2f79f9fc3c084d53465420352e303d070154a050e7dfd7510b0000004b6972696c6c5043ff";
    const s = new Server("192.168.1.1");

    context("create server", () => {
        it("with settings", () => {
            const settings = {
                serverId: "192.168.1.1",
                gateways: ["192.168.1.1"],
                domainServer: ["192.168.1.1"],
                ipAddress: {
                    min: 35,
                    max: 200,
                },
                netmask: "255.255.255.15",
                addressTime: 86400,
            };
            const server = new Server(settings);

            assert.equal(server.serverId, "192.168.1.1");
            assert.equal(server.ipAddress.min, 35);
            assert.equal(server.ipAddress.max, 200);
            assert.equal(server.netmask, "255.255.255.15");
        });

        it("without min or max ipAddress", () => {
            const settings = {
                serverId: "192.168.1.4",
                ipAddress: {
                },
            };
            const server = new Server(settings);

            assert.equal(server.serverId, "192.168.1.4");
            assert.equal(server.ipAddress.min, 10);
            assert.equal(server.ipAddress.max, 244);
        });

        it("on dhcp", (done) => {
            const server1 = new Server("192.168.1.1");
            server1.listenPort = 1969;
            server1.sendPort = 1970;

            const server2 = new Server("192.168.1.1");
            server2.listenPort = 1970;
            server2.sendPort = 1969;

            server2.on("dhcp", (e) => {
                assert.equal(e.target, server2);
                assert.equal(e.packet.toBuffer().toString("hex"), hexWithSortedOptions);
                server2.close();
                done();
            });

            server1.bind();
            server2.bind();

            const packet = Packet.fromBuffer(Buffer.from(hex, "hex"));
            server1.send(packet);
        });
    });

    context("Creates DHCP Packet", () => {
        s.gateways = ["192.168.1.1"];
        s.domainServer = ["192.168.1.1"];

        it("createOffer", () => {
            s.createOffer(pkt);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.join(), "192.168.1.1");
            assert.equal(s.domainServer.join(), "192.168.1.1");

        });
        it("createOffer empty gateways & domainServer", () => {
            const server = new Server("192.168.1.1");
            server.createOffer(pkt);

            assert.equal(server.serverId, "192.168.1.1");
            assert.equal(server.gateways.length, 0);
            assert.equal(server.domainServer.length, 0);
        });

        it("createAck", () => {
            s.createAck(pkt);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.join(), "192.168.1.1");
            assert.equal(s.domainServer.join(), "192.168.1.1");
        });

        it("createAck empty gateways & domainServer & type = request", () => {
            const server = new Server("192.168.1.1");
            const packet = Packet.fromBuffer(Buffer.from(hex, "hex"));
            server.createAck(packet);

            assert.equal(server.serverId, "192.168.1.1");
            assert.equal(server.gateways.length, 0);
            assert.equal(server.domainServer.length, 0);
            assert.equal(packet.type, 3);
        });

        it("createNak", () => {
            s.createNak(pkt);
            assert.equal(s.serverId, "192.168.1.1");
        });
    });
});
