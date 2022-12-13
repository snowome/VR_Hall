/**
 * 根据一个平面坐标，求一定半径圆，圆边上的点的坐标
 *
 * @param {*} x 横坐标
 * @param {*} y 纵坐标
 * @param {*} r  半径
 * @param {*} start 起始角度
 * @param {*} end 结束角度
 * @param {*} step 角度步进
 * @returns
 */
function createPI(x, y, r, start, end, step = 1) {
    if (start > end) {
        let temp = start;
        start = end;
        end = temp;
    }
    const arr = []
    for (let i = start; i < end; i = i + step) {
        arr.push({
            x: Math.cos(i * Math.PI / 180) * r + x,
            y: Math.sin(i * Math.PI / 180) * r + y
        })
    }
    return arr
}

/**
 * 物体是否在场景中显示
 * 因为Raycaster时，visible=false也可以被点击，所以需要过滤
 * **/

function isVisible(obj) {
    if (!obj.visible) {
        return false
    }
    let parent = obj.parent
    while(parent) {
        if (!parent.visible) {
            return false
        }
        parent = parent.parent
    }
    return true
}

/**
 * 鼠标单击场景中某一个点，或者该点的坐标
 * **/
function getClickPosition(event, camera) {
    event.preventDefault();
    var vector = new THREE.Vector3(); //三维坐标对象

    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    console.log(vector.sub(camera.position).normalize())
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        var selected = intersects[0]; //取第一个物体
        console.log(`{x:${selected.point.x},y:${selected.point.y},z:${selected.point.z}}`)
        console.log("x坐标:" + selected.point.x);
        console.log("y坐标:" + selected.point.y);
        console.log("z坐标:" + selected.point.z);
    }
}

export {
    createPI,
}
