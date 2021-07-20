import {ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, TRIANGLES,} from "./util/constants.mjs";
import {mat4}                                           from "./matrix/gl-matrix.js";
import {arr_diff}                                       from "./util/utilities.js";
import {Shader}                                         from "./lib/Shader.js";

import {CubeGeometry} from "./lib/Geometry.js";

import {Mesh} from "./lib/Mesh.js";

import Stats    from "./stats/stats.module.js";
import {Camera} from "./lib/Camera.js";

let cubeRotation = 0.0;

let globalState = {
    indexBuffer : undefined,
    vertexBuffer: undefined,
    program     : undefined,
};


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

    let myCam = new Camera(45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);

    let myObjArr = [];

    let myGeom = new CubeGeometry("aPosition", "aTextureCoord", "aNormal");

    for (let i = 0; i < 2000; i++) {

        let obj = new Mesh(myGeom);

        obj.addUniform('uColor', [Math.random(), Math.random(), Math.random(), Math.random()]);

        obj.position = [((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200, ((Math.random() * 2) - 1) * 200];

        obj.rotateRad(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

        myObjArr.push(obj);
    }

    let rq;

    function render() {
        stats.begin();
        draw(gl, shader, myObjArr, myCam);
        stats.end();

        myCam.rotateRad(0, 0.01, 0);

        rq = requestAnimationFrame(render);
    }

    rq = requestAnimationFrame(render);

    window.stopRender = function () {
        cancelAnimationFrame(rq);
        rq = null;
    };

    window.startRender = function () {
        rq = requestAnimationFrame(render);
    };
}

function draw(gl, shader, objectArr, camera) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(! (globalState.program === shader.program)){
        console.log('shader program switch');
        gl.useProgram(shader.program);
        globalState.program = shader.program;
    }

    if(camera.needsModelUpdate){
        camera.updateModelMatrix();
        gl.uniformMatrix4fv(shader.info.uni['uProjectionMatrix'].location, false, camera.projection);
        gl.uniformMatrix4fv(shader.info.uni['uViewMatrix'].location, false, camera.model);
    }

    for (let i = 0; i < objectArr.length; i++) {
        const object = objectArr[i];

        if (object.geom.needsBuffers === true) {
            // console.log(object.geom);
            object.geom.initBuffers(gl);
            object.geom.needsBuffers = false;
        }

        if (object.needsModelUpdate === true) {
            object.updateModelMatrix();
            object.needsModelUpdate = false;
        }

        //TODO add shader verification map maybe?   <-- not necessary rn but if slows down maybe

        // const object_attr_length = Object.keys(object.geom.attributes).length;
        //
        // const comparison_obj = Object.assign({}, object.geom.attributes, shader.info.attr);
        //
        // const comparison_obj_length = Object.keys(comparison_obj).length;
        //
        // if (comparison_obj_length > object_attr_length) {
        //
        //     if (object.indexed === true) {
        //
        //         const initial_array = arr_diff(Object.keys(object.geom.attributes), Object.keys(shader.info.attr));
        //
        //        // only get undefined props
        //         const final_array = initial_array.filter(x => object.geom.attributes[x] === undefined);
        //
        //         throw `Object does not have properties: ${final_array}`;
        //
        //     }
        //     else {
        //         throw `Object does not have properties: ${arr_diff(object.geom.attributes.keys(), shader.info.attr.keys())}`;
        //     }
        //
        // }

        if (! (globalState.vertexBuffer === object.geom.buffers.mainBuffer)) {
            console.log('should only run once')
            gl.bindBuffer(ARRAY_BUFFER, object.geom.buffers.mainBuffer);
            globalState.vertexBuffer = object.geom.buffers.mainBuffer;

            for (let key in object.geom.attributes) {

                if (!object.geom.attributes.hasOwnProperty(key)) continue;

                //wont deal with that here.
                if (object.geom.attributes[key].index === true) continue;

                {
                    const numComponents = object.geom.attributes[key].size;
                    const type          = gl.FLOAT;
                    const normalize     = false;
                    const stride        = object.geom.attributeStride;
                    const offset        = object.geom.attributes[key].offset;

                    gl.vertexAttribPointer(
                        shader.info.attr[key],
                        numComponents,
                        type,
                        normalize,
                        stride,
                        offset
                    );

                    gl.enableVertexAttribArray(shader.info.attr[key]);
                }
                //if is a index buffer
                // if (object.geom.attributes[key].index === true) {
                //
                //     if(! (globalState.indexBuffer === object.geom.buffers[key])){
                //         console.log('switching index buffer');
                //         gl.bindBuffer(ELEMENT_ARRAY_BUFFER, object.geom.buffers[key]);
                //         globalState.indexBuffer = object.geom.buffers[key];
                //     }
                //
                // }

                // else {
                //
                //
                //     const numComponents = object.geom.attributes[key].size;
                //     const type          = gl.FLOAT;
                //     const normalize     = false;
                //     const stride        = 0;
                //     const offset        = 0;
                //
                //     // console.log(object.buffers[key])
                //
                //     gl.bindBuffer(ARRAY_BUFFER, object.geom.buffers[key]);
                //
                //     gl.vertexAttribPointer(
                //         shader.info.attr[key],
                //         numComponents,
                //         type,
                //         normalize,
                //         stride,
                //         offset);
                //
                //     gl.enableVertexAttribArray(
                //         shader.info.attr[key]);
                // }

            }

            if (object.geom.indexed === true) {
                if (!(globalState.indexBuffer === object.geom.buffers.indexBuffer)) {
                    console.log('switching index buffer');
                    gl.bindBuffer(ELEMENT_ARRAY_BUFFER, object.geom.buffers.indexBuffer);
                    globalState.indexBuffer = object.geom.buffers.indexBuffer;
                }
            }
        }

        if(! (globalState.program === shader.program)){
            console.log('shader program switch');
            gl.useProgram(shader.program);
            globalState.program = shader.program;
        }

        const obj_uni    = object.uniforms;
        const shader_uni = shader.info.uni;

        for (let key in obj_uni) {

            if (!obj_uni.hasOwnProperty(key)) continue;

            if (!shader_uni[key]) {
                console.warn(`shader does not have uniform ${key}, will not apply`);
                continue;
            }

            // if (shader_uni[key].data.length > obj_uni[key].length) {
            //     throw new RangeError(`The uniform ${key} has data which is too short`);
            // }

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

        //actual draw
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

}
