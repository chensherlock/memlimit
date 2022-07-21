var count = 0;		
var Collection = [];
var MB = 1024 * 1024;
function $(x) { return document.getElementById(x); } 
function checkJsHeap() {
    try {
        let buffer = new ArrayBuffer(MB);
        let ints = new Int8Array(buffer);
        for ( i = 0; i < MB; i++ ) {
            ints[i] = Math.random() * 256;
        }

        Collection[count] = buffer;
        count++;
        $("memorysize").innerHTML = (count).toLocaleString();
        if (window.chrome) {
            let mem = window.performance.memory;
            $("totalJSHeapSize").innerHTML = (mem.totalJSHeapSize/MB).toLocaleString();
            var hue=Math.floor((1 - mem.totalJSHeapSize / (4 * 1024 * MB)) * 120);
            $("totalJSHeapSize").style.color = ("hsl(" + hue + ",100%,50%)");
            $("usedJSHeapSize").innerHTML = (mem.usedJSHeapSize/MB).toLocaleString();
            $("usedJSHeapSize").style.color = ("hsl(" + hue + ",100%,50%)");
            $("jsHeapSizeLimit").innerHTML = (mem.jsHeapSizeLimit/MB).toLocaleString();
        }
        localStorage.setItem('size', count);
        setTimeout(checkJsHeap, 10);
    } catch ( e ) {	 // Out-Of-Memory Check to see if the exception can be caught
        $("status").innerHTML = "name=" + e.name + ", message=" + e.message;
        $("MemRec").innerHTML = localStorage.getItem('size');        
    }
}


function checkWasm() {
    count++;
    try {
        let memory = new WebAssembly.Memory({initial: count * 16});
        $("memorysize").innerHTML = (count).toLocaleString();
        memory = null;
        if (window.chrome) {
            let mem = window.performance.memory;
            $("totalJSHeapSize").innerHTML = (mem.totalJSHeapSize/MB).toLocaleString();
            var hue=Math.floor((1 - mem.totalJSHeapSize / (4 * 1024 * MB)) * 120);
            $("totalJSHeapSize").style.color = ("hsl(" + hue + ",100%,50%)");
            $("usedJSHeapSize").innerHTML = (mem.usedJSHeapSize/MB).toLocaleString();
            $("usedJSHeapSize").style.color = ("hsl(" + hue + ",100%,50%)");
            $("jsHeapSizeLimit").innerHTML = (mem.jsHeapSizeLimit/MB).toLocaleString();
        }
        localStorage.setItem('size', count);
        setTimeout(checkWasm, 10);
    } catch ( e) {
        $("status").innerHTML = "name=" + e.name + ", message=" + e.message;
        $("MemRec").innerHTML = localStorage.getItem('size');
    }
}


(async () => {
    const response = await fetch('addtwo.wasm');
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.compile(buffer);
    const instance = new WebAssembly.Instance(module);
    const result = instance.exports.addTwo(1, 2);
    console.log(result);
    let out = new WebAssembly.Memory({initial: 1});
    console.log(out);
})();


function ready() {
    document.body.style.background = 'black';
    document.body.style.color = 'white';
    $("useragent").innerHTML = navigator.userAgent;
    $("MemRec").innerHTML = localStorage.getItem('size');
    $("DeviceMem").innerHTML = navigator.deviceMemory.toLocaleString();    
    if (window.chrome) {
        $("jsheap").style.visibility = "visible";
        let mem = window.performance.memory;
        $("totalJSHeapSize").innerHTML = (mem.totalJSHeapSize / MB).toLocaleString();
        $("usedJSHeapSize").innerHTML = (mem.usedJSHeapSize / MB).toLocaleString();
        $("jsHeapSizeLimit").innerHTML = (mem.jsHeapSizeLimit / MB).toLocaleString();
    }
}

document.addEventListener("DOMContentLoaded", ready);