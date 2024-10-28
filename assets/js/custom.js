/*-------------output.min.js-----------------*/
function SpectrumDisplay(e, t) {
    (this.rootElement = e),
        (this.canvasRef = document.createElement("canvas")),
        (this.canvasRef.id = "editor-spectrum"),
        (this.canvasRef.height = 100),
        t.appendChild(this.canvasRef),
        (this.canvasRef.width = t.clientWidth),
        (this.canvasRef.height = t.clientHeight),
        (this.buffer = new Float32Array(this.canvasRef.width)),
        (this.min = -150),
        (this.max = 0),
        (this.range = this.max - this.min),
        (this.minRange = this.canvasRef.height),
        (this.updateBuffer = function (e) {
            (this.min = -150), (this.max = 0);
            for (var t = 0; t < this.buffer.length; ++t) {
                var i = e[Math.round((e.length / this.buffer.length) * t)];
                (i = Math.min(this.max, Math.max(this.min, i))), (this.buffer[t] = i);
            }
        }),
        (this.paintSpectrum = function () {
            var e = this.canvasRef.getContext("2d");
            e.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height), (e.strokeStyle = "#369bd7"), e.beginPath();
            for (var t = this.canvasRef.height / this.range, i = 0; i < this.buffer.length - 1; ++i) e.moveTo(i + 0.5, -1 * this.buffer[i] * t), e.lineTo(i + 1.5, -1 * this.buffer[i + 1] * t);
            e.stroke(), (e.fillStyle = e.strokeStyle), e.fillText(Math.round(this.max) + " db", 0, 20), e.fillText(Math.round(this.min) + " db", 0, this.canvasRef.height);
        });
}
function AudioPlayback() {
    (this.onAudioUpdate = function (e) {
        var t = this.eventHost,
            i = t.audioBufferSize,
            o = i / t.sampleRate;
        if (!1 !== t.isPlaying) {
            var n = t.audioDataRef,
                s = e.outputBuffer.getChannelData(0),
                a = e.outputBuffer.getChannelData(1);
            1 == n.length
                ? (t.copyChannelDataToBuffer(s, n[0], t.currentPlayPosition, i, t.playStart, t.playEnd, t.isLooped), (t.currentPlayPosition = t.copyChannelDataToBuffer(a, n[0], t.currentPlayPosition, i, t.playStart, t.playEnd, t.isLooped)))
                : 2 == n.length &&
                  (t.copyChannelDataToBuffer(s, n[0], t.currentPlayPosition, i, t.playStart, t.playEnd, t.isLooped),
                  (t.currentPlayPosition = t.copyChannelDataToBuffer(a, n[1], t.currentPlayPosition, i, t.playStart, t.playEnd, t.isLooped))),
                void 0 === t.currentPlayPosition ? t.stop() : ((t.lastPlaybackUpdate -= o), t.lastPlaybackUpdate < 0 && ((t.lastPlaybackUpdate = t.playbackUpdateInterval), t.notifyUpdateListener()));
        }
    }),
        (this.copyChannelDataToBuffer = function (e, t, i, o, n, s, a) {
            var r = i,
                h = i + o > t.length ? t.length : i + o > s ? s : i + o,
                l = h - r,
                c = l < e.length ? (a ? n : 0) : void 0,
                u = void 0 !== c ? e.length - l + c : void 0;
            e.length;
            return void 0 === c ? (this.copyIntoBuffer(e, 0, t, r, h), h) : (this.copyIntoBuffer(e, 0, t, r, h), a ? (this.copyIntoBuffer(e, l, t, c, u), u) : void 0);
        }),
        (this.copyIntoBuffer = function (e, t, i, o, n) {
            e.set(i.slice(o, n), t);
        }),
        (this.init = function () {
            return (
                (this.audioBufferSize = 1024),
                (this.sampleRate = 0),
                (window.AudioContext = window.AudioContext || window.webkitAudioContext),
                (this.audioContext = new AudioContext()),
                (this.analyserNode = this.audioContext.createAnalyser()),
                (this.analyserNode.minDecibels = -100),
                (this.analyserNode.maxDecibels = 0),
                (this.analyserNode.smoothingTimeConstant = 0),
                this.analyserNode.connect(this.audioContext.destination),
                (this.audioDataRef = void 0),
                (this.playStart = 0),
                (this.playEnd = 0),
                (this.isLooped = !1),
                (this.currentPlayPosition = 0),
                (this.isPlaying = !1),
                (this.updateListener = []),
                (this.playbackUpdateInterval = 0),
                (this.lastPlaybackUpdate = 0),
                this.updateListener.push(this.updateCallback),
                this.audioContext
            );
        }),
        (this.play = function (e, t, i, o, n) {
            this.isPlaying ||
                void 0 === e ||
                e.length < 1 ||
                e[0].length < 1 ||
                void 0 === t ||
                t <= 0 ||
                ((this.audioContext = this.audioContext || this.init()),
                this.javaScriptNode || ((this.javaScriptNode = this.audioContext.createScriptProcessor(this.audioBufferSize, 1, 2)), (this.javaScriptNode.onaudioprocess = this.onAudioUpdate), (this.javaScriptNode.eventHost = this)),
                (this.audioDataRef = e),
                (this.sampleRate = t),
                (this.isLooped = void 0 !== i && i),
                (this.playStart = void 0 === o || o < 0 || o >= e[0].length ? 0 : o),
                (this.playEnd = void 0 === n || n - this.audioBufferSize < o || n >= e[0].length ? e[0].length : n),
                (this.currentPlayPosition = this.playStart),
                (this.isPlaying = !0),
                this.javaScriptNode.connect(this.analyserNode),
                this.notifyUpdateListener());
        }),
        (this.stop = function () {
            !1 !== this.isPlaying &&
                ((this.isPlaying = !1),
                this.javaScriptNode.disconnect(this.analyserNode),
                (this.playStart = 0),
                (this.playEnd = 0),
                (this.isLooped = !1),
                (this.currentPlayPosition = 0),
                (this.lastPlaybackUpdate = 0),
                (this.audioDataRef = void 0),
                (this.sampleRate = 0),
                (this.javaScriptNode = void 0),
                this.notifyUpdateListener());
        }),
        (this.pause = function () {
            !1 !== this.isPlaying && ((this.isPlaying = !1), (this.lastPlaybackUpdate = 0), this.javaScriptNode.disconnect(this.analyserNode), this.notifyUpdateListener());
        }),
        (this.resume = function () {
            this.isPlaying || void 0 === this.audioDataRef || this.audioDataRef.length < 1 || ((this.isPlaying = !0), this.javaScriptNode.connect(this.analyserNode), this.notifyUpdateListener());
        }),
        (this.addUpdateListener = function (e) {
            this.updateCallback = e;
        }),
        (this.notifyUpdateListener = function () {
            for (var e = 0; e < this.updateListener.length; ++e) this.updateListener[e].audioPlaybackUpdate();
        });
}
function IsPowerOfTwo(e) {
    return !(e < 2) && !(e & (e - 1));
}
function NumberOfBitsNeeded(e) {
    var t;
    e < 2 && (fprintf(stderr, "Error: FFT called with size %d\n", e), exit(1));
    for (var t = 0; ; t++) if (e & (1 << t)) return t;
}
function ReverseBits(e, t) {
    for (var i, o, i = (o = 0); i < t; i++) (o = (o << 1) | (1 & e)), (e >>= 1);
    return o;
}
function ACInitFFT() {
    gFFTBitTable = [];
    for (var e = 2, t = 1; t <= MaxFastBits; t++) {
        gFFTBitTable[t - 1] = new Int32Array(e);
        for (var i = 0; i < e; i++) gFFTBitTable[t - 1][i] = ReverseBits(i, t);
        e <<= 1;
    }
}
function DeinitFFT() {
    if (gFFTBitTable) {
        for (var e = 1; e <= MaxFastBits; e++) gFFTBitTable[e - 1] = void 0;
        gFFTBitTable = void 0;
    }
}
function FastReverseBits(e, t) {
    return t <= MaxFastBits ? gFFTBitTable[t - 1][e] : ReverseBits(e, t);
}
function ACFFT(e, t, i, o, n, s) {
    var a,
        r,
        h,
        l,
        c,
        u,
        d,
        f,
        v,
        p = 2 * Math.PI;
    if (!IsPowerOfTwo(e)) return 1;
    gFFTBitTable || ACInitFFT(), t || (p = -p), (a = NumberOfBitsNeeded(e));
    for (var r = 0; r < e; r++) (h = FastReverseBits(r, a)), (n[h] = i[r]), (s[h] = void 0 === o ? 0 : o[r]);
    for (d = 1, u = 2; u <= e; u <<= 1) {
        for (var m, g, S, y, w, E, q = p / u, R = Math.sin(-2 * q), C = Math.sin(-q), L = Math.cos(-2 * q), A = Math.cos(-q), T = 2 * A, r = 0; r < e; r += u) {
            (S = L), (g = A), (E = R), (w = C);
            for (var h = r, c = 0; c < d; h++, c++)
                (m = T * g - S), (S = g), (g = m), (y = T * w - E), (E = w), (w = y), (l = h + d), (f = m * n[l] - y * s[l]), (v = m * s[l] + y * n[l]), (n[l] = n[h] - f), (s[l] = s[h] - v), (n[h] += f), (s[h] += v);
        }
        d = u;
    }
    if (t) for (var b = e, r = 0; r < e; r++) (n[r] /= b), (s[r] /= b);
}
function RealFFT(e, t, i, o) {
    for (var n, s = e / 2, a = Math.PI / s, r = new Float32Array(s), h = new Float32Array(s), n = 0; n < s; n++) (r[n] = t[2 * n]), (h[n] = t[2 * n + 1]);
    ACFFT(s, 0, r, h, i, o);
    for (var l, c, u, d, f, v = Math.sin(0.5 * a), p = -2 * v * v, m = -1 * Math.sin(a), g = 1 + p, S = m, n = 1; n < s / 2; n++)
        (l = s - n),
            (c = 0.5 * (i[n] + i[l])),
            (u = 0.5 * (o[n] - o[l])),
            (d = 0.5 * (o[n] + o[l])),
            (f = -0.5 * (i[n] - i[l])),
            (i[n] = c + g * d - S * f),
            (o[n] = u + g * f + S * d),
            (i[l] = c - g * d + S * f),
            (o[l] = g * f - u + S * d),
            (g = (v = g) * p - S * m + g),
            (S = S * p + v * m + S);
    (i[0] = (c = i[0]) + o[0]), (o[0] = c - o[0]);
}
function PowerSpectrum(e, t, i) {
    for (var o, n = e / 2, s = Math.PI / n, a = new Float32Array(n), r = new Float32Array(n), h = new Float32Array(n), l = new Float32Array(n), o = 0; o < n; o++) (a[o] = t[2 * o]), (r[o] = t[2 * o + 1]);
    ACFFT(n, 0, a, r, h, l);
    for (var c, u, d, f, v, p, m, g = Math.sin(0.5 * s), S = -2 * g * g, y = -1 * Math.sin(s), w = 1 + S, E = y, o = 1; o < n / 2; o++)
        (c = n - o),
            (u = 0.5 * (h[o] + h[c])),
            (d = 0.5 * (l[o] - l[c])),
            (f = 0.5 * (l[o] + l[c])),
            (v = -0.5 * (h[o] - h[c])),
            (p = u + w * f - E * v),
            (m = d + w * v + E * f),
            (i[o] = p * p + m * m),
            (p = u - w * f + E * v),
            (m = w * v - d + E * f),
            (i[c] = p * p + m * m),
            (w = (g = w) * S - E * y + w),
            (E = E * S + g * y + E);
    (p = (u = h[0]) + l[0]), (m = u - l[0]), (i[0] = p * p + m * m), (p = h[n / 2]), (m = l[n / 2]), (i[n / 2] = p * p + m * m);
}
function NumWindowFuncs() {
    return 10;
}
function WindowFuncName(e) {
    switch (e) {
        default:
        case 0:
            return "Rectangular";
        case 1:
            return "Bartlett";
        case 2:
            return "Hamming";
        case 3:
            return "Hanning";
        case 4:
            return "Blackman";
        case 5:
            return "Blackman-Harris";
        case 6:
            return "Welch";
        case 7:
            return "Gaussian(a=2.5)";
        case 8:
            return "Gaussian(a=3.5)";
        case 9:
            return "Gaussian(a=4.5)";
    }
}
function WindowFunc(e, t, i) {
    var o, n;
    switch (e) {
        case 1:
            for (var o = 0; o < t / 2; o++) (i[o] *= o / t / 2), (i[o + t / 2] *= 1 - o / t / 2);
            break;
        case 2:
            for (var o = 0; o < t; o++) i[o] *= 0.54 - 0.46 * Math.cos((2 * Math.PI * o) / (t - 1));
            break;
        case 3:
            for (var o = 0; o < t; o++) i[o] *= 0.5 - 0.5 * Math.cos((2 * Math.PI * o) / (t - 1));
            break;
        case 4:
            for (var o = 0; o < t; o++) i[o] *= 0.42 - 0.5 * Math.cos((2 * Math.PI * o) / (t - 1)) + 0.08 * Math.cos((4 * Math.PI * o) / (t - 1));
            break;
        case 5:
            for (var o = 0; o < t; o++) i[o] *= 0.35875 - 0.48829 * Math.cos((2 * Math.PI * o) / (t - 1)) + 0.14128 * Math.cos((4 * Math.PI * o) / (t - 1)) - 0.01168 * Math.cos((6 * Math.PI * o) / (t - 1));
            break;
        case 6:
            for (var o = 0; o < t; o++) i[o] *= ((4 * o) / t) * (1 - o / t);
            break;
        case 7:
            n = -12.5;
            for (var o = 0; o < t; o++) i[o] *= Math.exp(n * (0.25 + (o / t) * (o / t) - o / t));
            break;
        case 8:
            n = -24.5;
            for (var o = 0; o < t; o++) i[o] *= Math.exp(n * (0.25 + (o / t) * (o / t) - o / t));
            break;
        case 9:
            n = -40.5;
            for (var o = 0; o < t; o++) i[o] *= Math.exp(n * (0.25 + (o / t) * (o / t) - o / t));
    }
}
function ComputeSpectrum(e, t, i, o, n, s, a) {
    if (t < i) return !1;
    if (!e || !n) return !0;
    for (var r, h = new Float32Array(i), r = 0; r < i; r++) h[r] = 0;
    for (var l = i / 2, c = new Float32Array(i), u = new Float32Array(i), d = new Float32Array(i), f = 0, v = 0; f + i <= t; ) {
        for (var r = 0; r < i; r++) c[r] = e[f + r];
        if ((WindowFunc(a, i, c), s)) {
            ACFFT(i, !1, c, void 0, u, d);
            for (var r = 0; r < i; r++) c[r] = u[r] * u[r] + d[r] * d[r];
            for (var r = 0; r < i; r++) c[r] = Math.pow(c[r], 1 / 3);
            ACFFT(i, !1, c, void 0, u, d);
        } else PowerSpectrum(i, c, u);
        for (var r = 0; r < l; r++) h[r] += u[r];
        (f += l), v++;
    }
    if (s) {
        for (var r = 0; r < l; r++) h[r] < 0 && (h[r] = 0), (u[r] = h[r]), (h[r] -= r % 2 == 0 ? u[r / 2] : (u[r / 2] + u[r / 2 + 1]) / 2), h[r] < 0 && (h[r] = 0);
        for (var r = 0; r < l; r++) c[r] = h[r] / (i / 4);
        for (var r = 0; r < l; r++) h[l - 1 - r] = c[r];
    } else
        for (var r = 0; r < l; r++) {
            var p = h[r] / i / v;
            h[r] = p > 0 ? (10 * Math.log(p)) / Math.LN10 : 0;
        }
    for (var r = 0; r < l; r++) n[r] = h[r];
    return !0;
}
function HistoryDo() {
    (this.dotype = ""),
        (this.dataAdd = []),
        (this.addPos = 0),
        (this.addLen = 0),
        (this.dataDel = []),
        (this.delPos = 0),
        (this.delLen = 0),
        (this.samplerate = 48e3),
        (this.gain = 0),
        (this.selectStart = 0),
        (this.selectEnd = 0),
        (this.setDataAdd = function (e, t, i) {
            null != e && ((this.dataAdd = []), (this.dataAdd = this.dataAdd.concat(e)), (this.addPos = t), (this.addLen = i));
        }),
        (this.setDataDel = function (e, t, i) {
            null != e && ((this.dataDel = []), (this.dataDel = this.dataDel.concat(e)), (this.delPos = t), (this.delLen = i));
        });
}
function BinaryReader(e) {
    (this.data = new Uint8Array(e)),
        (this.pos = 0),
        (this.signMasks = [0, 128, 32768, 8388608, 2147483648]),
        (this.masks = [0, 256, 65536, 16777216, 4294967296]),
        (this.gotoString = function (e) {
            for (var t = this.pos; t < this.data.length; ++t)
                if (e[0] == String.fromCharCode(this.data[t])) {
                    for (var i = !0, o = t; o < e.length + t; ++o)
                        if (e[o - t] != String.fromCharCode(this.data[o])) {
                            i = !1;
                            break;
                        }
                    if (1 == i) {
                        this.pos = t;
                        break;
                    }
                }
        }),
        (this.readUInt8 = function (e) {
            return this.readInteger(1, !1, e);
        }),
        (this.readInt8 = function (e) {
            return this.readInteger(1, !0, e);
        }),
        (this.readUInt16 = function (e) {
            return this.readInteger(2, !1, e);
        }),
        (this.readInt16 = function (e) {
            return this.readInteger(2, !0, e);
        }),
        (this.readUInt32 = function (e) {
            return this.readInteger(4, !1, e);
        }),
        (this.readInt32 = function (e) {
            return this.readInteger(4, !0, e);
        }),
        (this.readString = function (e) {
            var t = "",
                i = 0;
            for (i = 0; i < e; ++i) t += String.fromCharCode(this.data[this.pos++]);
            return t;
        }),
        (this.readInteger = function (e, t, i) {
            if (this.pos + (e - 1) >= this.data.length) throw "Buffer overflow during reading.";
            var o = 0,
                n = 0;
            for (o = 0; o < e; ++o) !0 === i ? (n = this.data[this.pos++] + (n << (8 * o))) : (n += this.data[this.pos++] << (8 * o));
            return t && n & this.signMasks[e] && (n -= this.masks[e]), n;
        }),
        (this.eof = function () {
            return this.data.length >= this.pos;
        });
}
function BinaryWriter(e) {
    (this.estimatedSize = e),
        (this.pos = 0),
        (this.data = new Uint8Array(e)),
        (this.masks = [0, 256, 65536, 16777216, 4294967296]),
        (this.writeUInt8 = function (e, t) {
            return this.writeInteger(e, 1, t);
        }),
        (this.writeInt8 = function (e, t) {
            return this.writeInteger(e, 1, t);
        }),
        (this.writeUInt16 = function (e, t) {
            return this.writeInteger(e, 2, t);
        }),
        (this.writeInt16 = function (e, t) {
            return this.writeInteger(e, 2, t);
        }),
        (this.writeUInt32 = function (e, t) {
            return this.writeInteger(e, 4, t);
        }),
        (this.writeInt32 = function (e, t) {
            return this.writeInteger(e, 4, t);
        }),
        (this.writeString = function (e) {
            var t = 0;
            for (t = 0; t < e.length; ++t) this.data[this.pos++] = e.charCodeAt(t);
        }),
        (this.writeInteger = function (e, t, i) {
            var o = e,
                n = 0;
            for (e < 0 && (o += this.masks[t]), n = 0; n < t; ++n) this.data[this.pos++] = !0 === i ? (o >> (8 * (t - n - 1))) & 255 : (o >> (8 * n)) & 255;
        });
}
function onDocumentLoaded() {
    ACInitFFT(), initializeAudioLayerControls();
    var e = document.querySelector("#audioLayerControl");
    e.removeAllSequenceEditors();
    e.createSequenceEditor("Left Channel");
    e.setLinkMode(!0);
}
function load_url_to_array(e, t, i) {
    var o = new XMLHttpRequest(),
        n = new FileReader();
    o.open("GET", e, !0),
        (o.responseType = "blob"),
        o.addEventListener(
            "load",
            function () {
                200 === o.status
                    ? ((n.onload = function (e) {
                          t && t(e.target.result);
                      }),
                      n.readAsArrayBuffer(o.response))
                    : i && i("load file error!");
            },
            !1
        ),
        o.send();
}
function get_int16array_from_unit8array(e) {
    for (var t = [0, 127, 32767, 66571993087], i = t[2], o = new Int16Array(e.length), n = 0; n < e.length; ++n) o[n] = e[n] * i;
    return o;
}

function timeToSeconds(e) {
    var t = e.split(":");
    return 60 * parseFloat(t[0]) * 60 + 60 * parseFloat(t[1]) + parseFloat(t[2]) + parseFloat("0." + t[3]);
}
function audio_convert(e, t, i, o, n, s) {
	var sitepath=jsVars.plugins_url+"/";
    var a,
        r = /Duration: (.*?), /,
        h = /time=(.*?) /,
        l = new Worker(sitepath+"audio-editor-recorder/assets/audioeditor/encode/auido_worker.js");
    l.onmessage = function (e) {
        var t = e.data;
        if ("ready" === t.type && window.File && window.FileList && window.FileReader);
        else if ("stderr" == t.type) {
            if ((r.exec(t.data) && (a = timeToSeconds(r.exec(t.data)[1])), h.exec(t.data))) {
                var i = timeToSeconds(h.exec(t.data)[1]);
                a && n(Math.floor((i / a) * 100));
            }
        } else if ("done" == t.type) {
            //jQuery('.a_modal-backdrop.in').remove();
            var o = t.data.code,
                l = Object.keys(t.data.outputFiles);
            if (0 == o && l.length) {
                var c = l[0],
                    u = t.data.outputFiles[c];
                s(u, c);
            } else s(null);
        }
    };
    var arguments = [];
    switch ((arguments.push("-i"), arguments.push("input.wav"), arguments.push("-b:a"), arguments.push(t), arguments.push("-ac"), arguments.push(i), o.toLowerCase())) {
        case "mp3":
            arguments.push("-acodec"), arguments.push("libmp3lame"), arguments.push("export_ofoct.com.mp3");
            break;
        case "ogg":
            arguments.push("-acodec"), arguments.push("libvorbis"), arguments.push("export_ofoct.com.ogg");
            break;
        case "aac":
            arguments.push("-acodec"), arguments.push("libfdk_aac"), arguments.push("export_ofoct.com.mp4");
            break;
        case "wma":
            arguments.push("-acodec"), arguments.push("wmav1"), arguments.push("export_ofoct.com.asf");
    }
    l.postMessage({ type: "command", arguments: arguments, files: [{ name: "input.wav", buffer: e }] });
}
function set_sound_wav(e, t) {
    var i = record_audio_context.createMediaStreamSource(e),
        o = i.context;
    (record_node = (o.createScriptProcessor || o.createJavaScriptNode).call(o, 1024, 1, 1)),
        i.connect(record_node),
        record_node.connect(o.destination),
        (record_analyserNode = record_audio_context.createAnalyser()),
        (record_analyserNode.minDecibels = -100),
        (record_analyserNode.maxDecibels = 0),
        (record_analyserNode.smoothingTimeConstant = 0),
        record_analyserNode.connect(record_audio_context.destination),
        record_node.connect(record_analyserNode),
        (record_node.onaudioprocess = function (e) {
            if (recording) {
                for (var t = e.inputBuffer.getChannelData(0), i = [], o = 0; o < t.length; ++o) i.push(150 * t[o] - 150);
                record_spectrum.updateBuffer(i), record_spectrum.paintSpectrum();
            }
        });
}
function start_record(e, t, i) {
    if (!recording) {
        if (record_recorder) record_recorder.record(), e("Recording...");
        else {
            try {
                (window.AudioContext = window.AudioContext || window.webkitAudioContext),
                    (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
                    (window.URL = window.URL || window.webkitURL),
                    (record_audio_context = new AudioContext());
            } catch (t) {
                e("No web audio support in this browser!");
            }
            navigator.getUserMedia(
                { audio: !0 },
                function (i) {
                    set_sound_wav(i, t);
                    var o = record_audio_context.createMediaStreamSource(i);
                    (record_recorder = new RecorderV2(o)), record_recorder.record(), e("Recording...");
                },
                function (t) {
                    e("No live audio input: " + t);
                }
            );
            record_spectrum = new SpectrumDisplay(i.parent(), i[0]);
        }
        (recording = !0), (record_result_blob = void 0);
    }
}
function stop_record(e) {
    recording &&
        (record_recorder &&
            (record_recorder.stop(),
            record_recorder.exportWAV(function (t) {
                var i = URL.createObjectURL(t),
                    o = document.createElement("div"),
                    n = document.createElement("audio"),
                    s = document.createElement("a"),
                    a = document.createElement("br");
                (record_result_blob = t), (n.controls = !0), (n.src = i), (s.href = i), (s.download = "record.wav"), (s.innerHTML = s.download), o.appendChild(n), o.appendChild(a), o.appendChild(s), e && e(o);
            }),
            record_recorder.clear()),
        (recording = !1));
}
function output_throw(e) {
}
function audioLayerControl(e) {
    (this.elementContext = e),
        (this.elementContext.audioLayerControl = this),
        (this.title = "untitled"),
        (this.label = void 0),
        (this.audioPlayer = void 0),
        (this.listOfSequenceEditors = []),
        (this.linkMode = !1),
        (this.audioSequenceLength = 0),
        (this.playLoop = !1),
        (this.audioPlayback = new AudioPlayback()),
        this.audioPlayback.addUpdateListener(this),
        (this.spectrum = new SpectrumDisplay(this.elementContext, jQuery("#spectrum")[0])),
        (this.spectrumWorker = new SpectrumWorker()),
        (this.audioPlaybackUpdate = function () {
            for (var e = 0; e < this.listOfSequenceEditors.length; ++e)
                (this.listOfSequenceEditors[e].playbackPos = this.audioPlayback.currentPlayPosition),
                    "start" == this.elementContext.setStatu && this.audioPlayback.isPlaying && (this.listOfSequenceEditors[e].selectionEnd = this.audioPlayback.currentPlayPosition),
                    this.listOfSequenceEditors[e].repaint(!0);
            var t = new Float32Array(this.audioPlayback.analyserNode.frequencyBinCount);
            this.audioPlayback.analyserNode.getFloatFrequencyData(t), this.spectrum.updateBuffer(t), this.spectrum.paintSpectrum(), this.audioPlayback.isPlaying || (this.elementContext.my_stop(), this.elementContext.update_playstatus());
        }),
        (this.audioSequenceSelectionUpdate = function () {
            var e = this.listOfSequenceEditors[0].audioSequenceReference.data.length,
                t = this.listOfSequenceEditors[0].selectionStart;
            t = t < 0 ? 0 : t > this.listOfSequenceEditors[0].audioSequenceReference.data.length - 1024 ? this.listOfSequenceEditors[0].audioSequenceReference.data.length - 1024 : t;
            var i = (this.listOfSequenceEditors[0].selectionEnd > e ? e : this.listOfSequenceEditors[0].selectionEnd) - t,
                o = this.spectrumWorker.toAmplitudeSpectrumFromAudioSequence(this.listOfSequenceEditors[0].audioSequenceReference, t, i);
            this.spectrum.updateBuffer(o), this.spectrum.paintSpectrum();
        }),
        (this.setTitle = function (e) {
            this.title = e;
        }),
        (this.containsAudioLayerSequenceEditor = function (e) {
            for (var t = 0; t < this.listOfSequenceEditors.length; ++t) if (this.listOfSequenceEditors[t].title == e) return !0;
            return !1;
        }),
        (this.addAudioLayerSequenceEditor = function (e) {
            for (var t = 0; t < this.listOfSequenceEditors.length; ++t) if (this.listOfSequenceEditors[t].title === e.title) return;
            this.listOfSequenceEditors.push(e), this.updateLinkMode(this.linkMode);
        }),
        (this.removeAudioLayerSequenceEditor = function (e) {
            for (var t = 0; t < this.listOfSequenceEditors.length; ++t) this.listOfSequenceEditors[t].title === e.title && this.listOfSequenceEditors.splice(t, 1);
            this.updateLinkMode(this.linkMode);
        }),
        (this.updateLinkMode = function (e) {
            if (((this.linkMode = e), this.linkMode))
                for (var t = 0; t < this.listOfSequenceEditors.length - 1; ++t) for (var i = t + 1; i < this.listOfSequenceEditors.length; ++i) this.listOfSequenceEditors[t].link(this.listOfSequenceEditors[i]);
        }),
        (this.createVisualElements = function () {}),
        this.createVisualElements(),
        void 0 !== typeof e.attributes.title && null !== e.attributes.title && this.setTitle(e.attributes.title.value),
        (this.createSequenceEditor = function (e) {
            if (!0 !== this.audioLayerControl.containsAudioLayerSequenceEditor(e)) {
                var t = document.createElement("audioLayerSequenceEditor");
                (t.title = e), this.appendChild(t);
                var i = new AudioLayerSequenceEditor(t);
                return this.audioLayerControl.addAudioLayerSequenceEditor(i), i;
            }
        }),
        (this.removeAllSequenceEditors = function () {
            for (var e = 0; e < this.children.length; ++e)
                "audiolayersequenceeditor" == this.children[e].nodeName.toLowerCase() && (this.audioLayerControl.removeAudioLayerSequenceEditor(this.children[e].audioLayerSequenceEditor), this.removeChild(this.children[e]), --e);
        }),
        (this.setLinkMode = function (e) {
            this.audioLayerControl.updateLinkMode(e);
        }),
        (this.zoomIntoSelection = function () {
            if (this.audioLayerControl.listOfSequenceEditors.length > 0 && this.linkMode) this.audioLayerControl.listOfSequenceEditors[0].zoomIntoSelection();
            else for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].zoomIntoSelection();
        }),
        (this.zoomToFit = function () {
            if (this.audioLayerControl.listOfSequenceEditors.length > 0 && this.linkMode) this.audioLayerControl.istOfSequenceEditors[0].zoomIntoSelection();
            else for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].zoomToFit();
        }),
        (this.selectAll = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].selectAll();
        }),
        (this.selectFromS = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].selectFromS();
        }),
        (this.selectToE = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].selectToE();
        }),
        (this.goto_head = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].goto_head();
        }),
        (this.filterNormalize = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].filterNormalize();
            this.reupdateUndoUI();
        }),
        (this.filterFadeIn = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].filterFade(!0);
            this.reupdateUndoUI();
        }),
        (this.filterFadeOut = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].filterFade(!1);
            this.reupdateUndoUI();
        }),
        (this.filterGain = function (e) {
            for (var t = 0; t < this.audioLayerControl.listOfSequenceEditors.length; ++t) this.audioLayerControl.listOfSequenceEditors[t].filterGain(e);
            this.reupdateUndoUI();
        }),
        (this.filterSilence = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].filterSilence();
            this.reupdateUndoUI();
        }),
        (this.copy = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].copy(!1);
        }),
        (this.paste = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].paste(!1);
            this.reupdateUndoUI();
        }),
        (this.cut = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].cut(!1);
            this.reupdateUndoUI();
        }),
        (this.crop = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].crop(!1);
            this.reupdateUndoUI();


        	var access = localStorage.getItem("access");
        	if(access=='no'){

        	var fileara =jQuery('#audioLayerControl')[0].returnbloburl();
			var au = document.createElement('audio');
			au.src = fileara;
			au.addEventListener('loadedmetadata', function(){
			var duration = au.duration;
			if(duration>60){
            	jQuery('.senddata,.updateaudio').addClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').addClass('disabled');

            	if(jQuery('body').hasClass('post-type-audio')){
            		//jQuery('.limitexceedmodalpopup').trigger('click');
            	}
            	jQuery('.download.cursor_pointer').addClass('disabled');
            } else {
            	jQuery('.senddata,.updateaudio').removeClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').removeClass('disabled');
            	jQuery('.download.cursor_pointer').removeClass('disabled');
            }
			},false);
			}

        }),
        (this.del = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].del(!1);
            this.reupdateUndoUI();



        var access = localStorage.getItem("access");
        	if(access=='no'){

        	var fileara =jQuery('#audioLayerControl')[0].returnbloburl();
			var au = document.createElement('audio');
			au.src = fileara;
			au.addEventListener('loadedmetadata', function(){
			var duration = au.duration;
			if(duration>60){
            	jQuery('.senddata,.updateaudio').addClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').addClass('disabled');

            	if(jQuery('body').hasClass('post-type-audio')){
            		//jQuery('.limitexceedmodalpopup').trigger('click');
            	}
            	jQuery('.download.cursor_pointer').addClass('disabled');
            } else {
            	jQuery('.senddata,.updateaudio').removeClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').removeClass('disabled');
            	jQuery('.download.cursor_pointer').removeClass('disabled');
            }
			},false);
			}
        }),
        (this.toWave = function () {
            for (var e = new WaveTrack(), t = [], i = 0; i < this.audioLayerControl.listOfSequenceEditors.length; ++i) t.push(this.audioLayerControl.listOfSequenceEditors[i].audioSequenceReference);
            return e.fromAudioSequences(t), e;
        }),
        (this.playToggle = function () {
            this.audioLayerControl.audioPlayback.isPlaying ? this.stop() : this.play();
        }),
        (this.play = function () {
            for (var e = [], t = 0; t < this.audioLayerControl.listOfSequenceEditors.length; ++t) e.push(this.audioLayerControl.listOfSequenceEditors[t].audioSequenceReference.data);
            var i = this.audioLayerControl.listOfSequenceEditors[0].selectionStart,
                o = this.audioLayerControl.listOfSequenceEditors[0].selectionEnd;
            i != o
                ? this.audioLayerControl.audioPlayback.play(e, this.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.sampleRate, this.playLoop, i, o)
                : this.audioLayerControl.audioPlayback.play(e, this.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.sampleRate, this.playLoop, i);
        }),
        (this.stop = function () {
            this.audioLayerControl.audioPlayback.stop();
        }),
        (this.my_stop = function () {
            "stop" != this.playStatu && (this.audioLayerControl.audioPlayback.stop(), (this.playStatu = "stop"));
        }),
        (this.my_status = function () {
            return this.playStatu;
        }),
        (this.my_play = function () {
            "stop" == this.playStatu ? (this.play(), (this.playStatu = "play")) : "pause" == this.playStatu && (this.audioLayerControl.audioPlayback.resume(), (this.playStatu = "play"));
        }),
        (this.my_pause = function () {
            "play" == this.playStatu && (this.audioLayerControl.audioPlayback.pause(), (this.playStatu = "pause"));
        }),
        (this.elementContext.my_setupdateui = function (e) {
            this.update_playstatus = e;
        }),
        (this.set_start_sel = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].set_start_sel();
            this.setStatu = "start";
        }),
        (this.set_end_sel = function () {
            this.setStatu = "end";
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].set_end_sel();
        }),
        (this.elementContext.my_pause = this.my_pause),
        (this.elementContext.my_play = this.my_play),
        (this.elementContext.my_status = this.my_status),
        (this.elementContext.my_stop = this.my_stop),
        (this.elementContext.set_start_sel = this.set_start_sel),
        (this.elementContext.set_end_sel = this.set_end_sel),
        (this.elementContext.playStatu = "stop"),
        (this.elementContext.setStatu = "none"),
        (this.toggleLoop = function () {
            this.playLoop = !this.playLoop;
        }),
        (this.save = function (e) {

			var urlfile_data = this.toWave().toBlobUrlAsync("audio/mp3");
			var a = document.createElement('a');
			a.href = urlfile_data.url;
			a.download = 'export21ssss.mp3';
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			delete a;



        }),
        (this.returnbloburl = function (e) {

			var urlfile_data = this.toWave().toBlobUrlAsync("audio/mp3");
        	return urlfile_data.url;



        }),
        (this.returnblob = function (e) {

			var urlfile_data = this.toWave().toBlobUrlAsync("audio/mp3");
        	return urlfile_data.blobfile;



        }),
        (this.elementContext.loadfile = function (e, t) {

            e.length <= 0 || ((this.add = t), this.masterObj.handleFiles(e, this.masterObj));
        }),
        (this.elementContext.loadArrayBuffer = function (e, t) {
            (this.add = t), this.masterObj.handleArrayBuffer(e, this.masterObj);
        }),
        (this.elementContext.reset = function () {
            (this.add = !1), this.masterObj.reset(this.masterObj);
        }),
        (this.elementContext.setStartAndEndFun = function (e, t, i, o) {
            (this.fileload_start = e), (this.fileload_end = t), (this.error_callback = i), (this.lockscreen = o);
        }),
        (this.elementContext.setUpdateUndoUIFun = function (e) {
            this.updateUndoUI = e;
        }),
        (this.elementContext.reupdateUndoUI = function () {
            this.updateUndoUI &&
                this.audioLayerControl.listOfSequenceEditors.length > 0 &&
                this.updateUndoUI(this.audioLayerControl.listOfSequenceEditors[0].listOfHistoryDo.length, this.audioLayerControl.listOfSequenceEditors[0].curHistoryDoPos);
        }),
        (this.elementContext.undo = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].undo();
            this.reupdateUndoUI();
        }),
        (this.elementContext.redo = function () {
            for (var e = 0; e < this.audioLayerControl.listOfSequenceEditors.length; ++e) this.audioLayerControl.listOfSequenceEditors[e].redo();
            this.reupdateUndoUI();
        }),
        (this.testFilter = function () {
            for (var e = [], t = 0; t < this.audioLayerControl.listOfSequenceEditors.length; ++t) e.push(this.audioLayerControl.listOfSequenceEditors[t].audioSequenceReference.data);
            for (var t = 0; t < e.length; ++t) this.audioLayerControl.listOfSequenceEditors[t].audioSequenceReference.data = this.audioLayerControl.spectrumWorker.testFilter(e[t]);
            this.zoomToFit();
        }),
        (this.createTestSignal = function () {
            this.removeAllSequenceEditors();
            for (var e = 0; e < 2; ++e) {
                var t = this.createSequenceEditor("Test Channel " + e),
                    i = CreateNewAudioSequence(44100);
                i.createTestTone(430.6640625, 441e3), t.setAudioSequence(i), t.zoomToFit();
            }
        }),
        (this.elementContext.createSequenceEditor = this.createSequenceEditor),
        (this.elementContext.removeAllSequenceEditors = this.removeAllSequenceEditors),
        (this.elementContext.setLinkMode = this.setLinkMode),
        (this.elementContext.zoomIntoSelection = this.zoomIntoSelection),
        (this.elementContext.zoomToFit = this.zoomToFit),
        (this.elementContext.selectAll = this.selectAll),
        (this.elementContext.selectFromS = this.selectFromS),
        (this.elementContext.selectToE = this.selectToE),
        (this.elementContext.goto_head = this.goto_head),
        (this.elementContext.filterNormalize = this.filterNormalize),
        (this.elementContext.filterFadeIn = this.filterFadeIn),
        (this.elementContext.filterFadeOut = this.filterFadeOut),
        (this.elementContext.filterGain = this.filterGain),
        (this.elementContext.filterSilence = this.filterSilence),
        (this.elementContext.toWave = this.toWave),
        (this.elementContext.playToggle = this.playToggle),
        (this.elementContext.play = this.play),
        (this.elementContext.stop = this.stop),
        (this.elementContext.toggleLoop = this.toggleLoop),
        (this.elementContext.save = this.save),
        (this.elementContext.returnblob = this.returnblob),
        (this.elementContext.returnbloburl = this.returnbloburl),
        (this.elementContext.testFilter = this.testFilter),
        (this.elementContext.createTestSignal = this.createTestSignal),
        (this.elementContext.copy = this.copy),
        (this.elementContext.paste = this.paste),
        (this.elementContext.cut = this.cut),
        (this.elementContext.crop = this.crop),
        (this.elementContext.del = this.del),
        (this.filedb = void 0),
        (this.createDropHandler = function () {
            var e = new FileDropbox();
            e.defineDropHandler(this.elementContext),
                (e.eventHost = this),
                (e.onFinish = function () {
                    (jQuery("#app-progress")[0].style.width = "50%"),
                        (activeAudioLayerControl = this.eventHost.elementContext),
                        (this.eventHost.audioPlayback.audioContext = this.eventHost.audioPlayback.audioContext || this.eventHost.audioPlayback.init());
                        this.eventHost.audioPlayback.audioContext.decodeAudioData(this.resultArrayBuffer, this.eventHost.decodeAudioFinished, this.eventHost.decodeAudioFailed);
                }),
                (e.onFail = function (e) {
                    var t = "";
                    switch (e.target.error.code) {
                        case FileError.QUOTA_EXCEEDED_ERR:
                            t = "QUOTA_EXCEEDED_ERR";
                            break;
                        case FileError.NOT_FOUND_ERR:
                            t = "NOT_FOUND_ERR";
                            break;
                        case FileError.SECURITY_ERR:
                            t = "SECURITY_ERR";
                            break;
                        case FileError.INVALID_MODIFICATION_ERR:
                            t = "INVALID_MODIFICATION_ERR";
                            break;
                        case FileError.INVALID_STATE_ERR:
                            t = "INVALID_STATE_ERR";
                            break;
                        default:
                            t = "Unknown Error " + e.code;
                    }
                });
        }),
        (this.decodeAudioFailed = function () {
            activeAudioLayerControl.fileload_end && activeAudioLayerControl.fileload_end("error"), activeAudioLayerControl.updateUndoUI && activeAudioLayerControl.updateUndoUI(0, 0);
        }),
        (this.decodeAudioFinished = function (e) {
            if (
                activeAudioLayerControl.add &&
                activeAudioLayerControl.audioLayerControl.listOfSequenceEditors.length > 0 &&
                activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference &&
                activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.data &&
                activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.data.length > 0
            ) {
                if (e.sampleRate != activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.sampleRate)
                    return void (
                        activeAudioLayerControl.error_callback &&
                        activeAudioLayerControl.error_callback(
                            "Samplerate does not match. This audio samplerate is " +
                                e.sampleRate +
                                ", Please change the samplerate to " +
                                activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[0].audioSequenceReference.sampleRate +
                                " use below music converter, then try to add again."
                        )
                    );
                for (var t = e.sampleRate, i = (e.length, e.duration, e.numberOfChannels), o = 0; o < activeAudioLayerControl.audioLayerControl.listOfSequenceEditors.length; ++o)
                    o > i - 1
                        ? activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[o].addsequence(t, e.getChannelData(i - 1))
                        : activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[o].addsequence(t, e.getChannelData(o));
                for (var o = 0; o < activeAudioLayerControl.audioLayerControl.listOfSequenceEditors.length; ++o) activeAudioLayerControl.audioLayerControl.listOfSequenceEditors[o].zoomToFit();
                activeAudioLayerControl.fileload_end && activeAudioLayerControl.fileload_end("ok"), activeAudioLayerControl.reupdateUndoUI();
            } else {
                (jQuery("#app-progress")[0].style.width = "90%"), activeAudioLayerControl.removeAllSequenceEditors();
                for (var t = e.sampleRate || 44100, i = (e.length, e.duration, e.numberOfChannels), n = [str_leftc, str_rightc], o = 0; o < i; ++o) {
                    var s = activeAudioLayerControl.createSequenceEditor(n[o]);
                    if (s && e.getChannelData) {
                        var ggg = e.getChannelData(o);
                        if (ggg) {
                            var a = CreateNewAudioSequence(t, ggg);
                            if (typeof s != "undefined") {
                                s.setAudioSequence(a);
                                s.zoomToFit();
                            }
                        } else {
                            console.error("Impossible d'obtenir les données du canal", o);
                        }
                    } else {
                        /* console.error("Erreur lors de la création de l'éditeur de séquence ou getChannelData n'est pas disponible"); */
                    }
                }
                (jQuery("#app-progress")[0].style.width = "100%"),
                    setTimeout(function () {
                       jQuery("#app-progress")[0].style.width = "0%";
                    }, 1e3),
                    activeAudioLayerControl.fileload_end && activeAudioLayerControl.fileload_end("ok"),
                    activeAudioLayerControl.updateUndoUI && activeAudioLayerControl.updateUndoUI(0, 0);
            }
        }),
        (this.processLock = function () {
            activeAudioLayerControl.lockscreen(!0);
        }),
        (this.processUnlock = function () {
            activeAudioLayerControl.lockscreen(!1), activeAudioLayerControl.reupdateUndoUI();
        }),
        this.createDropHandler(),
        (this.elementContext.onselectstart = function () {
            return !1;
        });
}
function initializeAudioLayerControls() {
    new audioLayerControl(document.getElementsByTagName("audiolayercontrol")[0]);
}
function AudioLayerSequenceEditor(e) {
    function t(e, t) {
        return ("" + e).length < t ? (new Array(t + 1).join("0") + e).slice(-t) : "" + e;
    }
    function i(e) {
        var i = (Math.floor(e / 3600), Math.floor((e % 3600) / 60)),
            o = (Math.floor(e) % 3600) % 60,
            n = (e % 1).toString().substring(1, 4);
        return t(i, 2).toString() + ":" + t(o, 2).toString() + n;
    }
    var hhh =jQuery('.audioLayerControlmainbox').width();
    //setTimeout(function(){
    if(jQuery('body').hasClass('wp-admin')){
    	//if(jQuery(window).width()<960){
    		hhh = hhh-10;
    	//}
    }
    //},3000);
    (this.elementContext = e),
        (this.elementContext.audioLayerSequenceEditor = this),
        (this.audioLayerControl = void 0),
        (this.canvasReference = void 0),
        (this.audioSequenceReference = void 0),
        (this.canvasTimer = void 0),
        (this.canvasZoomBar = void 0),
        ( this.canvasHeight = 170 ),
        (this.canvasWidth = hhh ),
        (this.name = name),
        (this.mouseInside = !1),
        (this.mouseDown = !1),
        (this.mouseInsideOfSelection = !1),
        (this.mouseSelectionOfStart = !1),
        (this.mouseSelectionOfEnd = !1),
        (this.mouseX = 0),
        (this.mouseY = 0),
        (this.previousMouseX = 0),
        (this.previousMouseY = 0),
        (this.selectionStart = 0),
        (this.selectionEnd = 0),
        (this.colorInactiveTop = "#f9f9f9"),
        (this.colorInactiveBottom = "#fff"),
        (this.colorActiveTop = "#f9f9f9"),
        (this.colorActiveBottom = "#fff"),
        (this.colorMouseDownTop = "#fff"),
        (this.colorMouseDownBottom = "#fff"),
        (this.colorSelectionStroke = "#3800ff"),
        (this.colorSelectionFill = "rgba(255,0,0,0.2)"),
        (this.visualizationData = []),
        (this.visualizationDataAll = []),
        (this.hasFocus = !0),
        (this.linkedEditors = []),
        (this.movePos = 0),
        (this.movementActive = !1),
        (this.viewResolution = 10),
        (this.viewPos = 0),
        (this.playbackPos = 0),
        (this.listOfHistoryDo = []),
        (this.maxUnDos = 50),
        (this.curHistoryDoPos = -1),
        (this.storeTmpData = []),
        (this.storeTmpPos = 0),
        (this.storeTmpLen = 0),
        (this.undoit = function (e) {
            e &&
                (e.dataAdd.length > 0 && this.audioSequenceReference.trim(e.addPos, e.addLen),
                e.dataDel.length > 0 && this.audioSequenceReference.insert(e.delPos, e.delLen, e.dataDel),
                (this.selectionStart = e.selectStart),
                (this.selectionEnd = e.selectEnd),
                this.updateVisualizationData());
        }),
        (this.redoit = function (e) {
            e &&
                (e.dataDel.length > 0 && this.audioSequenceReference.trim(e.delPos, e.delLen),
                e.dataAdd.length > 0 && this.audioSequenceReference.insert(e.addPos, e.addLen, e.dataAdd),
                (this.selectionStart = e.selectStart),
                (this.selectionEnd = e.selectEnd),
                this.updateVisualizationData());
        }),
        (this.undo = function () {
            if (!(this.curHistoryDoPos < 0 || 0 == this.listOfHistoryDo.length)) {
                var e = this.listOfHistoryDo[this.curHistoryDoPos];
                this.undoit(e), this.curHistoryDoPos--, this.curHistoryDoPos < -1 && (this.curHistoryDoPos = -1);
            }
        }),
        (this.redo = function () {
            if (!(this.curHistoryDoPos > this.listOfHistoryDo.length - 2)) {
                var e = this.listOfHistoryDo[this.curHistoryDoPos + 1];
                this.redoit(e), this.curHistoryDoPos++, this.curHistoryDoPos > this.listOfHistoryDo.length - 1 && (this.curHistoryDoPos = this.listOfHistoryDo.length - 1);
            }
        }),
        (this.historyDoit = function (e, t, i, o, n, s, a, r, h) {
            var l = new HistoryDo();
            this.curHistoryDoPos != this.listOfHistoryDo.length - 1 && this.listOfHistoryDo.splice(this.curHistoryDoPos + 1, this.listOfHistoryDo.length - this.curHistoryDoPos - 1),
                (l.dotype = e),
                l.setDataDel(t, i, o),
                l.setDataAdd(n, s, a),
                (l.samplerate = this.audioSequenceReference.sampleRate),
                (l.gain = this.audioSequenceReference.gain),
                (l.selectStart = r),
                (l.selectEnd = h),
                this.listOfHistoryDo.push(l),
                (this.curHistoryDoPos = this.listOfHistoryDo.length - 1);
        }),
        (this.getSelect = function () {
            return {
                start: this.selectionStart < 0 ? 0 : this.selectionStart >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionStart,
                end: this.selectionEnd < 0 ? 0 : this.selectionEnd >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionEnd,
            };
        }),
        (this.saveTmpData = function (e, t) {
            (this.storeTmpData = this.audioSequenceReference.data.slice(e, t)), (this.storeTmpPos = e), (this.storeTmpLen = t - e);
        }),
        (this.storeHistoryDo = function (e, t, i) {
            var o = [],
                n = 0,
                s = 0,
                a = this.selectionStart,
                r = this.selectionEnd;
            (o = this.audioSequenceReference.data.slice(t, i)), (n = t), (s = i - t), this.historyDoit(e, this.storeTmpData, this.storeTmpPos, this.storeTmpLen, o, n, s, a, r);
        }),
        (this.link = function (e) {
            for (var t = 0; t < this.linkedEditors.length; ++t) if (this.linkedEditors[t] === e) return;
            this.linkedEditors.push(e), e.link(this);
        }),
        (this.updateSelectionForLinkedEditors = function (e) {
            for (var t = 0; t < this.linkedEditors.length; ++t)
                (this.linkedEditors[t].selectionStart = this.selectionStart),
                    (this.linkedEditors[t].selectionEnd = this.selectionEnd),
                    (this.linkedEditors[t].viewPos == this.viewPos && this.linkedEditors[t].viewResolution == this.linkedEditors[t].viewResolution) ||
                        ((this.linkedEditors[t].viewPos = this.viewPos), (this.linkedEditors[t].viewResolution = this.viewResolution), this.linkedEditors[t].updateVisualizationData()),
                    this.linkedEditors[t].repaint(e);
        }),
        (this.createEditor = function () {
        	jQuery('#audioloader').css({'width':this.canvasWidth+'px'});
            (this.channelIndex = this.audioLayerControl.listOfSequenceEditors.length - 1),
                this.audioLayerControl &&
                    1 == this.audioLayerControl.listOfSequenceEditors.length &&
                    ((this.canvasTimer = document.createElement("canvas")),
                    (this.canvasTimer.width = this.canvasWidth),
                    (this.canvasTimer.height = 20),
                    (this.canvasTimer.style.display = "block"),
                    this.elementContext.appendChild(this.canvasTimer)),
                (this.canvasReference = document.createElement("canvas")),
                this.canvasReference.setAttribute("class", "audioLayerEditor"),
                (this.canvasReference.width = this.canvasWidth),
                (this.canvasReference.height = this.canvasHeight),
         		(this.canvasReference.style['width'] = this.canvasWidth+'px'),
         		(this.canvasReference.style['height'] = '170px'),
                (this.canvasReference.style.border = "2px solid rgb(153 153 255)"),
                (this.canvasReference.style['border-radius'] = "10px"),
                this.elementContext.appendChild(this.canvasReference),
                (this.canvasZoomBar = document.createElement("canvas")),
                (this.canvasZoomBar.width = this.canvasWidth),
                (this.canvasZoomBar.height = 20),
                (this.canvasZoomBar.style.border = "1px solid #a0a0a0"),
                (this.canvasZoomBar.style.display = "none"),
                this.elementContext.appendChild(this.canvasZoomBar),
                this.addEventlistener(),
                this.repaint();
        }),
        (this.setAudioSequence = function (e) {
            (this.audioSequenceReference = e), this.updateVisualizationData();
        }),
        (this.updateVisualizationData = function (e) {
            e || this.getAllData(), this.getDataInResolution(this.viewResolution, this.viewPos), this.repaint(e);
        }),
        (this.getAllData = function () {
            var e = this.getAbsoluteToSeconds(this.audioSequenceReference.data.length);
            this.visualizationDataAll = [];
            var t = this.audioSequenceReference.data,
                i = 0 * this.audioSequenceReference.sampleRate,
                o = Math.round(0 * this.audioSequenceReference.sampleRate),
                n = Math.round(e * this.audioSequenceReference.sampleRate);
            if (n > this.canvasReference.width) {
                for (var s = n / this.canvasReference.width, a = 0; a < this.canvasReference.width; ++a) {
                    var r = a * s + i,
                        h = (a + 1) * s + i + 1;
                    if (r >= 0 && r < t.length && h >= 0 && h < t.length) {
                        var l = this.getPeakInFrame(r, h, t);
                        this.visualizationDataAll.push(l);
                    } else this.visualizationDataAll.push({ min: 0, max: 0 });
                }
                this.visualizationDataAll.plotTechnique = 1;
            } else {
                for (var c = this.canvasReference.width / n, u = 0, a = o; a <= o + n; ++a) a < 0 || a >= t.length ? this.visualizationDataAll.push({ y: 0, x: u }) : this.visualizationDataAll.push({ y: t[a], x: u }), (u += c);
                this.visualizationDataAll.plotTechnique = 2;
            }
        }),
        (this.getDataInResolution = function (e, t) {
            this.visualizationData = [];
            var i = this.audioSequenceReference.data,
                o = this.audioSequenceReference.sampleRate * t,
                n = Math.round(t * this.audioSequenceReference.sampleRate),
                s = Math.round(e * this.audioSequenceReference.sampleRate);
            if (s > this.canvasReference.width) {
                for (var a = s / this.canvasReference.width, r = 0; r < this.canvasReference.width; ++r) {
                    var h = r * a + o,
                        l = (r + 1) * a + o + 1;
                    if (h >= 0 && h < i.length && l >= 0 && l < i.length) {
                        var c = this.getPeakInFrame(h, l, i);
                        this.visualizationData.push(c);
                    } else this.visualizationData.push({ min: 0, max: 0 });
                }
                this.visualizationData.plotTechnique = 1;
            } else {
                for (var u = this.canvasReference.width / s, d = 0, r = n; r <= n + s; ++r) r < 0 || r >= i.length ? this.visualizationData.push({ y: 0, x: d }) : this.visualizationData.push({ y: i[r], x: d }), (d += u);
                this.visualizationData.plotTechnique = 2;
            }
        }),
        (this.addEventlistener = function () {
            (this.canvasReference.eventHost = this),
                this.canvasReference.addEventListener(
                    "mouseover",
                    function () {
                        (this.eventHost.mouseInside = !0), this.eventHost.repaint(!0);
                    },
                    !0
                ),
                (this.canvasReference.ontouchend = function () {
                    if (this.eventHost.selectionStart > this.eventHost.selectionEnd) {
                        var e = this.eventHost.selectionStart;
                        (this.eventHost.selectionStart = this.eventHost.selectionEnd), (this.eventHost.selectionEnd = e);
                    }
                    this.eventHost.trimselection(),
                        (this.eventHost.mouseInsideOfSelection = !1),
                        (this.eventHost.mouseSelectionOfStart = !1),
                        (this.eventHost.mouseSelectionOfEnd = !1),
                        (this.eventHost.mouseDown = !1),
                        (this.eventHost.mouseInside = !1),
                        this.eventHost.repaint(!0),
                        this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.onmouseout = function () {
                    if (this.eventHost.selectionStart > this.eventHost.selectionEnd) {
                        var e = this.eventHost.selectionStart;
                        (this.eventHost.selectionStart = this.eventHost.selectionEnd), (this.eventHost.selectionEnd = e);
                    }
                    this.eventHost.trimselection(),
                        (this.eventHost.mouseInsideOfSelection = !1),
                        (this.eventHost.mouseSelectionOfStart = !1),
                        (this.eventHost.mouseSelectionOfEnd = !1),
                        (this.eventHost.mouseDown = !1),
                        (this.eventHost.mouseInside = !1),
                        this.eventHost.repaint(!0),
                        this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.onscroll = function (e) {}),
                (this.canvasReference.ontouchmove = function (e) {
                    (this.eventHost.previousMouseX = this.eventHost.mouseX),
                        (this.eventHost.previousMouseY = this.eventHost.mouseY),
                        (this.eventHost.mouseX = e.changedTouches[0].clientX - this.offsetLeft),
                        (this.eventHost.mouseY = e.changedTouches[0].clientY - this.offsetTop);
                    var t = this.eventHost.mouseX - this.eventHost.previousMouseX;
                    if (this.eventHost.mouseDown && 0 == this.eventHost.movementActive)
                        if (this.eventHost.mouseInsideOfSelection) {
                            var i = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX) - this.eventHost.getPixelToAbsolute(this.eventHost.previousMouseX);
                            (this.eventHost.selectionStart += i), (this.eventHost.selectionEnd += i), this.eventHost.audioLayerControl.audioSequenceSelectionUpdate();
                        } else
                            this.eventHost.mouseSelectionOfStart
                                ? (this.eventHost.selectionStart = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX))
                                : ((this.eventHost.selectionEnd = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX)),
                                  this.eventHost.selectionEnd < 0 && (this.eventHost.selectionEnd = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX)));
                    if (this.eventHost.mouseDown && this.eventHost.movementActive) {
                        var o = this.eventHost.viewResolution / this.eventHost.canvasReference.width;
                        (this.eventHost.viewPos -= t * o), (this.selectionStart -= t * o), (this.selectionEnd -= t * o), this.eventHost.updateVisualizationData(!0);
                    }
                    this.eventHost.trimselection(), this.eventHost.repaint(!0), this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.onmousemove = function (e) {
                    var jjj = document.querySelector('canvas.audioLayerEditor');
                    const rect = jjj.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    (this.eventHost.previousMouseX = this.eventHost.mouseX),
                        (this.eventHost.previousMouseY = this.eventHost.mouseY),
                        (this.eventHost.mouseX = x),
                        (this.eventHost.mouseY = e.clientY - this.offsetTop);
                    var t = this.eventHost.mouseX - this.eventHost.previousMouseX;
                    if (this.eventHost.mouseDown && 0 == this.eventHost.movementActive)
                        if (this.eventHost.mouseInsideOfSelection) {
                            var i = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX) - this.eventHost.getPixelToAbsolute(this.eventHost.previousMouseX);
                            (this.eventHost.selectionStart += i), (this.eventHost.selectionEnd += i), this.eventHost.audioLayerControl.audioSequenceSelectionUpdate();
                        } else
                            this.eventHost.mouseSelectionOfStart
                                ? (this.eventHost.selectionStart = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX))
                                : ((this.eventHost.selectionEnd = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX)),
                                  this.eventHost.selectionEnd < 0 && (this.eventHost.selectionEnd = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX)));
                    if (this.eventHost.mouseDown && this.eventHost.movementActive) {
                        var o = this.eventHost.viewResolution / this.eventHost.canvasReference.width;
                        (this.eventHost.viewPos -= t * o), (this.selectionStart -= t * o), (this.selectionEnd -= t * o), this.eventHost.updateVisualizationData(!0);
                    }
                    this.eventHost.trimselection(), this.eventHost.repaint(!0), this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.ontouchstart = function (e) {
                	var jjj = document.querySelector('canvas.audioLayerEditor');
					const rect = jjj.getBoundingClientRect();
					const x = e.clientX - rect.left;
                    if (((this.eventHost.mouseDown = !0), 0 == this.eventHost.movementActive)) {
                        var t = this.eventHost.getAbsoluteToPixel(this.eventHost.selectionStart),
                            i = this.eventHost.getAbsoluteToPixel(this.eventHost.selectionEnd);
                        this.eventHost.mouseX - 5 > t && this.eventHost.mouseX + 5 < i
                            ? (this.eventHost.mouseInsideOfSelection = !0)
                            : this.eventHost.mouseX - 5 < t && this.eventHost.mouseX + 5 > t
                            ? (this.eventHost.mouseSelectionOfStart = !0)
                            : this.eventHost.mouseX - 5 < i && this.eventHost.mouseX + 5 > i
                            ? (this.eventHost.mouseSelectionOfEnd = !0)
                            : ((this.eventHost.selectionStart = this.eventHost.getPixelToAbsolute(this.eventHost.mouseX)), (this.eventHost.selectionEnd = this.eventHost.selectionStart));
                    }
                    this.eventHost.trimselection(), (focusOnAudioLayerSequenceEditor = this.eventHost), this.eventHost.repaint(!0), this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.onmousedown = function (e) {
                	var jjj = document.querySelector('canvas.audioLayerEditor');
					const rect = jjj.getBoundingClientRect();
					const x = e.clientX - rect.left;

                    if (((this.eventHost.mouseDown = !0), 0 == this.eventHost.movementActive)) {
                        var t = this.eventHost.getAbsoluteToPixel(this.eventHost.selectionStart),
                            i = this.eventHost.getAbsoluteToPixel(this.eventHost.selectionEnd);
                        this.eventHost.mouseX - 5 > t && this.eventHost.mouseX + 5 < i
                            ? (this.eventHost.mouseInsideOfSelection = !0)
                            : x - 5 < t && x + 5 > t
                            ? (this.eventHost.mouseSelectionOfStart = !0)
                            : x - 5 < i && x + 5 > i
                            ? (this.eventHost.mouseSelectionOfEnd = !0)
                            : ((this.eventHost.selectionStart = this.eventHost.getPixelToAbsolute(x)), (this.eventHost.selectionEnd = this.eventHost.selectionStart));
                    }
                    this.eventHost.trimselection(), (focusOnAudioLayerSequenceEditor = this.eventHost), this.eventHost.repaint(!0), this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.ontouchup = function () {
                    if (this.eventHost.selectionStart > this.eventHost.selectionEnd) {
                        var e = this.eventHost.selectionStart;
                        (this.eventHost.selectionStart = this.eventHost.selectionEnd), (this.eventHost.selectionEnd = e);
                    }
                    this.eventHost.trimselection(),
                        (this.eventHost.mouseInsideOfSelection = !1),
                        (this.eventHost.mouseSelectionOfStart = !1),
                        (this.eventHost.mouseSelectionOfEnd = !1),
                        (this.eventHost.mouseDown = !1),
                        this.eventHost.repaint(!0),
                        this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.onmouseup = function () {
                    if (this.eventHost.selectionStart > this.eventHost.selectionEnd) {
                        var e = this.eventHost.selectionStart;
                        (this.eventHost.selectionStart = this.eventHost.selectionEnd), (this.eventHost.selectionEnd = e);
                    }
                    this.eventHost.trimselection(),
                        (this.eventHost.mouseInsideOfSelection = !1),
                        (this.eventHost.mouseSelectionOfStart = !1),
                        (this.eventHost.mouseSelectionOfEnd = !1),
                        (this.eventHost.mouseDown = !1),
                        this.eventHost.repaint(!0),
                        this.eventHost.updateSelectionForLinkedEditors(!0);
                }),
                (this.canvasReference.ondblclick = function () {
                    this.eventHost.selectionStart != this.eventHost.selectionEnd
                        ? ((this.eventHost.selectionStart = 0), (this.eventHost.selectionEnd = 0))
                        : ((this.eventHost.selectionStart = 0), (this.eventHost.selectionEnd = this.eventHost.getPixelToAbsolute(this.eventHost.canvasReference.width))),
                        (this.eventHost.mouseDown = !1),
                        (this.eventHost.mouseSelectionOfStart = !1),
                        (this.eventHost.mouseSelectionOfEnd = !1),
                        (this.eventHost.mouseInsideOfSelection = !1),
                        (focusOnAudioLayerSequenceEditor = void 0),
                        this.eventHost.repaint(!0),
                        this.eventHost.updateSelectionForLinkedEditors(!0);
                });
        }),
        (this.trimselection = function () {
            this.selectionStart = Math.max(0, this.selectionStart);
        }),
        (this.repaint = function (e) {
            if (void 0 !== this.canvasReference) {
                var t = this.canvasReference.getContext("2d");
                if ((this.clearCanvas(t), this.paintBackground(t), this.canvasTimer && !e && this.clearCanvas(this.canvasTimer.getContext("2d")), void 0 === this.audioSequenceReference)) this.paintEmpty(t);
                else {
                    this.paintWaveform(t), this.paintSelector(t), this.paintTextInfo(t), this.canvasTimer && !e && this.paintTimer(this.canvasTimer.getContext("2d"));
                    var i = this.canvasZoomBar.getContext("2d");
                    (this.canvasZoomBar.style.display = "none"),
                        this.viewResolution < this.getAbsoluteToSeconds(this.audioSequenceReference.data.length) &&
                            this.channelIndex == this.audioLayerControl.listOfSequenceEditors.length - 1 &&
                            ((this.canvasZoomBar.style.display = "block"), e || (this.paintZoomBar(i, this)));
                }
            }
        }),
        (this.clearCanvas = function (e) {
            e.clearRect(0, 0, this.canvasReference.width, this.canvasReference.height);
        }),
        (this.paintEmpty = function (e) {
            var t = e.font;
            e.textAlign, e.textBaseline;
            if(jQuery(window).width()<767){
            	var fontsize = '13px';
            } else if(jQuery(window).width()<=800) {
            	var fontsize = '15px';
            } else {
            	var fontsize = '18px';
            }

            if(jQuery(window).width()<=600){
            	var clientWidth = this.canvasWidth / 2;
            } else if(jQuery(window).width()<=800){
            	var clientWidth = this.canvasWidth / 2;
            } else {
            	var clientWidth = this.canvasWidth / 2;
            }

            if(jQuery(window).width()<=600){
            	var clientHeight = 170 / 2-20;
            } else if(jQuery(window).width()<=800){
            	var clientHeight = 170 / 2-20;
            } else {
            	var clientHeight = 170 / 2-20;
            }



            (e.font = " "+fontsize+" FontAwesome"),
                (e.textAlign = "center"),
                (e.textBaseline = "middle"),
                this.paintTextWithShadow(str_drag, clientWidth, clientHeight, "#000", e),
                this.paintTextWithShadow(str_dragnew, clientWidth, clientHeight+30, "#000", e),
                (e.font = t),
                (e.textAlign = "center"),
                (e.textBaseline = "center");
        }),
        (this.paintBackground = function (e) {
            var t = e.createLinearGradient(0, 0, 0, this.canvasReference.height);
            t.addColorStop(0, this.mouseInside ? (this.mouseDown ? this.colorMouseDownTop : this.colorActiveTop) : this.colorInactiveTop),
                t.addColorStop(1, this.mouseInside ? (this.mouseDown ? this.colorMouseDownBottom : this.colorActiveBottom) : this.colorInactiveBottom),
                (e.fillStyle = t),
                e.fillRect(0, 0, this.canvasReference.width, this.canvasReference.height);
        }),
        (this.paintTimerBackground = function (e) {
            var t = this.canvasTimer.width,
                i = this.canvasTimer.height,
                o = Math.ceil(this.canvasTimer.height / 2);
            (e.strokeStyle = "#3800ff"), (e.lineWidth = 1), e.beginPath(), e.moveTo(0, 0), e.lineTo(0, i), e.moveTo(t, 0), e.lineTo(t, i), e.moveTo(0, o), e.lineTo(t, o), e.stroke();
        }),
        (this.paintZoomAllData = function (e) {
            var t = this.audioSequenceReference,
                i = this.canvasZoomBar.height / 2,
                o = t.gain < 1 ? 1 : 1 / t.gain;
            t.data;
            if (((e.strokeStyle = "#3800ff"), e.beginPath(), e.moveTo(0, i), 1 == this.visualizationDataAll.plotTechnique))
                for (var n = 0; n < this.canvasReference.width; ++n) {
                    var s = this.visualizationDataAll[n];
                    e.moveTo(n + 0.5, i + s.min * o * -i), e.lineTo(n + 0.5, i + s.max * o * -i + 1);
                }
            else if (2 == this.visualizationDataAll.plotTechnique)
                for (var n = 0; n < this.visualizationDataAll.length; ++n) {
                    var a = this.visualizationDataAll[n].x,
                        r = i + this.visualizationDataAll[n].y * o * -i;
                    e.lineTo(a, r),
                        e.moveTo(a + 1, r - 1),
                        e.lineTo(a + 1, r + 1),
                        e.moveTo(a - 1, r - 1),
                        e.lineTo(a - 1, r + 1),
                        e.moveTo(a - 1, r + 1),
                        e.lineTo(a + 1, r + 1),
                        e.moveTo(a - 1, r - 1),
                        e.lineTo(a + 1, r - 1),
                        e.moveTo(a, r);
                }
            e.stroke(), (e.strokeStyle = "rgba(0, 0, 0,0.5)"), e.beginPath(), e.moveTo(0, i), e.lineTo(this.canvasReference.width, i), e.stroke();
        }),
        (this.paintZoomBar = function (e, t) {
            var i = this.viewResolution +
                "&viP=" +
                this.viewPos +
                "&sam=" +
                this.audioSequenceReference.sampleRate +
                "&d1=" +
                this.audioSequenceReference.data.length +
                "&v1=" +
                this.canvasReference.width +
                "&vh=" +
                this.canvasZoomBar.height;
        }),
        (this.paintWaveform = function (e) {
            var t = this.audioSequenceReference,
                i = this.canvasReference.height / 2,
                o = t.gain < 1 ? 1 : 1 / t.gain;
            t.data;
            if (((e.strokeStyle = "rgba(0, 0,0,0.5)"), e.beginPath(), e.moveTo(0, i), 1 == this.visualizationData.plotTechnique))
                for (var n = 0; n < this.canvasReference.width; ++n) {
                    var s = this.visualizationData[n];
                    e.moveTo(n + 0.5, i + s.min * o * -i), e.lineTo(n + 0.5, i + s.max * o * -i + 1);
                }
            else if (2 == this.visualizationData.plotTechnique)
                for (var n = 0; n < this.visualizationData.length; ++n) {
                    var a = this.visualizationData[n].x,
                        r = i + this.visualizationData[n].y * o * -i;
                    e.lineTo(a, r),
                        e.moveTo(a + 1, r - 1),
                        e.lineTo(a + 1, r + 1),
                        e.moveTo(a - 1, r - 1),
                        e.lineTo(a - 1, r + 1),
                        e.moveTo(a - 1, r + 1),
                        e.lineTo(a + 1, r + 1),
                        e.moveTo(a - 1, r - 1),
                        e.lineTo(a + 1, r - 1),
                        e.moveTo(a, r);
                }
            e.stroke(), (e.strokeStyle = "rgba(0, 0, 0,0.5)"), e.beginPath(), e.moveTo(0, i), e.lineTo(this.canvasReference.width, i), e.stroke();
        }),
        (this.paintTimer = function (e) {
            this.canvasTimer.style.display = "";
            var t =  this.canvasTimer.width + "&h1=" + this.canvasTimer.height + "&st1=" + this.viewPos + "&ed1=" + this.viewResolution;

        }),
        (this.paintSelector = function (e) {
            var t = this.getAbsoluteToPixel(this.selectionStart),
                o = this.getAbsoluteToPixel(this.selectionEnd);
            if (this.selectionStart !== this.selectionEnd) {
                var n = t < o ? t : o,
                    s = t < o ? o - t : t - o;
                (e.fillStyle = this.colorSelectionFill), e.fillRect(n, 0, s, this.canvasReference.height), (e.strokeStyle = this.colorSelectionStroke), e.strokeRect(n, 0, s, this.canvasReference.height);
            } else (e.strokeStyle = this.colorSelectionStroke), e.beginPath(), e.moveTo(t, 0), e.lineTo(t, this.canvasReference.height), e.stroke();
            var a = this.getAbsoluteToPixel(this.playbackPos);
            a > 0 &&
                a < this.canvasReference.width &&
                ((e.strokeStyle = this.colorSelectionStroke),
                e.beginPath(),
                e.moveTo(a, 0),
                e.lineTo(a, this.canvasReference.height),
                e.stroke(),
                this.paintTextWithShadow(i(this.getAbsoluteToSeconds(this.playbackPos)), a + 5, 70, "rgb(255,0,0)", e));
        }),
        (this.getPeakInFrame = function (e, t, i) {
            var o = Math.round(e),
                n = Math.round(t),
                s = 1,
                a = -1;
            o < 0 || i.length;
            for (var r = o; r < n; ++r) {
                var h = i[r];
                (a = h > a ? h : a), (s = h < s ? h : s);
            }
            return { min: s, max: a };
        }),
        (this.paintTextInfo = function (e) {
            var t = i(this.getAbsoluteToSeconds(this.selectionStart)),
                o = i(this.getAbsoluteToSeconds(this.selectionEnd)),
                n = i(this.getAbsoluteToSeconds(this.selectionEnd - this.selectionStart));
            this.paintTextWithShadow('Selection:' + t + " - " + o + " (" + n + ")", 120, 10, "rgb(255,0,0)", e),
                //this.paintTextWithShadow(str_position + i(this.viewPos), 50, 25, "rgb(0,0,0)", e),
                this.paintTextWithShadow(this.title, 1, 40, "rgba(0,0,0,1)", e);
        }),
        (this.paintTextWithShadow = function (e, t, i, o, n) {
            (n.fillStyle = "rgba(0,0,0,0.25)"),  n.fillText(e, t + 1, i + 1), (n.fillStyle = o), (n.textAlign = 'center'), n.fillText(e, t, i);
        }),
        (this.paintTextWithShadownew = function (e, t, i, o, n) {
            (n.fillStyle = "rgba(0,0,0,0.25)"), n.fillText(e, t + 1, i + 1), (n.fillStyle = o), n.fillText(e, t, i);
        }),
        (this.getSelectionInDataRange = function () {
            return {
                start: Math.round((this.audioSequenceReference.data.length / this.canvasReference.width) * this.selectionStart),
                end: Math.round((this.audioSequenceReference.data.length / this.canvasReference.width) * this.selectionEnd),
            };
        }),
        (this.selectDataInRange = function (e, t) {
            (this.selectionStart = Math.round((this.canvasReference.width / this.audioSequenceReference.data.length) * e)), (this.selectionEnd = Math.round((this.canvasReference.width / this.audioSequenceReference.data.length) * t));
        }),
        (this.getPixelToAbsolute = function (e) {
            if (void 0 === this.audioSequenceReference) return 0;
            var t = this.viewResolution * this.audioSequenceReference.sampleRate,
                i = this.viewPos * this.audioSequenceReference.sampleRate;
            return Math.round((t / this.canvasReference.width) * e + i);
        }),
        (this.getAbsoluteToPixel = function (e) {
            if (void 0 === this.audioSequenceReference) return 0;
            var t = this.viewResolution * this.audioSequenceReference.sampleRate;
            return ((e - this.viewPos * this.audioSequenceReference.sampleRate) / t) * this.canvasReference.width;
        }),
        (this.getAbsoluteToSeconds = function (e) {
            return void 0 === this.audioSequenceReference ? 0 : e / this.audioSequenceReference.sampleRate;
        }),
        (this.getSecondsToAbsolute = function (e) {
            return void 0 === this.audioSequenceReference ? 0 : e * this.audioSequenceReference.sampleRate;
        }),
        (this.zoomIntoSelection = function () {
            this.selectionStart != this.selectionEnd &&
                ((this.viewResolution = this.getAbsoluteToSeconds(this.selectionEnd - this.selectionStart)),
                (this.viewPos = this.getAbsoluteToSeconds(this.selectionStart)),
                this.updateVisualizationData(),
                this.updateSelectionForLinkedEditors());
        }),
        (this.zoomToFit = function () {
            (this.viewPos = 0), (this.viewResolution = this.getAbsoluteToSeconds(this.audioSequenceReference.data.length)), this.updateVisualizationData(), this.updateSelectionForLinkedEditors();
        }),
        (this.filterNormalize = function () {
            var e = this.selectionStart < 0 ? 0 : this.selectionStart >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionStart,
                t = this.selectionEnd < 0 ? 0 : this.selectionEnd >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;
            e == t
                ? (this.saveTmpData(0, this.audioSequenceReference.data.length), this.audioSequenceReference.filterNormalize(), this.storeHistoryDo("filterNormalize", 0, this.audioSequenceReference.data.length))
                : (this.saveTmpData(e, t), this.audioSequenceReference.filterNormalize(e, t - e), this.storeHistoryDo("filterNormalize", e, t)),
                this.updateVisualizationData();
        }),
        (this.filterFade = function (e) {
            var t = this.selectionStart < 0 ? 0 : this.selectionStart >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionStart,
                i = this.selectionEnd < 0 ? 0 : this.selectionEnd >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;
            t == i
                ? (this.saveTmpData(0, this.audioSequenceReference.data.length),
                  this.audioSequenceReference.filterLinearFade(!0 === e ? 0 : 1, !0 === e ? 1 : 0),
                  this.storeHistoryDo("filterFade", 0, this.audioSequenceReference.data.length))
                : (this.saveTmpData(t, i), this.audioSequenceReference.filterLinearFade(!0 === e ? 0 : 1, !0 === e ? 1 : 0, t, i - t), this.storeHistoryDo("filterFade", t, i)),
                this.updateVisualizationData();
        }),
        (this.filterGain = function (e) {
            var t = this.selectionStart < 0 ? 0 : this.selectionStart >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionStart,
                i = this.selectionEnd < 0 ? 0 : this.selectionEnd >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;
            t == i
                ? (this.saveTmpData(0, this.audioSequenceReference.data.length), this.audioSequenceReference.filterGain(this.getQuantity(e)), this.storeHistoryDo("filterGain", 0, this.audioSequenceReference.data.length))
                : (this.saveTmpData(t, i), this.audioSequenceReference.filterGain(this.getQuantity(e), t, i - t), this.storeHistoryDo("filterGain", t, i)),
                this.updateVisualizationData();
        }),
        (this.filterSilence = function () {
            var e = this.selectionStart < 0 ? 0 : this.selectionStart >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionStart,
                t = this.selectionEnd < 0 ? 0 : this.selectionEnd >= this.audioSequenceReference.data.length ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;
            e == t
                ? (this.saveTmpData(0, this.audioSequenceReference.data.length), this.audioSequenceReference.filterSilence(), this.storeHistoryDo("filterSilence", 0, this.audioSequenceReference.data.length))
                : (this.saveTmpData(e, t), this.audioSequenceReference.filterSilence(e, t - e), this.storeHistoryDo("filterSilence", e, t)),
                this.updateVisualizationData();
        }),
        (this.getDecibel = function (e, t) {
            return (20 * Math.log(e / t)) / Math.LN10;
        }),
        (this.getQuantity = function (e) {
            return Math.exp((e * Math.LN10) / 20);
        }),
        (this.clipboardAudioSequence = void 0),
        (this.selectAll = function (e) {
            (this.selectionStart = 0), (this.selectionEnd = this.audioSequenceReference.data.length), this.repaint();
        }),
        (this.selectFromS = function (e) {
            0 != this.selectionStart && ((this.selectionEnd = Math.min(this.selectionStart, this.selectionEnd)), (this.selectionStart = 0), this.repaint());
        }),
        (this.selectToE = function (e) {
            this.selectionEnd != this.audioSequenceReference.data.length && ((this.selectionStart = Math.max(this.selectionStart, this.selectionEnd)), (this.selectionEnd = this.audioSequenceReference.data.length), this.repaint());
        }),
        (this.goto_head = function (e) {
            (this.selectionStart = 0), (this.selectionEnd = 0), this.repaint();
        }),
        (this.set_start_sel = function (e) {
            (this.selectionStart = this.playbackPos), (this.selectionEnd = this.playbackPos), this.repaint();
        }),
        (this.set_end_sel = function (e) {
            (this.selectionEnd = this.playbackPos), this.repaint();
        }),
        (this.copy = function (processLinks) {

        var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionStart;
        var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;

        this.clipboardAudioSequence = this.audioSequenceReference.clone(start, end - start);

        if (processLinks !== undefined && processLinks === true)
        {
            for (var i = 0; i < this.linkedEditors.length; ++i)
            {
                this.linkedEditors[i].copy(false);
            }
        }
        }),
        (this.crop = function (e) {
            var t = this.selectionStart < 0 ? 0 : this.selectionStart,
                i = this.selectionEnd < 0 ? 0 : this.selectionEnd;
            if (t != i && !(t > this.audioSequenceReference.data.length)) {
                var o = [],
                    n = 0,
                    s = 0,
                    a = [],
                    r = 0,
                    h = 0,
                    l = this.selectionStart,
                    c = this.selectionEnd;
                (o = o.concat(this.audioSequenceReference.data)),
                    (n = 0),
                    (s = this.audioSequenceReference.data.length),
                    (r = 0),
                    (h = i - t + 1),
                    (a = a.concat(this.audioSequenceReference.data.slice(t, t + h))),
                    (this.audioSequenceReference.data = this.audioSequenceReference.data.slice(t, t + h)),
                    (this.selectionStart = 0),
                    (this.selectionEnd = this.audioSequenceReference.data.length),
                    this.updateVisualizationData(),
                    this.historyDoit("crop", o, n, s, a, r, h, l, c);
            }
        }),
        (this.addsequence = function (e, t) {
            var i = [],
                o = [],
                n = 0,
                s = 0,
                a = this.selectionStart,
                r = this.selectionEnd;
            (n = this.audioSequenceReference.data.length + e), (s = t.length), this.audioSequenceReference.createZeroData(e);
            var h = CreateNewAudioSequence(e, t);
            this.audioSequenceReference.merge(h),
                (o = this.audioSequenceReference.data.slice(n, n + s + 1)),
                (this.selectionStart = n),
                (this.selectionEnd = n + s),
                this.updateVisualizationData(),
                this.historyDoit("addsequence", i, 0, 0, o, n, s, a, r);
        }),
        (this.pasteDo = function (e, t, i, o, n, s) {
            var a = [],
                r = 0,
                h = 0,
                l = [],
                c = 0,
                u = 0,
                d = this.selectionStart,
                f = this.selectionEnd;
            if (
                (t != i && t < this.audioSequenceReference.data.length && (n - o > 0 && ((a = a.concat(this.audioSequenceReference.data.slice(o, n))), (r = o), (h = n - o)), this.audioSequenceReference.trim(o, s - o)),
                t > this.audioSequenceReference.data.length
                    ? ((c = this.audioSequenceReference.data.length),
                      (u = t - this.audioSequenceReference.data.length + this.clipboardAudioSequence.data.length),
                      this.audioSequenceReference.createZeroData(t - this.audioSequenceReference.data.length),
                      this.audioSequenceReference.merge(this.clipboardAudioSequence),
                      (this.selectionEnd = t + this.clipboardAudioSequence.data.length),
                      (l = l.concat(this.audioSequenceReference.data.slice(c, c + u))))
                    : ((c = t),
                      (u = this.clipboardAudioSequence.data.length),
                      this.audioSequenceReference.merge(this.clipboardAudioSequence, t),
                      (this.selectionStart = t),
                      (this.selectionEnd = t + this.clipboardAudioSequence.data.length),
                      (l = l.concat(this.clipboardAudioSequence.data))),
                this.updateVisualizationData(),
                void 0 !== e && !0 === e)
            )
                for (var v = 0; v < this.linkedEditors.length; ++v) this.linkedEditors[v].paste(!1);
            this.historyDoit("paste", a, r, h, l, c, u, d, f);
        }),
        (this.paste = function (processLinks) {
        if (this.clipboardAudioSequence === undefined) return;

        if (this.selectionStart != this.selectionEnd)
        {
            this.del(false);
        }

        // paste before the data block begins
        if (this.selectionEnd < 0)
        {
            // fill the space with zeros
            this.viewPos -= this.getAbsoluteToSeconds(this.selectionStart);
            this.audioSequenceReference.createZeroData(-this.selectionEnd, 0);
            this.audioSequenceReference.merge(this.clipboardAudioSequence, 0);
            this.selectionStart = 0;
            this.selectionEnd = this.clipboardAudioSequence.data.length;

        }
        // paste beyond the data block
        else if (this.selectionStart > this.audioSequenceReference.data.length)
        {
            this.audioSequenceReference.createZeroData(this.selectionStart - this.audioSequenceReference.data.length);
            this.audioSequenceReference.merge(this.clipboardAudioSequence);
            this.selectionEnd = this.selectionStart + this.clipboardAudioSequence.data.length;
        }
        // paste inside of the datablock
        else
        {
            this.audioSequenceReference.merge(this.clipboardAudioSequence, this.selectionStart);
            this.selectionStart = this.selectionStart;
            this.selectionEnd = this.selectionStart + this.clipboardAudioSequence.data.length;
        }

        this.updateVisualizationData();
        this.repaint();

        if (processLinks !== undefined && processLinks === true)
        {
            for (var i = 0; i < this.linkedEditors.length; ++i)
            {
                this.linkedEditors[i].paste(false);
            }
        }

        }),
        (this.cutDo = function (e, t, i) {
            var o = [],
                n = 0,
                s = 0,
                a = [],
                r = this.selectionStart,
                h = this.selectionEnd;
            if (
                ((this.clipboardAudioSequence = this.audioSequenceReference.clone(t, i - t)),
                i - t > 0 && ((o = o.concat(this.audioSequenceReference.data.slice(t, i))), (n = t), (s = i - t), this.historyDoit("cut", o, n, s, a, 0, 0, r, h)),
                this.audioSequenceReference.trim(t, i - t),
                (this.selectionEnd = this.selectionStart),
                this.updateVisualizationData(),
                void 0 !== e && !0 === e)
            )
                for (var l = 0; l < this.linkedEditors.length; ++l) this.linkedEditors[l].cut(!1);
        }),
        (this.cut = function (processLinks) {
            var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionStart;
        var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;


        this.clipboardAudioSequence = this.audioSequenceReference.clone(start, end - start);


        this.del(false);
        this.selectionEnd = this.selectionStart;
        this.updateVisualizationData();
        if (processLinks !== undefined && processLinks === true)
        {
            for (var i = 0; i < this.linkedEditors.length; ++i)
            {
                this.linkedEditors[i].cut(false);
            }
        }
        }),
        (this.delDo = function (e, t, i) {
            var o = [],
                n = 0,
                s = 0,
                a = [],
                r = this.selectionStart,
                h = this.selectionEnd;
            if (
                (i - t > 0 && ((o = o.concat(this.audioSequenceReference.data.slice(t, i))), (n = t), (s = i - t), this.historyDoit("del", o, n, s, a, 0, 0, r, h)),
                this.audioSequenceReference.trim(t, i - t),
                (this.selectionEnd = this.selectionStart),
                this.updateVisualizationData(),
                void 0 !== e && !0 === e)
            )
                for (var l = 0; l < this.linkedEditors.length; ++l) this.linkedEditors[l].del(!1);
        }),
        (this.del = function (processLinks) {
             var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionStart;
        var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= this.audioSequenceReference.data.length) ? this.audioSequenceReference.data.length - 1 : this.selectionEnd;

        this.audioSequenceReference.trim(start, end - start);
        this.updateVisualizationData();


        if (processLinks !== undefined && processLinks === true)
        {
            for (var i = 0; i < this.linkedEditors.length; ++i)
            {
                this.linkedEditors[i].del(false);
            }
        }
        }),
        void 0 !== typeof this.elementContext.attributes.title && null !== this.elementContext.attributes.title && (this.title = this.elementContext.attributes.title.value),
        "audiolayercontrol" === this.elementContext.parentNode.nodeName.toLowerCase() &&
            ((this.audioLayerControl = this.elementContext.parentNode.audioLayerControl), this.audioLayerControl.addAudioLayerSequenceEditor(this), this.createEditor());
}
function AudioSequence() {
    (this.name = "unnamed"),
        (this.sampleRate = 0),
        (this.data = []),
        (this.gain = 0),
        (this.merge = function (e, t) {
            void 0 === t && (t = this.data.length), e.sampleRate !== this.sampleRate && output_throw("Samplerate does not match."), (t < 0 || t > this.data.length) && output_throw("Merge position is invalid!");
            var i = [];
            (i = i.concat(this.data.slice(0, t))), (i = i.concat(e.data)), t < this.data.length && (i = i.concat(this.data.slice(t, this.data.length))), (this.data = i), (this.gain = this.getGain());
        }),
        (this.trim = function (e, t) {
            void 0 === t && (t = this.data.length - e), e >= this.data.length || e < 0 || t < 0 || (this.data.splice(e, t), (this.gain = this.getGain()));
        }),
        (this.insert = function (e, t, i) {
            if (!(e > this.data.length || e < 0)) {
                var o = [];
                (o = o.concat(this.data.slice(0, e))), (o = o.concat(i)), e < this.data.length && (o = o.concat(this.data.slice(e, this.data.length))), (this.data = o), (this.gain = this.getGain());
            }
        }),
        (this.clone = function (e, t) {
            void 0 === e && (e = 0), void 0 === t && (t = this.data.length - e), (e < 0 || e > this.data.length) && output_throw("Invalid start parameter."), (t < 0 || t + e > this.data.length) && output_throw("Invalid len parameter.");
            for (var i = CreateNewAudioSequence(this.sampleRate), o = e; o < e + t; ++o) i.data.push(this.data[o]);
            return (i.gain = i.getGain()), i;
        }),
        (this.createZeroData = function (e, t) {
            for (var i = [], o = e + 1; --o; ) i.push(0);
            var n = CreateNewAudioSequence(this.sampleRate, i);
            this.merge(n, t), (this.gain = this.getGain());
        }),
        (this.toComplexSequence = function (e, t) {
            void 0 === e && (e = 0),
                void 0 === t && (t = this.data.length - e),
                (e < 0 || e > this.data.length) && output_throw("start parameter is invalid."),
                (t < 0 || t + e > this.data.length) && output_throw("end parameter is invalid.");
            for (var i = [], o = e; o < e + t; ++o) i.push(this.data[o]), i.push(0);
            return i;
        }),
        (this.fromComplexSequence = function (e, t, i) {
            void 0 === t && (t = 0),
                void 0 === i && (i = this.data.length - t),
                e.length / 2 !== i && output_throw("length of complex array does not match"),
                e.length % 2 != 0 && output_throw("the length of the complex array is totally wrong"),
                (t < 0 || t > this.data.length) && output_throw("start parameter is invalid."),
                (i < 0 || i + t > this.data.length) && output_throw("end parameter is invalid.");
            for (var o = 0, n = t; n < t + i; ++n) (this.data[n] = e[o]), (o += 2);
            this.gain = this.getGain();
        }),
        (this.getGain = function (e, t) {
            void 0 === e && (e = 0),
                void 0 === t && (t = this.data.length - e),
                (e < 0 || e > this.data.length) && output_throw("start parameter is invalid."),
                (t < 0 || t + e > this.data.length) && output_throw("end parameter is invalid.");
            for (var i = 0, o = e; o < e + t; ++o) {
                var n = Math.abs(this.data[o]);
                i = Math.max(i, n);
            }
            return i;
        }),
        (this.getLengthInSeconds = function () {
            return this.data.length / this.sampleRate;
        }),
        (this.filterNormalize = function (e, t) {
            void 0 === e && (e = 0),
                void 0 === t && (t = this.data.length - e),
                (e < 0 || e > this.data.length) && output_throw("start parameter is invalid."),
                (t < 0 || t + e > this.data.length) && output_throw("end parameter is invalid.");
            for (var i = this.getGain(e, t), o = 1 / i, n = e; n < e + t; ++n) this.data[n] = this.data[n] * o;
            this.gain = this.getGain();
        }),
        (this.filterGain = function (e, t, i) {
            void 0 === t && (t = 0),
                void 0 === i && (i = this.data.length - t),
                (t < 0 || t > this.data.length) && output_throw("start parameter is invalid."),
                (i < 0 || i + t > this.data.length) && output_throw("end parameter is invalid.");
            for (var o = t; o < t + i; ++o) this.data[o] = this.data[o] * e;
            this.gain = this.getGain();
        }),
        (this.filterSilence = function (e, t) {
            this.filterGain(0, e, t);
        }),
        (this.filterLinearFade = function (e, t, i, o) {
            void 0 === i && (i = 0),
                void 0 === o && (o = this.data.length - i),
                (i < 0 || i > this.data.length) && output_throw("start parameter is invalid."),
                (o < 0 || o + i > this.data.length) && output_throw("end parameter is invalid.");
            for (var n = 0, s = 0, a = i; a < i + o; ++a) (s = (a - i) / o), (n = MathEx.lerp(e, t, s)), (this.data[a] = this.data[a] * n);
            this.gain = this.getGain();
        }),
        (this.filterReverse = function () {
            this.data.reverse();
        }),
        (this.createTestTone = function (e, t) {
            for (var i = [], o = e / this.sampleRate, n = 0; n < t; ++n) i.push((Math.cos(2 * Math.PI * n * o) + Math.cos(2 * Math.PI * n * o * 1)) / 2);
            this.data = i;
        });
}
function CreateNewAudioSequence(e, t) {
    var i = new AudioSequence();
    if (((i.sampleRate = e), (i.data = []), void 0 !== t)) {
        //i.data = [];

		var jjj =   Array.from(t);
		i.data=jjj;

		//const items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //… your array, filled with values
		//const n = 50 //tweak this to add more items per line

// const result = new Array(Math.ceil(t.length / n))
//   .fill()
//   .map(_ => t.splice(0, n));

        // $.each(t,function(jj,kk){

        // 	i.data.push(kk);
        // });
        // for (var o = 0; o < t.length; ++o){
        // 	 i.data.push(t[o]);
        // }

    //     var ihh = 0, len = t.length;
    // while (ihh < len) {
    //     i.data.push(t[ihh]);
    //     ihh++
    // }



    }
    jQuery('#audioloader').addClass('none');
    return i;
}
function WaveTrack() {
    // volume multiplied by 2 but loss in quality
    function e(e, t, i) {
        return 8 == t ? (0 == e ? -1 : e / i - 1) : 0 == e ? 0 : e / i;
    }
    function t(e, t, i) {
        return 8 == t ? (e + 1) * i : e * i;
    }
    (this.sampleRate = 0), (this.audioSequences = []);
    var i = [0, 127, 32767, 66571993087];
    (this.fromAudioSequences = function (e) {
        if (0 !== e.length) {
            for (var t = e[0].sampleRate, i = e[0].data.length, o = 1; o < e.length; ++o) if (e[o].sampleRate != t || e[o].data.length != i) throw "The input sequences must have the same length and samplerate";
            (this.sampleRate = t), (this.audioSequences = e);
        }
    }),
    (this.toBlobUrlAsync = function (e, t, i) {
        var o = this.encodeWaveFile(),
            n = new Blob([o], { type: e });

        if (void 0 === t) {
            var obj = {};
            obj['url'] = URL.createObjectURL(n);
            obj['blobfile'] = n;
            return obj;
        }
        var s = new FileReader();
        (s.onloadend = function (e) {
            t(s.result, i);
        }),
        s.readAsDataURL(n);
    }),
    (this.decodeWaveFile = function (t) {
        var o = new BinaryReader(t);
        o.readString(4), o.readUInt32(), o.readString(4);
        o.gotoString("fmt ");
        var n = (o.readString(4), o.readUInt32(), o.readUInt16(), (this.channels = o.readUInt16())),
            s = ((this.sampleRate = o.readUInt32()), o.readUInt32(), o.readUInt16()),
            a = o.readUInt16();
        o.gotoString("data");
        for (var r = (o.readString(4), o.readUInt32()), h = (this.samplesPerChannel = r / s), l = ["Left Channel", "Right Channel"], c = 0; c < n; ++c)
            this.audioSequences.push(new CreateNewAudioSequence(this.sampleRate)), (this.audioSequences[c].name = l[c]);
        var u = a / 8,
            d = i[u];
        this.gain = 0;
        for (var c = 0; c < h; ++c)
            for (var f = 0; f < n; ++f) {
                var v = 8 == a ? o.readUInt8() : 16 == a ? o.readInt16() : o.readInt32();
                v = Math.min(1, Math.max(-1, v));
                var p = e(v, a, d);
                this.audioSequences[f].data.push(p);
            }
        for (var f = 0; f < n; ++f) this.audioSequences[f].gain = this.audioSequences[f].getGain();
    }),
    (this.encodeWaveFile = function () {
        var e = this.audioSequences.length,
            o = this.sampleRate,
            n = 16,
            s = (o * e * n) / 8,
            a = (e * n) / 8,
            n = 16,
            r = this.audioSequences[0].data.length,
            h = r * a,
            l = h + 36,
            c = l + 8,
            u = new BinaryWriter(c);
        u.writeString("RIFF"),
            u.writeUInt32(l),
            u.writeString("WAVE"),
            u.writeString("fmt "),
            u.writeUInt32(16),
            u.writeUInt16(1),
            u.writeUInt16(e),
            u.writeUInt32(o),
            u.writeUInt32(s),
            u.writeUInt16(a),
            u.writeUInt16(n),
            u.writeString("data"),
            u.writeUInt32(h);
        for (var d = n / 8, f = i[d], v = 0; v < r; ++v) {
            for (var p = 0; p < e; ++p) {
                // Augmenter le volume par deux
                var sample = this.audioSequences[p].data[v] * 1.5;
                // S'assurer que l'échantillon ne dépasse pas les limites [-1, 1]
                sample = Math.max(-1, Math.min(1, sample));
                u.writeInt16(t(sample, n, f));
            }
        }
        return u.data;
    });
}
function Complex(e, t) {
    (this.real = e),
        (this.img = t),
        (this.plus = function (e) {
            return new Complex(this.real + e.real, this.img + e.img);
        }),
        (this.minus = function (e) {
            return new Complex(this.real - e.real, this.img - e.img);
        }),
        (this.times = function (e) {
            return new Complex(this.real * e.real - this.img * e.img, this.real * e.img + this.img * e.real);
        }),
        (this.timesScalar = function (e) {
            return new Complex(this.real * e, this.img * e);
        }),
        (this.conjugate = function () {
            return new Complex(this.real, -this.img);
        }),
        (this.print = function () {
            return (r = this.real), r + " " + this.img;
        });
}
function printComplexArray(e) {
    for (var t = 0; t < e.length; ++t);
}
function checklimit(i){
	// Obtain the uploaded file, you can change the logic if you are working with multiupload
    var file = i;

    // Create instance of FileReader
    var reader = new FileReader();
    reader.onload = function (event) {



        var access = localStorage.getItem("access");

        	if(access=='no'){


			var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        	audioContext.decodeAudioData(event.target.result, function(buffer) {
            var duration = buffer.duration;

            var fileara =jQuery('#audioLayerControl')[0].returnbloburl();
			var aul = document.createElement('audio');
			aul.src = fileara;
			aul.addEventListener('loadedmetadata', function(){
			var duration_l = aul.duration;
			duration = Number(duration)+Number(duration_l);
			 if(duration>60){
            	jQuery('.senddata,.updateaudio').addClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').addClass('disabled');

            	if(jQuery('body').hasClass('post-type-audio')){
            		//jQuery('.limitexceedmodalpopup').trigger('click');
            	}

            	jQuery('.download.cursor_pointer').addClass('disabled');
            } else {
            	jQuery('.senddata.cursor_pointer,.updateaudio').removeClass('disabled');
            	jQuery('.post-type-audio #publish,.post-type-audio .editor-post-publish-panel__toggle,.editor-post-publish-button,.post-type-audio #save-post').removeClass('disabled');
            	jQuery('.download.cursor_pointer').removeClass('disabled');
            }

			});

        });



			}



    };

    // In case that the file couldn't be read
    reader.onerror = function (event) {
        console.error("An error ocurred reading the file: ", event);
    };

    // Read file as an ArrayBuffer, important !
    reader.readAsArrayBuffer(file);
}
function FileDropbox() {
    function e(e, t) {
        t.control.fileload_start && t.control.fileload_start();
        var i = e[0];
        if (i) {
            checklimit(i);
            var o = new FileReader();
            (o.onload = function (e) {
                if (e.target && e.target.result) {
                    var i = e.target.result;
                    jQuery('#audioloader').removeClass('none');
                    (t.resultArrayBuffer = i), (t.resultArrayBuffer_bk = i.slice(0)), (t.result = new Uint8Array(i));
                    if (null !== t.onFinish) t.onFinish();
                } else {
                    console.error("Erreur lors de la lecture du fichier");
                    if (t.onFail) t.onFail(new Error("Erreur lors de la lecture du fichier"));
                }
            }),
            (o.onerror = t.onFail),
            o.readAsArrayBuffer(i);
        } else {
            console.error("Aucun fichier n'a été fourni");
            if (t.onFail) t.onFail(new Error("Aucun fichier n'a été fourni"));
        }
    }
	(this.result = null),
	(this.resultArrayBuffer = null),
	(this.onFinish = null),
	(this.onFail = null),
        (this.defineDropHandler = function (e) {
            e.addEventListener("dragenter", this.skipEventHandler, !1),
                e.addEventListener("dragexit", this.skipEventHandler, !1),
                e.addEventListener("dragover", this.skipEventHandler, !1),
                e.addEventListener("drop", this.dropHandler, !1),
                (e.masterObj = this),
                (e.masterObj.control = e);
        }),
        (this.skipEventHandler = function (e) {
            e.stopPropagation(), e.preventDefault();
        }),
        (this.dropHandler = function (t) {
            t.stopPropagation(), t.preventDefault();
            var i = t.dataTransfer.files;
            i.length > 0 && (e(i, t.currentTarget.masterObj), (t.currentTarget.cur_load_files = i));
        }),
        (this.handleArrayBuffer = function (e, t) {
            t.control.fileload_start && t.control.fileload_start(), (t.resultArrayBuffer = e), (t.result = new Uint8Array(e)), null !== t.onFinish && t.onFinish();
        }),
        (this.reset = function (e) {
            e.resultArrayBuffer_bk &&
                (e.control.fileload_start && e.control.fileload_start(), (e.resultArrayBuffer = e.resultArrayBuffer_bk.slice(0)), (e.result = new Uint8Array(e.resultArrayBuffer)), e.result && null !== e.onFinish && e.onFinish());
        }),
        (this.store_bk = function (e) {
            e.resultArrayBuffer_bk = e.resultArrayBuffer_last.slice(0);
        }),
        (this.handleFiles = e);
}
function SpectrumWorker() {
    (this.toFrequencyDomain = function (e, t, i, o, n, s) {
        if ((void 0 === i && (i = 0), void 0 === o && (o = e.length), !0 !== IsPowerOfTwo(o))) throw "The length of the timeDomain has to be power of two!";
        var a = e.slice(i, i + o),
            r = void 0 === t ? void 0 : t.slice(i, i + o);
        ACFFT(a.length, !1, a, r, n, s);
    }),
        (this.fromFrequencyDomain = function (e, t, i, o) {
            if (e.length !== t) throw "The real and imaginary arrays have a different size";
            ACFFT(e.length, !0, e, t, i, o);
        }),
        (this.toAmplitudeSpectrum = function (e, t, i, o, n, s) {
            if ((void 0 === i && (i = 0), void 0 === o && (o = e.length), void 0 === n && (n = 1024), void 0 === s && (s = 4), void 0 === t && (t = 44100), e.length < n || o < n))
                throw "Length of the timeDomainData is to small (minimum is the windowSize: " + n + ")";
            if (i < 0 || i >= e.length) throw "Start is out of range";
            if (i + o > e.length) throw "Length is out of range";
            var a = e.slice(i, i + o),
                r = [];
            return ComputeSpectrum(a, a.length, n, t, r, !1, s), r;
        }),
        (this.toAmplitudeSpectrumFromAudioSequence = function (e, t, i, o, n) {
            return this.toAmplitudeSpectrum(e.data, e.sampleRate, t, i, o, n);
        });
}
function ACAAFilter(e) {
    void 0 === e && (e = 32),
        (this.pFIR = new ACFIRFilter()),
        (this.cutoffFreq = 0.9),
        (this.length = 0),
        (this.setCutoffFreq = function (e) {
            (this.cutoffFreq = e), this.calculateCoeffs();
        }),
        (this.setLength = function (e) {
            (this.length = e), this.calculateCoeffs();
        }),
        (this.calculateCoeffs = function () {
            var t, i, o, n, s, a, r, h, l, c, u;
            for (
                this.length <= 0 || this.length % 4 != 0 || this.cutoffFreq < 0 || this.cutoffFreq,
                    u = new Float32Array(this.length),
                    this.coeffs = new Float32Array(this.length),
                    r = 2 * this.cutoffFreq,
                    h = Math.PI * r,
                    n = (2 * Math.PI) / e,
                    c = 0,
                    t = 0;
                t < this.length;
                t++
            )
                (i = t - this.length / 2), (o = i * h), (s = 0 != o ? (r * Math.sin(o)) / o : 1), (a = 0.54 + 0.46 * Math.cos(n * i)), (o = a * s), (u[t] = o), (c += o);
            l = 16384 / c;
            for (var t = 0; t < this.length; t++) (o = u[t] * l), (o += o >= 0 ? 0.5 : -0.5), (this.coeffs[t] = o);
            this.pFIR.setCoefficients(this.coeffs, this.length, 14);
        }),
        (this.evaluate = function (e, t, i) {
            return this.pFIR.evaluateFilter(e, t, i);
        }),
        (this.getLength = function () {
            return this.pFIR.getLength();
        }),
        this.setLength(e);
}
function init(e) {
    sampleRate = e.sampleRate;
}
function record(e) {
    recBuffersL.push(e[0]), recBuffersR.push(e[1]), (recLength += e[0].length);
}
function exportWAV(e) {
    var t = mergeBuffers(recBuffersL, recLength),
        i = mergeBuffers(recBuffersR, recLength),
        o = interleave(t, i),
        n = encodeWAV(o),
        s = new Blob([n], { type: e });
    this.postMessage(s);
}
function getBuffer() {
    var e = [];
    e.push(mergeBuffers(recBuffersL, recLength)), e.push(mergeBuffers(recBuffersR, recLength)), this.postMessage(e);
}
function clear() {
    (recLength = 0), (recBuffersL = []), (recBuffersR = []);
}
function mergeBuffers(e, t) {
    for (var i = new Float32Array(t), o = 0, n = 0; n < e.length; n++) i.set(e[n], o), (o += e[n].length);
    return i;
}
function interleave(e, t) {
    for (var i = e.length + t.length, o = new Float32Array(i), n = 0, s = 0; n < i; ) (o[n++] = e[s]), (o[n++] = t[s]), s++;
    return o;
}
function floatTo16BitPCM(e, t, i) {
    for (var o = 0; o < i.length; o++, t += 2) {
        var n = Math.max(-1, Math.min(1, i[o]));
        e.setInt16(t, n < 0 ? 32768 * n : 32767 * n, !0);
    }
}
function writeString(e, t, i) {
    for (var o = 0; o < i.length; o++) e.setUint8(t + o, i.charCodeAt(o));
}
function encodeWAV(e) {
    var t = new ArrayBuffer(44 + 2 * e.length),
        i = new DataView(t);
    return (
        writeString(i, 0, "RIFF"),
        i.setUint32(4, 32 + 2 * e.length, !0),
        writeString(i, 8, "WAVE"),
        writeString(i, 12, "fmt "),
        i.setUint32(16, 16, !0),
        i.setUint16(20, 1, !0),
        i.setUint16(22, 2, !0),
        i.setUint32(24, sampleRate, !0),
        i.setUint32(28, 4 * sampleRate, !0),
        i.setUint16(32, 4, !0),
        i.setUint16(34, 16, !0),
        writeString(i, 36, "data"),
        i.setUint32(40, 2 * e.length, !0),
        floatTo16BitPCM(i, 44, e),
        i
    );
}
function ACFIRFilter() {
    (this.resultDivFactor = 0),
        (this.length = 0),
        (this.lengthDiv8 = 0),
        (this.filterCoeffs = void 0),
        (this.resultDivider = 0),
        (this.evaluateFilter = function (e, t, i) {
            var o,
                n,
                s,
                a,
                r = 1 / this.resultDivider;
            this.length, (s = i - this.length);
            for (var h = 0, n = 0; n < s; n++) {
                a = 0;
                for (var o = 0; o < this.length; o += 4) a += t[h + o + 0] * this.filterCoeffs[o + 0] + t[h + o + 1] * this.filterCoeffs[o + 1] + t[h + o + 2] * this.filterCoeffs[o + 2] + t[h + o + 3] * this.filterCoeffs[o + 3];
                (a *= r), (e[n] = a), h++;
            }
            return s;
        }),
        (this.setCoefficients = function (e, t, i) {
            if (t % 8) throw "FIR filter length not divisible by 8";
            (this.lengthDiv8 = t / 8), (this.length = 8 * this.lengthDiv8), this.length, (this.resultDivFactor = i), (this.resultDivider = Math.pow(2, this.resultDivFactor)), (this.filterCoeffs = new Float32Array(this.length));
            for (var o = 0; o < this.filterCoeffs.length; ++o) this.filterCoeffs[o] = e[o];
        }),
        (this.getLength = function () {
            return this.length;
        });
}
function getLocalStorage(e, t, i) {
    (callback_requestSuccess = t), (callback_requestFailed = i), window.webkitStorageInfo.requestQuota(PERSISTENT, e, successfulQuotaRequest, failedQuotaRequest);
}
function successfulQuotaRequest(e) {
    window.requestFileSystem(PERSISTENT, e, successfulFileSystemCreated, failedFileSystemCreation);
}
function failedQuotaRequest(e) {
    void 0 !== callback_requestFailed && callback_requestFailed(e);
}
function successfulFileSystemCreated(e) {
    (fileSystemEntry = e), void 0 !== callback_requestSuccess && callback_requestSuccess(e);
}
function failedFileSystemCreation(e) {
    void 0 !== callback_requestFailed && callback_requestFailed(e);
}
function readFile(e, t, i) {
    fileSystemEntry.root.getFile(
        e,
        {},
        function (e) {
            e.file(function (e) {
                var i = new FileReader();
                (i.onload = function (e) {
                    t(e, this);
                }),
                    i.readAsArrayBuffer(e);
            });
        },
        i
    );
}
function writeFile(e, t, i) {
    var o = function () {
        fileSystemEntry.root.getFile(
            e,
            { create: !0 },
            function (e) {
                e.createWriter(t);
            },
            i
        );
    };
    removeFile(e, o, o);
}
function removeFile(e, t, i) {
    fileSystemEntry.root.getFile(
        e,
        { create: !1 },
        function (e) {
            e.remove(t, i);
        },
        i
    );
}
var FFT = (function () {
    function e(e, t, i, o) {
        var r = ((o ? a : -a) * t) / i;
        (e[0] = s(r)), (e[1] = n(r));
    }
    function t(t, i, o, n) {
        var s,
            a,
            r,
            h,
            l,
            c,
            u,
            d,
            f,
            v,
            p = 0.5 * t.length,
            m = 0,
            g = 0,
            S = p / 2,
            y = p / n,
            w = n / 2,
            E = 1 * w,
            q = new Float32Array(2);
        for (s = 0; s < y; s++, g += E)
            for (e(q, s, 2 * y, o), a = 0; a < w; a++, m++, g++)
                (r = t[2 * m]),
                    (h = t[2 * m + 1]),
                    (l = t[2 * (m + S)]),
                    (c = t[2 * (m + S) + 1]),
                    (u = r + l),
                    (d = h + c),
                    (f = r - l),
                    (v = h - c),
                    (i[2 * g] = u),
                    (i[2 * g + 1] = d),
                    (i[2 * (g + w)] = q[0] * f - q[1] * v),
                    (i[2 * (g + w) + 1] = q[0] * v + q[1] * f);
    }
    function i(e, i, o, n) {
        var s,
            a,
            r,
            h,
            l = 1,
            c = 0,
            u = 0.5 * e.length,
            d = o.length;
        for (h = 0; h < d; h++) (r = o[h]), (l *= r), 0 === c ? ((s = e), (a = i), (c = 1)) : ((s = i), (a = e), (c = 0)), 2 === r && t(s, a, n, l);
        if (n) {
            if (1 === c) for (h = 0; h < u; h++) (e[2 * h] = i[2 * h]), (e[2 * h + 1] = i[2 * h + 1]);
        } else if (1 === c) for (h = 0; h < u; h++) (e[2 * h] = i[2 * h] / u), (e[2 * h + 1] = i[2 * h + 1] / u);
        else for (h = 0; h < u; h++) (e[2 * h] = e[2 * h] / u), (e[2 * h + 1] = e[2 * h + 1] / u);
    }
    function o() {
        this.reset.apply(this, arguments);
    }
    var n = Math.sin,
        s = Math.cos,
        a = 2 * Math.PI;
    return (
        (o.prototype = {
            factors: null,
            scratch: null,
            bufferSize: 256,
            reset: function (e) {
                (this.bufferSize = isNaN(e) ? this.bufferSize : e), (this.factors = []);
                for (var t = this.getExp(this.bufferSize) - 1, i = 0; i < t; ++i) this.factors.push(2);
                this.scratch = new Float32Array(this.bufferSize);
            },
            getExp: function (e) {
                for (var t = e, i = 0; ; ) {
                    if (0 == (t >>= 1)) break;
                    ++i;
                }
                return i;
            },
            forward: function (e) {
                i(e, this.scratch, this.factors, !0);
            },
            backward: function (e) {
                i(e, this.scratch, this.factors, !1);
            },
        }),
        o
    );
})();
!(function (e) {
    var t = function (e, t) {
        var i = t || {},
            o = i.bufferLen || 4096;
        (this.context = e.context), (this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, o, 2, 2));
        var n = new Worker(i.workerPath || "recorderWorker.js");
        n.postMessage({ command: "init", config: { sampleRate: this.context.sampleRate } });
        var s,
            a = !1;
        (this.node.onaudioprocess = function (e) {
            a && n.postMessage({ command: "record", buffer: [e.inputBuffer.getChannelData(0), e.inputBuffer.getChannelData(1)] });
        }),
            (this.configure = function (e) {
                for (var t in e) e.hasOwnProperty(t) && (i[t] = e[t]);
            }),
            (this.record = function () {
                a = !0;
            }),
            (this.stop = function () {
                a = !1;
            }),
            (this.clear = function () {
                n.postMessage({ command: "clear" });
            }),
            (this.getBuffer = function (e) {
                (s = e || i.callback), n.postMessage({ command: "getBuffer" });
            }),
            (this.exportWAV = function (e, t) {
                if (((s = e || i.callback), (t = t || i.type || "audio/wav"), !s)) throw new Error("Callback not set");
                n.postMessage({ command: "exportWAV", type: t });
            }),
            (n.onmessage = function (e) {
                var t = e.data;
                s(t);
            }),
            e.connect(this.node),
            this.node.connect(this.context.destination);
    };
    (t.forceDownload = function (t, i) {
        var o = (e.URL || e.webkitURL).createObjectURL(t),
            n = e.document.createElement("a");
        (n.href = o), (n.download = i || "output.wav");
        var s = document.createEvent("Event");
        s.initEvent("click", !0, !0), n.dispatchEvent(s);
    }),
        (e.Recorder = t);
})(window);
var gFFTBitTable = void 0,
    MaxFastBits = 16;
(window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem), (window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder), (window.URL = window.URL || window.webkitURL);
var record_audio_context,
    record_recorder,
    record_node,
    record_spectrum,
    record_analyserNode,
    recording = !1,
    record_result_blob,
    activeAudioLayerControl = void 0,
    focusOnAudioLayerSequenceEditor = void 0,
    clipboardAudioSequence = void 0;
window.addEventListener(
    "copy",
    function (e, t) {
        void 0 !== focusOnAudioLayerSequenceEditor && focusOnAudioLayerSequenceEditor.copy(!0);
    },
    !0
),
    window.addEventListener(
        "paste",
        function (e, t) {
            void 0 !== focusOnAudioLayerSequenceEditor && focusOnAudioLayerSequenceEditor.paste(!0);
        },
        !0
    ),
    window.addEventListener(
        "cut",
        function (e, t) {
            void 0 !== focusOnAudioLayerSequenceEditor && focusOnAudioLayerSequenceEditor.cut(!0);
        },
        !0
    ),
    window.addEventListener(
        "crop",
        function (e, t) {
            void 0 !== focusOnAudioLayerSequenceEditor && focusOnAudioLayerSequenceEditor.crop(!0);
        },
        !0
    ),
    window.addEventListener("scroll", function (e) {}, !0),
    window.addEventListener(
        "keydown",
        function (e) {

               /* 32 == e.keyCode && (document.querySelector("#audioLayerControl").playToggle(), (e.cancelBubble = !0), (e.returnValue = !1))*/
            void 0 !== focusOnAudioLayerSequenceEditor &&
                (46 == e.keyCode && focusOnAudioLayerSequenceEditor.del(!0),
                81 == e.keyCode && (focusOnAudioLayerSequenceEditor.movementActive = !0));
        },
        !0
    ),
    window.addEventListener(
        "keyup",
        function (e) {
            void 0 !== focusOnAudioLayerSequenceEditor && 81 == e.keyCode && (focusOnAudioLayerSequenceEditor.movementActive = !1);
        },
        !0
    );
var FFTComplex = function () {
        (this.fft = function (e) {
            var t = e.length;
            if (1 === t) return [e[0]];
            for (var i = [], o = 0; o < t / 2; ++o) i.push(e[2 * o]);
            for (var n = this.fft(i), s = [], o = 0; o < t / 2; ++o) s.push(e[2 * o + 1]);
            for (var a = this.fft(s), r = [], o = 0; o < t / 2; ++o) {
                var h = (-2 * o * Math.PI) / t,
                    l = new Complex(Math.cos(h), Math.sin(h));
                (r[o] = n[o].plus(l.times(a[o]))), (r[o + t / 2] = n[o].minus(l.times(a[o])));
            }
            return r;
        }),
            (this.ifft = function (e) {
                for (var t = e.length, i = [], o = 0; o < t; ++o) i[o] = e[o].conjugate();
                i = this.fft(i);
                for (var o = 0; o < t; ++o) i[o] = i[o].conjugate();
                for (var o = 0; o < t; ++o) i[o] = i[o].timesScalar(1 / t);
                return i;
            });
    },
    MathEx = new (function () {
        this.lerp = function (e, t, i) {
            return e < t ? e + (t - e) * i : t + (e - t) * (1 - i);
        };
    })();
(window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem), (window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder), (window.URL = window.URL || window.webkitURL);
var recLength = 0,
    recBuffersL = [],
    recBuffersR = [],
    sampleRate;
(this.onmessage = function (e) {
    switch (e.data.command) {
        case "init":
            init(e.data.config);
            break;
        case "record":
            record(e.data.buffer);
            break;
        case "exportWAV":
            exportWAV(e.data.type);
            break;
        case "getBuffer":
            getBuffer();
            break;
        case "clear":
            clear();
    }
}),
    (window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem);
var callback_requestSuccess = void 0,
    callback_requestFailed = void 0,
    fileSystemEntry = void 0;



/*-------------pplike2.js-----------------*/
var CoolBox = function(options){

    options = options || {};

    options.width = options.width || 400;
    options.height = options.height || 300;

    // The main box that encapsulates the entire plugin.
    var box = document.createElement('div');
    box.className = 'cool-box box';

    var content = document.createElement('div');
    content.className ='cool-box content'
    box.appendChild(content);

    // Top blue bar that holds the text title. This is hidden, unless a title is
    // specified.
    var titleBar = document.createElement('div');
    titleBar.className = 'cool-box title-bar';
    titleBar.style.display = 'none';
    content.appendChild(titleBar);

    // The actual text title.
    var title = document.createElement('span');
    title.className = 'cool-box title';
    titleBar.appendChild(title);

    // Create the loading image container. This will span accross the body of
	// the
    // box but will be initially hidden.
    var loader = document.createElement('div');
    loader.className = 'cool-box body loader';
    loader.style.display = 'none';
    content.appendChild(loader);

    // The body is where the actual content i.e. headers and images are placed.
    // The body does not contain either the top title or the bottom control
    // buttons.
    var body = document.createElement('div');
    body.className = 'cool-box body';
    content.appendChild(body);

    // The controls represent the bottom bar for containg bottoms.
    var controls = document.createElement('div');
    controls.className = 'cool-box controls';
    controls.style.display = 'none';
    content.appendChild(controls);


    /**
	 * Cross-browser compatible method for retreiving window width.
	 */
    var getWindowWidth = function()
    {
        return window.innerWidth || document.body.clientWidth;
    }

    /**
	 * Cross-browser compatible method for retreiving window height.
	 */
    var getWindowHeight = function()
    {
        return window.innerHeight || document.body.clientHeight;
    }

    /**
	 * Sets the title on the top bar. If the specified text is null or undefined
	 * then the method will not have any effect.
	 */
    this.setTitle = function(text)
    {
        if(text){
            title.innerHTML = text;
            titleBar.style.display = 'block';
        }
    }

    this.addButton = function(label, callback, grey)
    {
        // By default he button is blue.
        grey = grey || false;

        if(label){

            var button = document.createElement('button');


            button.innerHTML = label;
            button.className = 'cool-box button ' + ((grey)? 'grey' : '');

            if(callback){
                button.onclick = callback;
            }

            controls.appendChild(button);

            controls.style.display = 'block';

            return button;
        }


        return null;

    };

    this.loading = function(isLoading){
        loader.style.display = (isLoading) ? 'block' : 'none';
        body.style.display = (isLoading) ? 'none' : 'block';
    }


    this.show = function(){

        // Update the box's width and height according to the set options.
        box.style.width = options.width + "px";
        box.style.height = options.height + "px";

        // Horizontally center the box on the visible screen.
        box.style.left = (getWindowWidth() / 2 - options.width / 2) + "px";
        box.style.top = (getWindowHeight() / 2 - options.height / 3 * 2) + "px";

        // Display the block.
        box.style.display = 'block';
        box.style.position = 'fixed';

    }

    this.addContent = function(content){
        body.appendChild(content);
    }

    this.hide = function()
    {
        box.style.display = 'none';
    }


    this.hide();
    document.body.appendChild(box);

}

CoolBox.StandardContent = function(headline, message, imageSrc, highlight){

    var content = document.createElement('div');

    if(headline){
        var header = document.createElement('h1');
        header.className = 'cool-box standard-header';
        header.innerHTML = headline;
        content.appendChild(header);
    }

    if(imageSrc){
        var img = document.createElement('img');
        img.className = 'cool-box standard-image';
        img.src = imageSrc;
        content.appendChild(img);
    }

    if(message){
        var paragraph = document.createElement('p');
        paragraph.innerHTML = message;
        content.appendChild(paragraph);
    }

    if(highlight){
        var bold = document.createElement('p');
        bold.className = 'cool-box standard-highlight';
        bold.innerHTML = highlight;
        content.appendChild(bold);
    }

    return content;

}

function pplike_setCookie(name,value){
	var Days=10;
	var date=new Date();
	date.setTime(date.getTime()+Days*24*60*60*1000);
	document.cookie=name+"="+escape(value)+";expires="+date.toGMTString();
}

function pplike_getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
}

function pplike_manualshowlike()
{
	var cookiename = window.location.href;
	if ( pplike_getCookie( cookiename ) != "yes" )
	{
		setTimeout(function (){pplike_showmessage();},1000*5);
	}
	pplike_setCookie(cookiename,"yes");
}

function pplike_showmessage()
{
	var coolbox = new CoolBox({width: "400", height: "250"});
	var content = document.createElement('div');
	// content.innerHTML = document.getElementById("xx").innerHTML;
	var content = document.getElementById("poplike");
	coolbox.addContent(content);
	coolbox.addButton('close', function(){
		coolbox.hide();
	}, true);
	coolbox.setTitle('I like it!');
	coolbox.show();
}
/*------------------------------*/


var colorInactiveTop ="#000";
var str_drag = jsVars.translate_click + " \uf130 " + jsVars.translate_to_record;
var str_dragnew = jsVars.translate_click + " \uf093 " + jsVars.translate_to_upload;
var str_leftc = "";
var str_rightc = "";
var str_position = "Position:";
var str_selection = "Selection:";

var procepid = "";