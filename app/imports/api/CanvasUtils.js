
var CLR_RED = "#d66";
var CLR_WHITE = "#fff";
var CLR_BLACK = "#22252c"; 
var CLR_BLUE = '#66f';
var CLR_YELLOW = "#ff6";
var CLR_DBLUE = "#00a"

var CLR_SEQ = [
    CLR_RED, 
    CLR_BLUE, 
    CLR_YELLOW,
    CLR_BLACK,
    CLR_DBLUE
]

function rgb(x, y, z){
    return 'rgb(' + x + ',' +y + ','+z+')';
}

export function 
/* draw data 
to canvas context*/
drawWaveformOnCanvas(canvasCtx, data, height, width){
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = CLR_BLUE;

    canvasCtx.beginPath();

    var sliceWidth = width * 1.0 / data.length;
    var x = 0;

    for (var i = 0; i < data.length; i++) {
        var v =data[i] / 128.0;
        var y = height - v * height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(width, height / 2);
    canvasCtx.stroke();
}

export function 
/* draw bar graph 
to canvas context */
drawBarGraphOnCanvas(canvasCtx, dataArray, height, width){
    // canvasCtx.clearRect(0, 0, width, height);

    var barWidth = (width / dataArray.length) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = rgb(barHeight/3 + 100, barHeight/3 + 100,50)
        canvasCtx.fillRect(x,height/2-barHeight/4,barWidth,barHeight/2);
        x += barWidth + 1;
    }
}

export function
/* draw cirle of given
radius onto the canvas */
drawVolumeOnCanvas(canvasCtx, rms, height, width){
    // canvasCtx.clearRect(0, 0, width, height);

    /* if rms greater than 10,
    then plot 10 else plot rms */
    rms = Math.min(rms*100, 10)
    
    let limit = 10
    let size = 5

    for(let i=0;i<rms;i++){
        let h = 10 - i
        canvasCtx.fillStyle = rgb(i*10 + 150, i*10 + 150, 255);
        canvasCtx.fillRect ( 
            width - 1.5*height/10, 
            h/10 * height, 
            height/10, 
            height/15 
        )
    }
}

export function
/* draws 2d image
to canvas context */
drawImageOnCanvas(canvasCtx, data, colAlpha, height, width){
    let blockH = height / data[0].length
    let blockW = width / data.length
    let intensity;
    let minm;
    let summ;

    for ( let i = 0; i < data.length; i++ ) {
        minm = Math.min.apply ( Math, data[i] )
        summ = data[i].reduce((sum, b) => (sum + b - minm), 0)

        for ( let j = 0; j < data[i].length; j++ ){
            intensity = ( data [i][j] - minm ) / summ * Math.min(colAlpha[i]*10, 1)
            intensity = (1 - intensity) * (1 - intensity)

            if(intensity >= 0) 
                canvasCtx.fillStyle = rgb(intensity * 255, intensity * 255, 255)

            canvasCtx.fillRect ( i * blockW, j * blockH, blockW, blockH ) 
        }
    }
}

export function 
/* marks beat ranges
on the canvas context */
markBeatsOnCanvas(canvasCtx, ranges, max, width, height, beats){
    let starts = ranges[0]
    let ends = ranges[1]
    let blockW = width / max
    canvasCtx.lineWidth = 1;
    for ( let i=0; i < ends.length; i++ ) {

        canvasCtx.setLineDash([]);
        /* mark start */
        canvasCtx.strokeStyle = CLR_BLUE;

        canvasCtx.beginPath();
        canvasCtx.moveTo ( starts[i] * blockW, 0 )
        canvasCtx.lineTo ( starts[i] * blockW, height )
        canvasCtx.stroke ()

        canvasCtx.setLineDash([5, 15]);
        /* mark end */
        canvasCtx.strokeStyle = CLR_RED;

        canvasCtx.beginPath();
        canvasCtx.moveTo ( ends[i] * blockW, 0 )
        canvasCtx.lineTo ( ends[i] * blockW, height )
        canvasCtx.stroke ()

        /* draw inner rectangle */
        if(beats[i]>=CLR_SEQ.length) beats[i] = CLR_SEQ.length -1
        canvasCtx.fillStyle = CLR_SEQ[beats[i]]
        canvasCtx.globalAlpha = 0.4;
        canvasCtx.fillRect( starts[i] * blockW, 0, (ends[i]-starts[i])*blockW, height );
        canvasCtx.globalAlpha = 1.0;
    }
}
