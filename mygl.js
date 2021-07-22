import {mat4}     from "./matrix/gl-matrix.js";
import {arr_diff} from "./lib/util/utilities.mjs";
import {Shader}   from "./lib/Shader.js";

import {CubeGeometry} from "./lib/Geometry.js";

import {Mesh} from "./lib/Mesh.js";

import Stats      from "./stats/stats.module.js";
import {Camera}   from "./lib/Camera.js";
import {Renderer} from "./lib/Renderer.js";

main();

let theta = 0.0;


function main() {

    const canvas = document.getElementById('glCanvas');

    // let gl = canvas.getContext('webgl');

    const renderer = new Renderer(canvas);
    renderer.setSize(1920, 1080);

    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const vs = document.getElementById('vertShader').innerText;

    const fs = document.getElementById('fragShader').innerText;

    const shader = new Shader(vs, fs);

    let myCam = new Camera(45 * Math.PI / 180, renderer.cnv.width / renderer.cnv.height, 0.1, 1000);

    let myObjArr = [];

    let myGeom = new CubeGeometry("aPosition", "aTextureCoord", "aNormal");

    for (let i = 0; i < 2000; i++) {

        let obj = new Mesh(myGeom);

        obj.setUniform('uColor', [Math.random(), Math.random(), Math.random(), 1.0]);

        obj.position = [((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200];

        // obj.ro(Math.random() * 180 / Math.PI * 2, Math.random() * 180 / Math.PI * 2, Math.random() * 180 / Math.PI * 2);
        obj.rotateX(Math.random() * Math.PI);
        obj.rotateY(Math.random() * Math.PI);
        obj.rotateZ(Math.random() * Math.PI);

        // console.log(obj);

        // console.log(obj);

        myObjArr.push(obj);
    }

    //DEBUG CUBE
    let myObj = new Mesh(myGeom);
    //
    myObj.setUniform('uColor', [Math.random(), Math.random(), Math.random(), 1.0]);
    myObj.position = [0,0,0];
    myObjArr.push(myObj);
    //

    myCam.position = [0, 0, -10];

    let rq;

    function animate() {
        stats.begin();
        renderer.render(shader, myObjArr, myCam);
        // draw(gl, shader, myObjArr, myCam);
        stats.end();

        // console.log(myCam.position);
        // myCam.position = [
        //         2 * Math.sin(theta * Math.PI / 180),
        //         2 * Math.sin(theta * Math.PI / 180),
        //         2 * Math.cos(theta * Math.PI / 180)
        //     ];

        // myCam.rotateX(theta*180/Math.PI * 0.07, theta*180/Math.PI * 0.05, theta*180/Math.PI * 0.08);
        // myCam.rotateX(theta*180/Math.PI * 0.07);
        // myCam.rotateY(theta*180/Math.PI * 0.07);
        // myCam.rotateZ(theta*180/Math.PI * 0.07);

        rq = requestAnimationFrame(animate);

        theta += 0.1;
    }

    rq = requestAnimationFrame(animate);

    window.stopRender = function () {
        cancelAnimationFrame(rq);
        rq = null;
    };

    window.startRender = function () {
        rq = requestAnimationFrame(animate);
    };
}