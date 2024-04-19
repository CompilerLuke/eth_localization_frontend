import "./Annotation.css"
import { useState, useRef, useEffect } from 'react'

async function fetchFloorplanAnnotation() {
    try {
        console.log("Fetching annotation");
        const response = await fetch('/mapping/annotation/floorplan_annotation');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        return jsonData
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function crossProduct(point1, point2, point3) {
    return (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
  }
  
// Function to check if point3 is left of the line formed by point1 and point2
function isLeft(point1, point2, point3) {
return crossProduct(point1, point2, point3) > 0;
}

function toAbsolute(point, scale) {
    return {x: point.x * scale[0], y: point.y * scale[1]}
}

function mouseOverContour(ctx, contour) {
    let inside = false;
    for (let i = 1; i <= contour.length; i++) {
        let start = toAbsolute(contour[(i-1)%contour.length], ctx.scale);
        let end = toAbsolute(contour[i%contour.length], ctx.scale);

        const x = ctx.mouse.pos.x;const y = ctx.mouse.pos.y;
        const xi = start.x;const yi = start.y;
        const xj = end.x;const yj = end.y;
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < ((xj - xi) * (y - yi) / (yj - yi) + xi));
        if (intersect) inside = !inside;
    }
    return inside;
}

function renderContour(ctx, stroke, fill, lineWidth, contour) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    let start = toAbsolute(contour[0], ctx.scale);
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i <= contour.length; i++) {
        let end = toAbsolute(contour[i%contour.length], ctx.scale);
        ctx.lineTo(end.x,end.y);
    }

    if(stroke != "") ctx.stroke();
    if(fill != "") ctx.fill();
}

function renderRoomAnnotation(ctx, dim, rooms, action, set_action) {
    console.log("Rendering rooms\n");
    console.log(rooms);

    for(let room of rooms) {
        let contour = room.contour;
        let over = mouseOverContour(ctx, contour);
        let color = room.color;
        renderContour(ctx, over ? 'red' : 'black', `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`, dim[0]*0.002, contour);
        if(over && ctx.mouse.down) {
            console.log("Setting action", action);
            set_action({"type": "room", "label": room.label});
        }
        ctx.beginPath();
    }
}

function renderOutline(ctx, dim, outline, action, set_action) {
    renderContour(ctx, 'black', '', dim[0]*0.005, outline);
}

function RenderAnnotations({ annotation, action, setAction, width, height }) {
    const canvasRef = useRef(null);

    let scale = [width, height];

    const [mouse, setMouse] = useState({pos: { x: 0, y: 0 }, down: false});

    const handleMouseMove = (event) => {
        setMouse({ ...mouse, pos : { x: event.clientX, y: event.clientY }});
    };
    const handleMouseUp = (event) => {
        setMouse({ ...mouse, down: false });
    };
    const handleMouseDown = (event) => {
        setMouse({ ...mouse, down: true });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-over';

        // Draw something on the canvas
        ctx.fillStyle = 'blue';

        const rect = canvas.getBoundingClientRect();

        ctx.mouse = {...mouse, pos:  {x: mouse.pos.x-rect.left, y: mouse.pos.y-rect.top}};
        ctx.scale = scale;

        let mouse_inside = 0 < ctx.mouse.pos.x && ctx.mouse.pos.x < rect.right-rect.left && 0 < ctx.mouse.pos.y && ctx.mouse.pos.y < rect.bottom-rect.top;
        if(mouse_inside && mouse.down) {
            console.log("Click");
            setAction({});
        }

        console.log("Rendering Annotation");
        console.log(annotation);
        if(annotation.rooms) renderRoomAnnotation(ctx, scale, annotation.rooms, action, setAction);
        if(annotation.outline) renderOutline(ctx, scale, annotation.outline, action, setAction);
        // You can continue drawing more elements on the canvas if needed
    }, [annotation, mouse]);

    return <div className="FloorplanZone" onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <img className="FloorplanBackground" width={width} height={height} src="mapping/annotation/floorplan_img" />
        <canvas className="FloorplanAnnotation" ref={canvasRef} width={width} height={height} />;
    </div>
}

function RoomProperties({action}) {
    return <div>
        <h1>{action.label}</h1>
    </div>;
}

function Properties({annotation, set_annotation, action, set_action}) {
    let body = <h1>Empty</h1>;

    if(action.type == "room") {
        body = <RoomProperties action={action} />
    }

    return <div>
        <h1>Properties</h1>
        {body}
    </div>
}

export default function AnnotateFloorplan() {
    const [action, setAction] = useState({});
    const [annotation, setAnnotation] = useState({});

    useEffect(() => {
        fetchFloorplanAnnotation().then((annotation) => {
            console.log("Fetched annotation");

            let rooms = [];
            for(let [room, contour] of annotation.rooms) {
                let color = [
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256),
                    0.1
                ];
    
                rooms.push({
                    label: room,
                    color: color,
                    contour: contour.map((p => { return {x: p[0], y: p[1]} }))
                });
            } 
    
            let annotation_state = {
                rooms: rooms,
                outline: annotation["outline"].map((p => { return {x: p[0], y: p[1]} }))
            };
    
            setAnnotation(annotation_state);
        })
    }, []);

    let width = 1000;
    let height = 600;

    return <div className="AnnotationWindow">
        <div style={{width: width, height: height, margin: 100}}>
            <h1>Annotate Floorplan</h1>
            <RenderAnnotations annotation={annotation} setAnnotation={setAnnotation} action={action} setAction={setAction} width={width} height={height} />
        </div>
        <Properties annotation={annotation} setAnnotation={setAnnotation} action={action} setAction={setAction}/>
    </div>
    ;
}