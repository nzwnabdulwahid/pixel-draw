import React, { useEffect, useRef, useState } from 'react';
import { Grid, GRID_HEIGHT, GRID_WIDTH } from './components/Grid';

const delta = 20;
let startX:number;
let startY:number;
let isCapturing:boolean;

type Coords = [number, number]

const defaultFloor = [
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'],
]

enum MODE {
    PENCIL,
    LINE,
    RECTANGLE
}

export function FloorBuilder ({}) {
    const [floor, setFloor] = useState(defaultFloor);
    const [estimateFloor,setEstimateFloor] = useState(defaultFloor)
    const [highlightedCoordinate, setHighLightedCoordinate] = useState<null | [number, number]>()
    const [offset, setOffset] = useState<[number, number] | undefined>(undefined)
    const [estimatedBold, setEstimatedBold] = useState<string[] | []>([])
    const [mode, setMode] = useState<MODE>(MODE.RECTANGLE)
    const ref = useRef<any>()
    
    const renderFloor = () => {
        return floor.map((row,i) => <div key={i} onLoad={(event) => console.log(event)} style={{display:'flex', flexDirection:'row'}}>
            {row.map((col, j) => {
                
                let possibleValue = estimateFloor[i][j] !== "_" ? estimateFloor[i][j] : col
                return <Grid key={`${i}-${j}`} i={i} j={j} value={possibleValue}/>
            })}
        </div>)
    }

    useEffect(() => {
        if(ref){
            let bb = ref.current.getBoundingClientRect();
            setOffset([bb.x, bb.y])
        }
    }, [ref])

    const onMouseDown =  (event:React.MouseEvent) => {
        const { pageX, pageY } = event;
        startX = pageX;
        startY = pageY;
        isCapturing = true;
        if(mode === MODE.RECTANGLE){

        }else {
            boldify([getCoordinate([pageX, pageY]).join(',')])
        }
    }

    const onMouseUp = (event:React.MouseEvent) => {
        const { pageX, pageY } = event;
        const diffX = Math.abs(pageX - startX);
        const diffY = Math.abs(pageY - startY);
        if (diffX < delta && diffY < delta) {
            // Click!
        }else {
            if(mode === MODE.PENCIL){
                boldify([getCoordinate([pageX, pageY]).join(',')])
            }else if(mode === MODE.LINE || mode === MODE.RECTANGLE){
                boldify(estimatedBold)
                setEstimatedBold([])
            }
        }
        isCapturing = false;

    }
    
    const onMouseMove = (event: React.MouseEvent) => {
        event.preventDefault()
        const { pageX, pageY } = event;
        const highlighted = getCoordinate([pageX, pageY])
        setHighLightedCoordinate(highlighted)
        if(isCapturing){ //should be on pencil mode
            if(mode === MODE.PENCIL){
                boldify([getCoordinate([pageX, pageY]).join(',')])
            }else if(mode === MODE.LINE) {
                const lineCoordinate = estimateLine(getCoordinate([startX, startY]), getCoordinate([pageX, pageY]));
                estimateBold(lineCoordinate)
                setEstimatedBold(lineCoordinate)
            }else if(mode === MODE.RECTANGLE){
                const rectCoordiante = estimateRect(getCoordinate([startX, startY]), getCoordinate([pageX, pageY]));
                estimateBold(rectCoordiante)
                setEstimatedBold(rectCoordiante)
            }
        }
    }

    const estimateLine = ([x0, y0]: Coords, [x1, y1]: Coords) => {
        if(x0 === x1 || y0 === y1){
            //eligible for straight line draw
            const expansionAxis = x0 === x1 ? 'y' : 'x'
            const diff = getDiff(expansionAxis === 'y' ? {a:y0, b:y1} : {a:x0, b:x1})
            const startPoint = expansionAxis === 'y' ? Math.min(y0, y1) : Math.min(x0, x1);
            let generated = [];
            for(let i = startPoint; i < startPoint + diff; i++){
                if(expansionAxis === 'y'){
                    generated.push(`${x0},${i+1}`)
                }else {
                    generated.push(`${i+1},${y0}`)
                }
            }
            return generated
        }else {
            //non straight line - Bresenham Algorithm TODO:understand more
            const coordinatesArray = []
            
            let dx = Math.abs(x1 - x0);
            let dy = Math.abs(y1 - y0);
            let sx = (x0 < x1) ? 1 : -1;
            let sy = (y0 < y1) ? 1 : -1;
            let err = dx - dy;
            coordinatesArray.push(`${x0},${y0}`);
            while (!((x0 == x1) && (y0 == y1))) {
                var e2 = err << 1;
                if (e2 > -dy) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
                coordinatesArray.push(`${x0},${y0}`);
            }
            return coordinatesArray;
        }
    }

    const estimateRect = ([x0, y0]: Coords, [x1, y1]: Coords) => {
        // const [x2, y2] = [x0,y1];
        // const [x3, y3] = [x1,y0];
        const xDiff = getDiff({a:x0, b:x1})
        const yDiff = getDiff({a:y0, b:y1})
        console.log({xDiff, yDiff});
        const coordinatesArray = [];
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);

        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        for(let i = minX-1; i < maxX; i++){
            coordinatesArray.push(`${i+1},${minY}`)
            coordinatesArray.push(`${i+1},${minY + yDiff}`)
        }

        for(let j = minY; j < maxY; j++){
            coordinatesArray.push(`${minX},${j+1}`)
            coordinatesArray.push(`${minX + xDiff},${j+1}`)
        }
        return coordinatesArray;
    }
    
    const getDiff = ({a,b}: {a:number, b:number}) : number => {
        return Math.abs(a-b)
    }

    const getCoordinate = (coordinate: [number, number]): [number, number] => {
        if(offset){
            return [Math.floor((coordinate[0] - offset[0]) / (GRID_WIDTH + 1)), Math.floor((coordinate[1] - offset[1]) / (GRID_HEIGHT + 1))]
        }
        return [-1, -1]
    }
    const boldify = (coordinates: string[]) => {
        const _floor = [...floor].map((row,i) => row.map((col, j) => {
            if(coordinates.includes(`${j},${i}`)){
                return 'C'
            }
            return floor[i][j]
        }))

        setFloor(_floor);
    }

    const estimateBold = (coordinates: string[]) => {
        const _floor = [...floor].map((row,i) => row.map((col, j) => {
            if(coordinates.includes(`${j},${i}`)){
                return 'C'
            }
            return floor[i][j]
        }))

        setEstimateFloor(_floor);
    }

    
    return <div style={{alignItems:'center', display:'flex',flexDirection:'column', justifyContent:'center', height:'100vh'}}>
        <div style={{position:'relative'}}>
            {renderFloor()}
            <div ref={ref} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp} style={{width:'100%',height:'100%',top:0,right:0, position:'absolute'}}>
                {highlightedCoordinate && <div style={{height: GRID_HEIGHT, width:GRID_WIDTH, position:'absolute', backgroundColor:'lightgreen', top:highlightedCoordinate[1] * 21, left:highlightedCoordinate[0] * 21}}/>}
            </div>
        </div>
    </div>
}