import React, { useEffect } from 'react';

type GridProps = {
    i:number;
    j:number;
    value:string;
}

export const GRID_HEIGHT = 10;
export const GRID_WIDTH = 10;
function UnmemoizedGrid({i, j, value}: GridProps){
    const getBG = () => {
        switch(value) {
            case 'd': return 'cyan';
            case 'C': return 'gray';
            default: return 'transparent'
        }
    }
    
    return <div  style={{height:GRID_HEIGHT, width:GRID_WIDTH,backgroundColor: getBG(), borderBottomWidth:1, borderRightWidth:1, borderTopWidth:0, borderLeftWidth:0, borderColor:'black', borderStyle:'solid'}}>

    </div>
}

export const Grid = React.memo(UnmemoizedGrid)