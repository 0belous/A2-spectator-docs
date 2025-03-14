declare World: {
    --- Draws a line in space, color values are from 0-1, lifetime of 0 means it will not be cleared
    drawLine: (startPos: Vec3, endPos: Vec3, r: number, g: number, b: number, thickness: number, lifetime: number)-> (),
    --- Draws a point in space, color values are from 0-1, lifetime of 0 means it will not be cleared
    drawPoint: (position: Vec3, r: number, g: number, b: number, pointSize: number, lifetime: number)-> (),
    --- Clears all existing lines and points
    clear:()-> (),
}