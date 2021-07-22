function arr_diff (a1, a2) {

    let a = [], diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (let k in a) {
        diff.push(k);
    }

    return diff;
}

const _lut = [];

for (let i = 0; i < 256; i++) {

    _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);

}

function generateUUID() {

    const d0   = Math.random() * 0xffffffff | 0;
    const d1   = Math.random() * 0xffffffff | 0;
    const d2   = Math.random() * 0xffffffff | 0;
    const d3   = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
                 _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
                 _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
                 _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

    // .toUpperCase() here flattens concatenated strings to save heap memory space.
    return uuid.toUpperCase();

}

export {arr_diff, generateUUID}


function print_mat4(matrix){

    let string = "";

    for(let i = 0; i<16; i+=4){

        string += matrix[i].toString() + " " + matrix[i + 1].toString()+ " " + matrix[i + 2].toString()+ " " + matrix[i + 3].toString() + "\n";

    }

    console.log(string);

}

let mat = [1, 0, 0, 0, 0, 0.80901700258255, 0.5877852439880371, 0, 0, -0.5877852439880371, 0.80901700258255, 0, 0, 0, 0, 1];

print_mat4(mat);

console.log(mat[8],mat[9],mat[10] );
