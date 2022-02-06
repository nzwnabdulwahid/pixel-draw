import React from 'react';

type GridProps = {
    i:number;
    j:number;
    value:string;
}

export const GRID_HEIGHT = 20;
export const GRID_WIDTH = 20;
export function Grid({i, j, value}: GridProps){

    const getBG = () => {
        switch(value) {
            case 'd': return 'cyan';
            case 'C': return 'gray';
            default: return 'transparent'
        }
    }

    const onMouseMove = (event: React.MouseEvent) => {
        console.log("internal");
    }
    return <div onMouseMove={onMouseMove} style={{height:GRID_HEIGHT, width:GRID_WIDTH,backgroundColor: getBG(), borderBottomWidth:1, borderRightWidth:1, borderTopWidth:0, borderLeftWidth:0, borderColor:'black', borderStyle:'solid'}}>

    </div>
}