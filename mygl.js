import {
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    TRIANGLES,
}                         from "./util/constants.mjs";
import {mat4, quat, vec3} from "./matrix/gl-matrix.js";
import {arr_diff}         from "./util/utilities.js";

let cubeRotation = 0.0;

let globalState = {
    indexBuffer: undefined,
    vertexBuffer: undefined,
};


import {Shader} from "./lib/Shader.js";

import {CubeGeometry} from "./lib/Geometry.js";

import {Mesh} from "./lib/Mesh.js";

import Stats from "./stats/stats.module.js";

main();

function main() {

    const canvas = document.getElementById('glCanvas');

    let gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const vs = document.getElementById('vertShader').innerText;

    const fs = document.getElementById('fragShader').innerText;

    const shader = new Shader(vs, fs, gl);

    let myObjArr = [];

    let myGeom = new CubeGeometry("aPosition", "aTextureCoord", "aNormal");

    myGeom.interleaveAttributes();

    for (let i = 0; i < 1000; i++) {

        let obj = new Mesh(myGeom);

        obj.addUniform('uColor', [Math.random(), Math.random(), Math.random(), Math.random()]);

        obj.position = [((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200];

        obj.rotateRad(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

        myObjArr.push(obj);
    }

    let then = 0;
    let rq;

    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then            = now;
        stats.begin();
        draw(gl, shader, myObjArr, deltaTime);
        stats.end();

        rq = requestAnimationFrame(render);
    }

    rq = requestAnimationFrame(render);

    window.stopRender = function(){
        cancelAnimationFrame(rq);
        rq = null;
    }

    window.startRender = function(){
        rq = requestAnimationFrame(render);
    }
}

function draw(gl, shader, objectArr, deltaTime) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect      = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear       = 0.1;
    const zFar        = 1000.0;

    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();

    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -10]);

    mat4.rotate(viewMatrix, viewMatrix,
                cubeRotation * 0.5,
                [0, 0, 1]);

    mat4.rotate(viewMatrix, viewMatrix, cubeRotation * .2, [0, 1, 0]);

    for (let i = 0; i < objectArr.length; i++) {
        const object = objectArr[i];

        if (object.geom.needsBuffers === true) {
            // console.log(object.geom);
            object.geom.initBuffers(gl);
            object.geom.needsBuffers = false;
        }

        if (object.needsModelUpdate === true) {
            object.updateModelMatrix();
            // console.log(object.uniforms);
            // console.log('updateing model matrix')
            object.needsModelUpdate = false;
        }

        //TODO add shader verification map maybe?   <-- not necessary rn but if slows down maybe

        const object_attr_length = Object.keys(object.geom.attributes).length;

        const comparison_obj = Object.assign({}, object.geom.attributes, shader.info.attr);

        const comparison_obj_length = Object.keys(comparison_obj).length;

        if (comparison_obj_length > object_attr_length) {

            if (object.indexed === true) {

                const initial_array = arr_diff(Object.keys(object.geom.attributes), Object.keys(shader.info.attr));

                //only get undefined props
                const final_array = initial_array.filter(x => object.geom.attributes[x] === undefined);

                throw `Object does not have properties: ${final_array}`;

            }
            else {
                throw `Object does not have properties: ${arr_diff(object.geom.attributes.keys(), shader.info.attr.keys())}`;
            }

        }

        for (let key in object.geom.attributes) {

            if (!object.geom.attributes.hasOwnProperty(key)) continue;

            //if is a index buffer
            if (object.geom.attributes[key].index === true) {

                if(! (globalState.indexBuffer === object.geom.buffers[key])){
                    console.log('switching index buffer');
                    gl.bindBuffer(ELEMENT_ARRAY_BUFFER, object.geom.buffers[key]);
                    globalState.indexBuffer = object.geom.buffers[key];
                }

            }

            else {


                const numComponents = object.geom.attributes[key].size;
                const type          = gl.FLOAT;
                const normalize     = false;
                const stride        = 0;
                const offset        = 0;

                // console.log(object.buffers[key])

                gl.bindBuffer(ARRAY_BUFFER, object.geom.buffers[key]);

                gl.vertexAttribPointer(
                    shader.info.attr[key],
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);

                gl.enableVertexAttribArray(
                    shader.info.attr[key]);
            }

        }

        if (!(gl.getParameter(gl.CURRENT_PROGRAM) === shader.program)) {
            gl.useProgram(shader.program);
        }

        const obj_uni    = object.uniforms;
        const shader_uni = shader.info.uni;

        for (let key in obj_uni) {

            if (!obj_uni.hasOwnProperty(key)) continue;

            if (!shader_uni[key]) {
                console.log(shader);
                console.warn(`shader does not have uniform ${key}, will not apply`);
                continue;
            }

            if (shader_uni[key].data.length > obj_uni[key].length) {
                throw new RangeError(`The uniform ${key} has data which is too short`);
            }

            try {
                shader_uni[key].data.set(obj_uni[key], 0);
            } catch {

                throw new RangeError(`The uniform ${key} has a length that is too long`);

            }

            if (shader_uni[key].matrix === true) {

                shader_uni[key].func.call(gl, shader_uni[key].location, false, shader_uni[key].data);

            }
            else {

                shader_uni[key].func.call(gl, shader_uni[key].location, shader_uni[key].data);

            }
        }

        gl.uniformMatrix4fv(
            shader.info.uni['uProjectionMatrix'].location,
            false,
            projectionMatrix);

        gl.uniformMatrix4fv(
            shader.info.uni['uViewMatrix'].location,
            false,
            viewMatrix);

        const normalMatrix = mat4.create();

        mat4.invert(normalMatrix, object.model);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(shader.info.uni['uNormalMatrix'].location, false, normalMatrix);

        if (object.geom.indexed === true) {

            {
                const vertexCount = object.geom.attributes['indices'].data.length;
                const type        = gl.UNSIGNED_SHORT;
                const offset      = 0;
                gl.drawElements(TRIANGLES, vertexCount, type, offset);
            }

        }
        else {

            gl.drawArrays(TRIANGLES, 0, object.geom.attributes['aPosition'].data.length);

        }
    }

    cubeRotation += deltaTime;

}
