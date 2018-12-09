import Meyda from 'meyda'

function 
/* get new audio 
context object */
createAudioCtx(){
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
}

function
/* create microphone
audio input source from 
audio context */
createMicSrcFrom(audioCtx){
    /* get microphone access */
    return new Promise((resolve, reject)=>{
        /* only audio */
        let constraints = {audio:true, video:false}

        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream)=>{
            /* create source from
            microphone input stream */
            let src = audioCtx.createMediaStreamSource(stream)
            resolve(src)
        }).catch((err)=>{reject(err)})
    })
}

export function
/* call given function
on new microphone analyser
data */
onMicDataCall(features, callback){
    return new Promise((resolve, reject)=>{
        let audioCtx = createAudioCtx()

        createMicSrcFrom(audioCtx)
        .then((src) => {
            let recorder = Meyda.createMeydaAnalyzer({
                'audioContext': audioCtx,
                'source':src,
                'bufferSize':512,
                'featureExtractors':features,
                'callback':callback
            })
            resolve(recorder)
        }).catch((err)=>{
            reject(err)
        })
    })
    
}

export function
/* convolution filter
over audio signal rms */
convolveFilter(rms, filter){
    let response = [];
    let filtersum = filter.reduce((a, b)=>(a+b),0)
    for(let i=0;i<rms.length - filter.length + 1;i++){
        let tmp = 0;
        for(let j=0;j<filter.length;j++){
            tmp += rms[i+j]*filter[j];
        }
        response.push(tmp/filtersum);
    }
    return response;
}
