import React, { Component } from 'react';
import ErrorContainer from './ErrorContainer.js';
import AudioUtils from '../api/AudioUtils.js';
import CanvasUtils from '../api/CanvasUtils.js';
import Beat from '../api/Beat.js'

const CANVAS_H = 200;
const CANVAS_W = 800;
const featuresList = ["mfcc","rms"];


export default class App extends Component {
    constructor (props){
        super(props)
        /* initial state */
        this.state = {
            isRecording:false,/* true if app is recording */
            isPlaying:false,/* true if app is playing the audio */
            error:"App could not be loaded!"
        }

        this.mCanvasCtx = null 
        this.mRecorder = null 
        this.mfccHistory = [] 
        this.rmsHistory = []
        this.mBeats = null
    }

    /* add canvas context from 
    reference to component state */
    addCanvasCtx(){
        this.mCanvasCtx =  this.refs.canvase.getContext("2d")
    }

    /* call back
    for on mic data */
    onData(features){
        this.mCanvasCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        
        CanvasUtils.drawVolumeOnCanvas(
            this.mCanvasCtx,
            features["rms"],
            CANVAS_H,
            CANVAS_W
        )
        
        this.rmsHistory.push(features["rms"])
        this.mfccHistory.push(features["mfcc"])
    }

    /* when recording 
    is completed */
    onRecordComplete(){

        /* draw mfcc history */
        CanvasUtils.drawImageOnCanvas(
            this.mCanvasCtx,
            this.mfccHistory,
            this.rmsHistory,
            CANVAS_H,
            CANVAS_W
        )

        let ranges = Beat.getBeatRanges(this.rmsHistory)
        this.mBeats = Beat.getCorrelatedBeats(this.mfccHistory, ranges)
        // console.log(Beat.getCorrelatedBeats(this.mfccHistory, ranges, true))

        CanvasUtils.markBeatsOnCanvas(
            this.mCanvasCtx,
            ranges,
            this.rmsHistory.length,
            CANVAS_W,
            CANVAS_H,
            this.mBeats
        )

    }

    /* on component mounted */
    componentDidMount(){
        /* set mic canvas plot
        as on-mic-data callback */
        AudioUtils.onMicDataCall(featuresList,(features)=>{this.onData(features)})
        .then((recorder)=>{
            this.mRecorder = recorder
            this.setState((state, props)=>{
                state.error = null
                return state
            })
        }).catch((err)=>{
            alert(err)
        })

        /* add the canvas
        reference context */
        this.addCanvasCtx()
    }

    /* Start recording
    audio from mic */
    toggleRecording ( event ) {
        event.preventDefault()
        let el = event.target
        if(this.state.isRecording){
            /* stop recording */
            this.setState((state, props) =>{
                state.isRecording = false
                return state
            })
            this.mRecorder.stop()
            
            this.onRecordComplete()
        }else{
            /* set variables */
            this.setState((state, props) =>{
                state.isRecording = true
                return state
            })

            /* reset audio data */
            this.rmsHistory.length = 0
            this.mfccHistory.length = 0

            /* start recording */
            this.mRecorder.start()
        }
    }

    render(){
        /* display error */

        let options;
        if(this.state.error != null){
            options = (<ErrorContainer error={this.state.error}></ErrorContainer>)
        }else{
            options =  (<div className="container-row">
                            <div className="container-cell"
                                onClick={this.toggleRecording.bind(this)}>
                                {
                                    /* inner text for
                                     record button */
                                    (()=>{
                                        if(this.state.isRecording) return "Stop and Convert"
                                        else return "Record"
                                    })()
                                }
                            </div>
                            <div className="container-cell">Play</div>
                        </div>
            )
        }
        
        /* if no error */
        return (
            <div className="container">
                {options}
                <div className="container-row">
                    <canvas ref="canvase" width={CANVAS_W} height={CANVAS_H}></canvas>
                </div>
            </div>
        );
    }
}