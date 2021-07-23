import {vec3}   from "./matrix/gl-matrix.js";
import {Shader} from "./lib/Shader.js";

import {CubeGeometry, Geometry} from "./lib/Geometry.js";

import {Mesh} from "./lib/Mesh.js";

import Stats      from "./stats/stats.module.js";
import {Camera}   from "./lib/Camera.js";
import {Renderer} from "./lib/Renderer.js";
import {LINES, POINTS}   from "./lib/util/constants.mjs";
import {Ray}      from "./lib/Intersect.js";

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

    renderer.registerShader(shader);

    const pointVS     = document.getElementById("pointVert").innerText;
    const pointFS     = document.getElementById("pointFrag").innerText;
    const pointShader = new Shader(pointVS, pointFS);

    renderer.registerShader(pointShader);

    let myCam      = new Camera(45 * Math.PI / 180, renderer.cnv.width / renderer.cnv.height, 0.1, 1000);
    myCam.position = [0, 0, -10];

    let myGeom = new CubeGeometry("aPosition", "aTextureCoord", "aNormal");

    for (let i = 0; i < 2000; i++) {

        let obj = new Mesh(myGeom, shader);

        obj.setUniform('uColor', [Math.random(), Math.random(), Math.random(), 1.0]);

        obj.position = [((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200];

        obj.rotateX(Math.random() * Math.PI);
        obj.rotateY(Math.random() * Math.PI);
        obj.rotateZ(Math.random() * Math.PI);
    }

    //DEBUG CUBE
    let myObj = new Mesh(myGeom, shader);
    myObj.setUniform('uColor', [Math.random(), Math.random(), Math.random(), 1.0]);
    myObj.rotateXYZ(Math.PI / 5, Math.PI / 8, Math.PI / 4);
    myObj.genBB();

    let myPointGeom      = new Geometry();
    myPointGeom.drawType = LINES;
    let positions = myObj.geom.bb.getPositions();
    renderer.gl.lineWidth(5);

    let colors = [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ];

    // let r = new Ray(vec3.create(0,0,0), )
    for (let i = 0; i < 16; i++) {
        const dir = vec3.random(vec3.create());
        vec3.normalize(dir, dir);
        let ray         = new Ray([0, 0, 0], dir);
        let intersected = myObj.geom.intersectBB(ray);
        if (intersected) {
            console.log("t", intersected);
            let phit = vec3.add(vec3.create(), ray.orig, vec3.scale(vec3.create(), ray.dir, intersected));
            positions.push(ray.orig[0], ray.orig[1], ray.orig[2], phit[0], phit[1], phit[2])
            colors.push(1,0,0, 1,0,0);
            console.log(phit);
            // let phit = vec3.add(vec3.create(), ray.orig,  vec3.scale(vec3.create(), ray.orig, t));
            // console.log(ray.orig, " ", phit);
        }
    }

    myPointGeom.addAttribute("aPosition", positions, 3);
    myPointGeom.addAttribute("aColor", colors, 3);

    let myPointMesh = new Mesh(myPointGeom, pointShader);
    myPointMesh.setUniform("uProjectionMatrix", myCam.projection);
    myPointMesh.setUniform("uViewMatrix", myCam.view);

    let rq;

    function animate() {
        stats.begin();
        renderer.render(myCam);
        stats.end();

        myCam.rotateY(0.01);
        // myCam.rotateZ(0.2);

        rq = requestAnimationFrame(animate);
        // stopRender();
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