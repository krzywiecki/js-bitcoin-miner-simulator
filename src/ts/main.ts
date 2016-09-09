class BitcoinMiner {
    public hash;
    public generatedHashes = 0;
    public exploredBitcoins = 0;

    public $hashesBelt = document.querySelector('[data-hashes]');
    public $generatedHashesCounter = document.querySelector('[data-generated-hashes]');
    public $generatedBitcoinsCounter = document.querySelector('[data-generated-bitcoins]');
    public $generatedUSDCounter = document.querySelector('[data-generated-USD]');

    constructor() {
        this.hash = Math.random().toString();
    }

    generateHash() {

        let K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        let H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];

        this.hash += String.fromCharCode(0x80);

        let l = this.hash.length/4 + 2;
        let N = Math.ceil(l/16);
        let M = new Array(N);

        for (let i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (let j = 0; j < 16; j++) {
                M[i][j] = (this.hash.charCodeAt(i*64+j*4)<<24) | (this.hash.charCodeAt(i*64+j*4+1)<<16) | 
                          (this.hash.charCodeAt(i*64+j*4+2)<<8) | (this.hash.charCodeAt(i*64+j*4+3));
            }
        }

        M[N-1][14] = ((this.hash.length-1)*8) / Math.pow(2, 32);
        M[N-1][14] = Math.floor(M[N-1][14]);
        M[N-1][15] = ((this.hash.length-1)*8) & 0xffffffff;

        let W = new Array(64); 
        let a, b, c, d, e, f, g, h;
        
        for (let i = 0; i < N; i++) {

            for (let t = 0;  t < 16; t++) {
                W[t] = M[i][t];
            }

            for (let t = 16; t < 64; t++) {
                W[t] = (this.σ1(W[t-2]) + W[t-7] + this.σ0(W[t-15]) + W[t-16]) & 0xffffffff;
            }

            a = H[0];
            b = H[1]; 
            c = H[2]; 
            d = H[3]; 
            e = H[4]; 
            f = H[5]; 
            g = H[6]; 
            h = H[7];

            for (let t = 0; t < 64; t++) {
                let T1 = h + this.Σ1(e) + this.Ch(e, f, g) + K[t] + W[t];
                let T2 =     this.Σ0(a) + this.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }

            H[0] = (H[0]+a) & 0xffffffff;
            H[1] = (H[1]+b) & 0xffffffff; 
            H[2] = (H[2]+c) & 0xffffffff; 
            H[3] = (H[3]+d) & 0xffffffff; 
            H[4] = (H[4]+e) & 0xffffffff;
            H[5] = (H[5]+f) & 0xffffffff;
            H[6] = (H[6]+g) & 0xffffffff; 
            H[7] = (H[7]+h) & 0xffffffff; 
        }

        this.generatedHashes++;

        return this.toHexStr(H[0]) + this.toHexStr(H[1]) + this.toHexStr(H[2]) + this.toHexStr(H[3]) + 
               this.toHexStr(H[4]) + this.toHexStr(H[5]) + this.toHexStr(H[6]) + this.toHexStr(H[7]);
    }

    ROTR(n, x) {
        return (x >>> n) | (x << (32-n));
    }

    Σ0(x) {
        return this.ROTR(2,  x) ^ this.ROTR(13, x) ^ this.ROTR(22, x);
    }

    Σ1(x) { 
        return this.ROTR(6,  x) ^ this.ROTR(11, x) ^ this.ROTR(25, x); 
    }

    σ0(x) {
        return this.ROTR(7,  x) ^ this.ROTR(18, x) ^ (x>>>3);
    }

    σ1(x) { 
        return this.ROTR(17, x) ^ this.ROTR(19, x) ^ (x>>>10); 
    }

    Ch(x, y, z) { 
        return (x & y) ^ (~x & z); 
    }

    Maj(x, y, z) { 
        return (x & y) ^ (x & z) ^ (y & z); 
    }
 
    toHexStr(n) {
        let s = "";
        let v;

        for (let i = 7; i >= 0; i--) { 
            v = (n>>>(i*4)) & 0xf;
            s += v.toString(16);
        }
        
        return s;
    };

    explore() {
        let self = this;
        this.hash = this.generateHash();
        this.updateView();

        if(this.hash) {
            clearTimeout(a);
            var a = setTimeout(function() {
                self.explore();
            }, 1);
        }
    }

    countExploredBitcoins() {
        //About 40 TeraHash will make 1 BTC - http://bitcoin.sipa.be/
        let oneHashValue = 0.000000000000025; //in BTC
        this.exploredBitcoins = this.generatedHashes * oneHashValue;
        return this.exploredBitcoins;
    }

    updateView() {
        let generatedBitcoins = this.countExploredBitcoins().toFixed(12);
        this.$generatedHashesCounter.innerHTML = this.generatedHashes.toString();
        this.$generatedBitcoinsCounter.innerHTML = generatedBitcoins + ' ฿';
        this.$generatedUSDCounter.innerHTML = (generatedBitcoins * 622.62).toFixed(9) + ' $'; // BTC price 9.09.2016
        
        this.$hashesBelt.innerHTML += '<span>' + this.hash + '</span>';
        let firstHash = this.$hashesBelt.getElementsByTagName('span')[0];
        firstHash.parentNode.removeChild(firstHash);
    }

}

let miner = new BitcoinMiner();
miner.explore();