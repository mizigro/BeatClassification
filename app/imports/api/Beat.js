import DTW from 'dtw';

const WINDOW_SIZE = 5;
const THRESHOLD_FACTOR = 1/5

const BEAT_SIMILARITY_THRESHOLD = 0.20;
/* chik this gap is like 29 43 (~20+)... */
/* dub gap with any of chik and this is 200+ */
/* similar ones have gap < 20 */

export function 
/* split based on steep
 rise and drop from max */
getBeatRanges(rms){
    //  factor * area of triangle (height => max, length => WINDOW_SIZE)
    let threshold = THRESHOLD_FACTOR * Math.max.apply(Math, rms) * WINDOW_SIZE; 
    
    let curSum = 0;/* current rms window sum */
    let rangeStarts = []; /* array of beat range start positions */
    let rangeEnds = []; /* array of beat range end positions */
    let inRange = false; /* true if currently 
                            inside a beat range */

    /* get rms sum for first window */
    for ( let i=1; i < WINDOW_SIZE; i++ ) {
        curSum += rms[i]
    }

    /* if window sum high enough */
    if ( curSum > threshold ) {
        /* push start position */
        rangeStarts.push ( 0 );
        inRange = true;
    }

    for ( let i = WINDOW_SIZE; i<rms.length; i++ ) {
        /* update current 
        window rms sum */
        curSum += rms[i] - rms[i - WINDOW_SIZE]

        /* if currently
        inside a beat range */
        if ( inRange ) {
            /* if window sum
            too low */
            if ( curSum < threshold ) {
                /* add beat end */
                rangeEnds.push(i)
                inRange = !inRange
            }
        } else {
            /* if window 
            sum high enough */
            if( curSum > threshold ){
                /* add beat start */
                rangeStarts.push(i - WINDOW_SIZE)
                inRange = !inRange
            }
        }
    }

    if ( inRange ) rangeEnds.push(rms.length - 1);
    console.log(rangeStarts, rangeEnds)
    return [rangeStarts, rangeEnds]
}

export function 
/* get correlated beats */
getCorrelatedBeats(mfcc, ranges, returnCosts = false){
    let threshold = BEAT_SIMILARITY_THRESHOLD;
    let uniqueBeats = 0;
    let costs = [];
    let dtw = new DTW()

    for(let i=0;i<mfcc.length;i++){
        let summ = mfcc[i].reduce((a, b)=>a+b, 0)
        for(let j=0;j<mfcc[i].length;j++)
            mfcc[i][j] /= summ;
    }

    let starts = ranges[0];
    let ends = ranges[1];
    let beatTypes = [];

    for(let i=0; i<ends.length;i++){
        if(returnCosts) costs.push([]);
        let limit;
        if(returnCosts) limit = ends.length;
        else limit = i;
        for(let j=0;j<limit;j++){
            
            let seqX = mfcc.slice(starts[i], ends[i])
            let seqY = mfcc.slice(starts[j], ends[j])

            let cost = 0
            for(let k=0;k<mfcc[0].length;k++)
                cost += dtw.compute(seqX.map((x)=>(x[k])), seqY.map((x) =>(x[k])))
            // console.log(i, j, cost)
            
            cost = cost/(seqX.length + seqY.length)

            if(returnCosts)
                costs[costs.length-1].push(cost)
            else{
                // console.log(i, j, " => ",cost)
                if( cost < threshold ){
                    // console.log(i, " matches with ", j)
                    beatTypes.push(beatTypes[j]);
                    break;
                }
            }
        }
        if(!returnCosts && beatTypes.length<i+1)
            beatTypes.push(uniqueBeats++)
    }

    if (returnCosts)
        return costs;
    else 
        return beatTypes;
}