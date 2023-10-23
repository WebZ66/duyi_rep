const btn = document.querySelector('.btn')
const datas = Array.from({ length: 100000 }, (_, i) => i)
btn.onclick = () => {
    const taskHandler = (_, i) => {
        const div = document.createElement('div')
        div.textContent = i
        document.body.appendChild(div)
    }
    const scheduler = (task) => {
        // setTimeout(() => {//每100ms开始执行一次任务，每次任务执行50ms
        //     const start = Date.now()
        //     task(() => Date.now() - start < 50) //isGoOn ，如果时间小于50返回true，继续执行任务，如果大于50就退出
        // }, 100)
        requestIdleCallback((idle) => {
            //每16.7ms开始执行一次任务，每次执行空闲时间
            task(() => idle.timeRemaining > 0)
        })
    }
    performChunk(100000, taskHandler, scheduler)
}

//分时函数
/* 何时开启下一块任务的执行，这会影响任务之间的间隔，即能不能继续执行*/
/* 每块执行多少   一帧里的剩余时间 */
/* function performChunk(datas) {
    if (datas.length === 0) return
    let i = 0
    //执行下一块任务
    function _task() {
        if (i >= datas.length) return
        //浏览器里是有渲染帧的，正常情况下是16.6ms一次(60HZ屏幕)，每一个渲染帧里面可以执行js代码，重排重绘等等
        requestIdleCallback((idle) => {
            //在这一帧的空闲时间里执行任务
            while (idle.timeRemaining() > 0 && i < datas.length) {
                //执行一个任务
                const div = document.createElement('div')
                div.textContent = datas[i]
                document.body.appendChild(div)
                i++
            }
            //循环结束，要么没时间，要么就是没任务，重新调用run
            _task()
        })
    }
    _task()
} */

//封装通用方法
function performChunk(datas, taskHandler, scheduler) {
    if (typeof datas == 'number') {
        //参数归一化，如果传入数字，也转化为伪数组
        datas = { length: datas }
    }
    if (datas.length === 0) return

    let i = 0
    //执行下一块任务
    function _task() {
        if (i >= datas.length) return
        //浏览器里是有渲染帧的，正常情况下是16.6ms一次(60HZ屏幕)，每一个渲染帧里面可以执行js代码，重排重绘等等
        scheduler((isGoOn) => {
            //在这一帧的空闲时间里循环执行任务
            while (isGoOn() && i < datas.length) {
                //执行一个任务
                taskHandler(datas[i], i)
                i++
            }
            //循环结束，要么没时间，要么就是没任务，重新调用run
            _task()
        })
    }
    _task()
}
