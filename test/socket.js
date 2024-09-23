
const assert = require('assert');
const { Socket, Packet } = require ('../src/index.js');

context("socket", () => {

    it("open", (done) => {
        const socket = new Socket("udp4", 1967, 1968);

        socket.on("listening", () => {
            assert.equal(socket.address.port, 1967);
            socket.close();
            done();
        });

        socket.bind();
    });

    it("default constructor", () => {
        const socket = new Socket();
        assert.equal(socket.listenPort, 67);
        assert.equal(socket.sendPort, 68);
        assert.equal(socket.type, "udp4");
    });

    context("send sockets", () => {

        const socket1 = new Socket("udp4", 1967, 1968);
        const socket2 = new Socket("udp4", 1968, 1967);

        before((done) => {
            socket1.bind();
            socket2.bind();

            let refCount = 2;

            function listening() {
                refCount--;
                if (!refCount) {
                    done();
                }
            }

            socket1.on("listening", listening);
            socket2.on("listening", listening);
        });

        after((done) => {

            let refCount = 2;

            function close() {
                refCount--;
                if (!refCount) {
                    done();
                }
            }

            socket1.on("close", close);
            socket2.on("close", close);

            socket1.close();
            socket2.close();
        });

        it("port", () => {
            assert.equal(socket1.address.port, 1967);
            assert.equal(socket2.address.port, 1968);
        });

        it("send request", (done) => {
            const hex = "01010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253630c064379626f7267350108370d010f03062c2e2f1f2179f92bfc3c084d53465420352e303d0701485b3902a59dff";
            const packet = Packet.fromBuffer(Buffer.from(hex, "hex"));

            socket1.send(packet);

            socket2.once("dhcp", (e) => {
                assert.equal(e.target, socket2);
                assert.equal(e.packet.toBuffer().toString("hex"), hex);
                done();
            });
        });

        it("send reply", (done) => {
            const hex = "02010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253630c064379626f7267350108370d010f03062c2e2f1f2179f92bfc3c084d53465420352e303d0701485b3902a59dff";
            const packet = Packet.fromBuffer(Buffer.from(hex, "hex"));
            socket1.send(packet);

            socket2.once("dhcp", (e) => {
                assert.equal(e.target, socket2);
                assert.equal(e.packet.toBuffer().toString("hex"), hex);
                done();
            });
        });

        it("send reply", () => {
            const hex = "02010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501083d0701485b3902a59d0c064379626f72673c084d53465420352e30370d010f03062c2e2f1f2179f92bfcff";
            const packet = Packet.fromBuffer(Buffer.from(hex, "hex"));
            packet.op = 3;
            socket1.send(packet);
        });

        it("on error", (done) => {
            const s3 = new Socket("udp4", 1967, 1968);
            s3.on("error", (e) => {
                assert.equal(e.name, "Error");
                done();
            });
            s3.bind();
        });
    });
});
